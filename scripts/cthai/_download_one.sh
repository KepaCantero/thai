#!/usr/bin/env bash
# Download one video's Thai subtitle. Called by auto_extract.sh in parallel.
# Usage: _download_one.sh VIDEO_ID
set -euo pipefail
ID="$1"
DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(cd "$DIR/../.." && pwd)"
TRANSCRIPTS="$PROJECT/data/cthai/transcripts"
VTT="$TRANSCRIPTS/$ID.th-orig.vtt"
mkdir -p "$TRANSCRIPTS"
[ -f "$VTT" ] && exit 0
yt-dlp --skip-download --write-auto-subs --sub-langs "th-orig" --sub-format vtt \
  -o "$TRANSCRIPTS/$ID.%(ext)s" "https://www.youtube.com/watch?v=$ID" \
  --no-warnings 2>/dev/null || echo "  ⚠ $ID subtitle download failed"
