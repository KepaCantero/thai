#!/usr/bin/env python3
"""
Generate static mp3 files for all Thai text in the project.
- Scans public/data/*.json for quoted strings containing Thai chars
- Dedupes
- Fetches mp3 for each from Google Translate TTS endpoint
- Saves as /audio/<n>.mp3 (zero-padded sequential)
- Writes public/data/audio-manifest.json: { "<thai>": "<n>", ... }
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "audio")
MANIFEST_PATH = os.path.join(ROOT, "public", "data", "audio-manifest.json")

# Vite migration moved all data to public/data/*.json.
# audio-manifest.json is itself in this dir but we exclude it to avoid
# circular pollution of the manifest with its own keys.
FILES_TO_SCAN = [
    os.path.join("public", "data", "app.json"),
    os.path.join("public", "data", "top1000.json"),
    os.path.join("public", "data", "top1000-segments.json"),
    os.path.join("public", "data", "pronouns.json"),
]

THAI_RE = re.compile(r"[฀-๿]")
# Match any quoted string (double quotes) containing at least one Thai char
QUOTED_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')

MAX_LEN = 190  # Google TTS q-param length cap (URL stays < 2048)


def collect_strings():
    found = []
    for rel in FILES_TO_SCAN:
        path = os.path.join(ROOT, rel)
        if not os.path.exists(path):
            print(f"[skip] {rel} not found")
            continue
        with open(path, encoding="utf-8") as f:
            text = f.read()
        for m in QUOTED_RE.finditer(text):
            s = m.group(1)
            # Unescape \" \\
            s = s.replace('\\"', '"').replace("\\\\", "\\").strip()
            if not s:
                continue
            # Require the string to contain Thai. Accept any starting char as
            # long as Thai appears later (e.g. "1 อาทิตย์มีกี่วันคะ",
            # "Mission Impossible เป็นหนังแนวอะไร"). Pure-English strings get filtered.
            if not THAI_RE.search(s):
                continue
            if len(s) > MAX_LEN:
                s = s[:MAX_LEN]
            found.append(s)
    return found


def google_tts_url(text):
    q = urllib.parse.quote(text)
    return f"https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q={q}"


def fetch_mp3(text, out_path):
    url = google_tts_url(text)
    # Use curl (known to work). Add user agent to be safe.
    result = subprocess.run(
        ["curl", "-s", "-A", "Mozilla/5.0", "-o", out_path, "-w", "%{http_code}", url],
        capture_output=True, text=True
    )
    code = result.stdout.strip()
    return code


def main():
    limit = None
    if "--limit" in sys.argv:
        idx = sys.argv.index("--limit")
        limit = int(sys.argv[idx + 1])

    os.makedirs(AUDIO_DIR, exist_ok=True)

    # Load existing manifest if any (for resume). Manifest is now plain JSON
    # (was `var AUDIO_MANIFEST = {...};` before the Vite migration).
    existing = {}
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, encoding="utf-8") as f:
                existing = json.load(f)
        except json.JSONDecodeError:
            existing = {}

    raw = collect_strings()
    unique = sorted(set(raw))
    print(f"Collected {len(raw)} quoted strings, {len(unique)} unique Thai strings.")

    if limit:
        unique = unique[:limit]
        print(f"--limit {limit}: processing only {len(unique)} strings.")

    manifest = dict(existing)
    next_id = max([int(v) for v in existing.values()], default=0) + 1

    fetched, skipped, failed = 0, 0, 0
    for i, s in enumerate(unique, 1):
        if s in manifest:
            skipped += 1
            continue
        out_id = f"{next_id:05d}"
        out_path = os.path.join(AUDIO_DIR, f"{out_id}.mp3")
        code = fetch_mp3(s, out_path)
        size = os.path.getsize(out_path) if os.path.exists(out_path) else 0
        if code == "200" and size > 100:
            manifest[s] = out_id
            next_id += 1
            fetched += 1
            print(f"[{i}/{len(unique)}] OK   {out_id}.mp3 ({size}B)  {s[:40]}")
        else:
            failed += 1
            if os.path.exists(out_path):
                os.remove(out_path)
            print(f"[{i}/{len(unique)}] FAIL http={code} size={size}  {s[:40]}")
        time.sleep(0.25)

    # Write manifest as plain JSON (app fetches /data/audio-manifest.json).
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")

    print(f"\nDone. Fetched {fetched}, skipped (already existed) {skipped}, failed {failed}.")
    print(f"Manifest: {MANIFEST_PATH} ({len(manifest)} entries)")


if __name__ == "__main__":
    main()
