#!/usr/bin/env python3
"""Parse YouTube auto-generated .vtt (karaoke-style) into clean transcript lines."""
import re
import sys
from pathlib import Path

TIMING_TAG = re.compile(r"<[^>]+>")
TS_LINE = re.compile(r"^\d{2}:\d{2}:\d{2}\.\d{3} --> ")

def parse(vtt_path: Path) -> list[str]:
    raw = vtt_path.read_text(encoding="utf-8")
    blocks = raw.split("\n\n")
    # Each block: [timestamp_line, prev_text, new_text_with_tags]
    # The "new text" (3rd line) accumulates; concatenating gives the transcript.
    pieces: list[str] = []
    for block in blocks:
        lines = [ln for ln in block.split("\n") if ln.strip()]
        if not lines or TS_LINE.match(lines[0]) is None:
            continue
        if len(lines) < 2:
            continue
        new_text = lines[-1]  # last line = newly spoken words with tags
        clean = TIMING_TAG.sub("", new_text).strip()
        if clean:
            pieces.append(clean)
    # Dedupe consecutive duplicates (auto-captions repeat a lot)
    deduped: list[str] = []
    for p in pieces:
        if not deduped or deduped[-1] != p:
            deduped.append(p)
    return deduped

def main() -> None:
    src = Path(sys.argv[1])
    out = Path(sys.argv[2])
    pieces = parse(src)
    # Join into one continuous transcript; YT auto-captions already segment by phrase
    out.write_text(" ".join(pieces), encoding="utf-8")
    print(f"Pieces: {len(pieces)}")
    print(f"Wrote: {out}")

if __name__ == "__main__":
    main()
