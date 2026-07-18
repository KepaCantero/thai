#!/usr/bin/env python3
"""Insert Q&A JSON files from data/cthai/qa/ into public/data.js conversations array.

Each JSON file can be either:
  - A list of entries, OR
  - An object {"entries": [...], "tag": "...", "video_id": "..."}

Entry schema (all required unless noted):
  source: "cthai:TAG"  (e.g. "cthai:shopping_2")
  q_thai, q_phonetic, q_es, q_tone, q_spanish, q_en
  a_thai, a_phonetic, a_es, a_tone, a_spanish, a_en
  category: one of preguntas|colores|numeros|comida|animales|cuerpo|rutina|tiempo|sustantivos|preposiciones
  lesson: 14  (auto-set if missing)

Usage: python3 insert_qa.py data/cthai/qa public/data.js
"""
import json
import re
import sys
from pathlib import Path

QA_DIR = Path(sys.argv[1])
DATA_PATH = Path(sys.argv[2])

VALID_CATEGORIES = {
    "preguntas", "colores", "numeros", "comida", "animales",
    "cuerpo", "rutina", "tiempo", "sustantivos", "preposiciones",
}

entries = []
errors = []
files = sorted(QA_DIR.glob("*.json"))
if not files:
    print("No Q&A JSON files to insert."); sys.exit(0)

for f in files:
    try:
        data = json.loads(f.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"{f.name}: bad JSON ({e})"); continue

    if isinstance(data, dict) and "entries" in data:
        items = data["entries"]
    elif isinstance(data, list):
        items = data
    else:
        errors.append(f"{f.name}: expected list or {{entries: [...]}}"); continue

    for i, e in enumerate(items):
        # Validate required fields
        missing = [k for k in ("source", "q_thai", "a_thai", "q_spanish", "a_spanish", "category") if not e.get(k)]
        if missing:
            errors.append(f"{f.name}[{i}]: missing {missing}"); continue
        if e["category"] not in VALID_CATEGORIES:
            errors.append(f"{f.name}[{i}]: bad category '{e['category']}'"); continue
        e.setdefault("lesson", 14)
        e.setdefault("verified", False)
        entries.append(e)

if errors:
    print("✗ Validation errors — aborting:", file=sys.stderr)
    for e in errors[:20]: print(f"  {e}", file=sys.stderr)
    if len(errors) > 20: print(f"  ... ({len(errors)-20} more)", file=sys.stderr)
    sys.exit(1)

if not entries:
    print("No valid entries."); sys.exit(0)

# Render each entry as a JS object literal (matches existing format in data.js)
def esc(s): return str(s).replace("\\", "\\\\").replace('"', '\\"')

FIELDS = ["q_thai", "q_phonetic", "q_es", "q_tone", "q_spanish", "q_en",
          "a_thai", "a_phonetic", "a_es", "a_tone", "a_spanish", "a_en"]

def render(e):
    parts = ['    { verified: false']
    parts.append(f'source: "{esc(e["source"])}"')
    for f in FIELDS:
        parts.append(f'{f}: "{esc(e.get(f, ""))}"')
    parts.append(f'category: "{esc(e["category"])}"')
    parts.append('lesson: 14 }')
    return ", ".join(parts)

new_block = "\n".join(render(e) + "," for e in entries)

# Splice before the closing `  ],` of the conversations array
text = DATA_PATH.read_text(encoding="utf-8")
# Find the LAST `  ],\n};` pattern (end of conversations array)
m = list(re.finditer(r'\n  \],\n\};', text))
if not m:
    print("✗ Couldn't find conversations array end pattern"); sys.exit(1)
last = m[-1]
new_text = text[:last.start()] + "\n" + new_block + text[last.start():]

backup = DATA_PATH.with_suffix(".js.bak")
backup.write_text(text, encoding="utf-8")
DATA_PATH.write_text(new_text, encoding="utf-8")

print(f"✓ Inserted {len(entries)} new entries from {len(files)} JSON files")
print(f"  Backup: {backup}")
print(f"  Now run: node -c data.js  &&  python3 scripts/gen_audio.py")
