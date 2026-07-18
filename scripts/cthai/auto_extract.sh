#!/usr/bin/env bash
# Automated Comprehensible Thai extraction pipeline.
#
# Usage:
#   ./scripts/cthai/auto_extract.sh                # Process up to 10 new videos (default batch)
#   ./scripts/cthai/auto_extract.sh 30             # Process up to 30 new videos
#   ./scripts/cthai/auto_extract.sh 0              # Process ALL pending (no limit)
#   ./scripts/cthai/auto_extract.sh --ids          # Print pending IDs (no work)
#   ./scripts/cthai/auto_extract.sh --insert       # Insert pending Q&A JSON files into data.js
#   ./scripts/cthai/auto_extract.sh --status       # Show counts only
#
# Pipeline: playlists.txt → IDs → download VTT → parse → [agent extracts Q&A] → insert into data.js
#
# Agent step is OUTSIDE this script (Claude invokes the agent with EXTRACT_PROMPT.md).
# This script handles everything else. Designed for unattended batch operation.

set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(cd "$DIR/../.." && pwd)"
DATA="$PROJECT/data/cthai"
TRANSCRIPTS="$DATA/transcripts"
PLAYLISTS="$DATA/playlists.txt"
IDS_FILE="$DATA/ids_all.txt"
QA_DIR="$DATA/qa"
PARALLEL="${CTHAI_PARALLEL:-8}"

mkdir -p "$QA_DIR" "$TRANSCRIPTS"

# --- Modes that don't run the main pipeline ---
case "${1:-}" in
  --status)
    TOTAL=$(wc -l < "$IDS_FILE" 2>/dev/null | tr -d ' ' || echo 0)
    PARSED=$(ls "$TRANSCRIPTS"/*.transcript.txt 2>/dev/null | wc -l | tr -d ' ' || echo 0)
    QA=$(ls "$QA_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ' || echo 0)
    CTHAI=$(grep -c "cthai:" "$PROJECT/public/data.js" 2>/dev/null || echo 0)
    echo "=== cthai status ==="
    echo "  Playlists:     $(grep -c . "$PLAYLISTS" 2>/dev/null || echo 0)"
    echo "  Total IDs:     $TOTAL"
    echo "  Transcripts:   $PARSED"
    echo "  Q&A JSONs:     $QA (ready to insert)"
    echo "  In data.js:    $CTHAI cthai entries"
    exit 0
    ;;
  --insert)
    echo "→ Inserting Q&A JSONs from $QA_DIR into data.js..."
    python3 "$DIR/insert_qa.py" "$QA_DIR" "$PROJECT/public/data.js"
    echo "→ Validating data.js..."
    node -c "$PROJECT/public/data.js"
    echo "→ Regenerating audio manifest..."
    (cd "$PROJECT" && python3 scripts/gen_audio.py 2>&1 | tail -3)
    echo "✓ Insert complete"
    exit 0
    ;;
esac

# === Step 1: Resolve all video IDs from playlists (cached) ===
if [ ! -s "$IDS_FILE" ]; then
  echo "→ Fetching video IDs from playlists (one-time, cached)..."
  : > "$IDS_FILE"
  while IFS= read -r URL; do
    [ -z "$URL" ] && continue
    echo "  • $URL"
    yt-dlp --flat-playlist --no-warnings --print "%(id)s" "$URL" >> "$IDS_FILE" 2>/dev/null || true
  done < "$PLAYLISTS"
  # Dedupe preserving order
  tmp=$(mktemp); awk '!seen[$0]++' "$IDS_FILE" > "$tmp" && mv "$tmp" "$IDS_FILE"
fi
TOTAL=$(grep -c . "$IDS_FILE" || true)

# === Step 2: Find unprocessed (no transcript file) ===
DONE_IDS=$(ls "$TRANSCRIPTS"/*.transcript.txt 2>/dev/null | xargs -n1 basename 2>/dev/null | sed 's/\..*//' | sort -u || true)
TODO_FILE=$(mktemp)
comm -23 <(sort -u "$IDS_FILE") <(printf "%s\n" "$DONE_IDS" | grep -v '^$' | sort -u) > "$TODO_FILE.all"

BATCH="${1:-10}"
if [ "$BATCH" = "0" ]; then
  cp "$TODO_FILE.all" "$TODO_FILE"
else
  head -"$BATCH" "$TODO_FILE.all" > "$TODO_FILE"
fi
TODO_COUNT=$(grep -c . "$TODO_FILE" || true)
PENDING=$(grep -c . "$TODO_FILE.all" || true)

echo "→ Total unique IDs: $TOTAL | Pending: $PENDING | This batch: $TODO_COUNT"
[ "$TODO_COUNT" -gt 0 ] || { echo "✓ Nothing to download. Run with --insert to splice pending Q&A."; rm -f "$TODO_FILE" "$TODO_FILE.all"; exit 0; }

# --ids mode: just print and exit
if [ "${1:-}" = "--ids" ]; then
  cat "$TODO_FILE"
  rm -f "$TODO_FILE" "$TODO_FILE.all"
  exit 0
fi

# === Step 3: Download VTT subtitles in parallel ===
echo "→ Downloading subtitles ($PARALLEL parallel)..."
xargs -P "$PARALLEL" -I {} "$DIR/_download_one.sh" {} < "$TODO_FILE"

# === Step 4: Parse VTTs to transcripts ===
echo "→ Parsing VTTs..."
PARSED_NEW=0
while IFS= read -r ID; do
  TXT="$TRANSCRIPTS/$ID.transcript.txt"
  [ -f "$TXT" ] && continue
  VTT="$TRANSCRIPTS/$ID.th-orig.vtt"
  if [ -f "$VTT" ]; then
    if python3 "$DIR/parse_vtt.py" "$VTT" "$TXT" >/dev/null 2>&1; then
      PARSED_NEW=$((PARSED_NEW + 1))
    else
      echo "  ⚠ $ID parse failed"
    fi
  fi
done < "$TODO_FILE"

# === Step 5: Print next-step instructions ===
NEW_TRANSCRIPTS=()
while IFS= read -r ID; do
  [ -f "$TRANSCRIPTS/$ID.transcript.txt" ] && NEW_TRANSCRIPTS+=("$TRANSCRIPTS/$ID.transcript.txt")
done < "$TODO_FILE"

echo ""
echo "✓ Downloaded + parsed: $PARSED_NEW new transcripts"
echo ""
echo "────────────────────────────────────────────────────────"
echo "→ NEXT STEP: Claude extracts Q&A (invoke agent)"
echo ""
echo "  Read these ${#NEW_TRANSCRIPTS[@]} transcripts:"
for f in "${NEW_TRANSCRIPTS[@]}"; do echo "    $f"; done
echo ""
echo "  Use prompt: scripts/cthai/EXTRACT_PROMPT.md"
echo "  Output JSON per video at: $QA_DIR/{VIDEO_ID}.json"
echo ""
echo "→ Then run: $0 --insert"
echo "────────────────────────────────────────────────────────"

rm -f "$TODO_FILE" "$TODO_FILE.all"
