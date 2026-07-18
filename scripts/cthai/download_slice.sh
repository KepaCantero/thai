#!/usr/bin/env bash
# Download + parse a slice of video IDs (file with one ID per line).
# Designed to be called by parallel agents — multiple instances can run concurrently
# on different ID slices without overlapping.
#
# Usage: download_slice.sh FILE_WITH_IDS [PARALLEL]
set -uo pipefail
IDS_FILE="${1:?usage: download_slice.sh IDS_FILE [PARALLEL]}"
PARALLEL="${2:-6}"
DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(cd "$DIR/../.." && pwd)"
TRANSCRIPTS="$PROJECT/data/cthai/transcripts"
mkdir -p "$TRANSCRIPTS"

[ -s "$IDS_FILE" ] || { echo "✗ empty ID list"; exit 1; }

# Step 1: parallel VTT download (idempotent — skips existing)
echo "→ [$(basename "$IDS_FILE")] downloading $(wc -l < "$IDS_FILE") VTTs ($PARALLEL parallel)..."
xargs -P "$PARALLEL" -I {} "$DIR/_download_one.sh" {} < "$IDS_FILE" 2>&1 | grep -E "⚠|error" || true

# Step 2: parse all VTTs in this slice that don't yet have transcripts
echo "→ [$(basename "$IDS_FILE")] parsing VTTs..."
OK=0; FAIL=0; SKIP=0
while IFS= read -r ID; do
  VTT="$TRANSCRIPTS/$ID.th-orig.vtt"
  TXT="$TRANSCRIPTS/$ID.transcript.txt"
  [ -f "$TXT" ] && { SKIP=$((SKIP+1)); continue; }
  [ -f "$VTT" ] || { FAIL=$((FAIL+1)); continue; }
  if python3 "$DIR/parse_vtt.py" "$VTT" "$TXT" >/dev/null 2>&1; then
    OK=$((OK+1))
  else
    FAIL=$((FAIL+1))
  fi
done < "$IDS_FILE"

echo "✓ [$(basename "$IDS_FILE")] parsed=$OK skipped=$SKIP failed=$FAIL"
