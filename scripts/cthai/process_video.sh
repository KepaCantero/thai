#!/usr/bin/env bash
# Download + parse a Comprehensible Thai (or any YT) video subtitle for cthai Q&A extraction.
# Usage:
#   ./scripts/cthai/process_video.sh VIDEO_ID SOURCE_TAG
# Example:
#   ./scripts/cthai/process_video.sh iT6HWhoL9KU days_of_week
set -euo pipefail

ID="${1:?usage: process_video.sh VIDEO_ID SOURCE_TAG}"
TAG="${2:?usage: process_video.sh VIDEO_ID SOURCE_TAG}"

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(cd "$DIR/../.." && pwd)"
DATA="$PROJECT/data/cthai"
TRANSCRIPTS="$DATA/transcripts"
VTT="$TRANSCRIPTS/$ID.th-orig.vtt"
TXT="$TRANSCRIPTS/$ID.transcript.txt"

mkdir -p "$TRANSCRIPTS"
if [ ! -f "$VTT" ]; then
  echo "→ Downloading Thai subtitle for $ID..."
  yt-dlp --skip-download --write-auto-subs --sub-langs "th-orig" --sub-format vtt \
    -o "$TRANSCRIPTS/$ID.%(ext)s" "https://www.youtube.com/watch?v=$ID"
fi

echo "→ Parsing to transcript..."
python3 "$DIR/parse_vtt.py" "$VTT" "$TXT"

echo ""
echo "✓ Done. Transcript at: $TXT"
echo "  Next: read it, extract Q&A pairs, add to data.js with:"
echo "    { verified: false, source: \"cthai:$TAG\", ... }"
wc -l "$TXT"
