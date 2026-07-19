#!/usr/bin/env python3
"""Insert Q&A JSON files from data/cthai/qa/ into public/data/app.json conversations array.

Each JSON file can be either:
  - A list of entries, OR
  - An object {"entries": [...], "tag": "...", "video_id": "..."}

Entry schema (all required unless noted):
  source: "cthai:TAG"  (e.g. "cthai:shopping_2")
  q_thai, q_phonetic, q_es, q_tone, q_spanish, q_en
  a_thai, a_phonetic, a_es, a_tone, a_spanish, a_en
  category: one of the 21 allowed categories
  lesson: 14  (auto-set if missing)
  verified: false  (auto-set)

Usage: python3 insert_qa.py data/cthai/qa public/data/app.json
"""
import json
import sys
from pathlib import Path

QA_DIR = Path(sys.argv[1])
DATA_PATH = Path(sys.argv[2])

# 21 categories actually in use across extractions + existing cards
VALID_CATEGORIES = {
    "preguntas", "colores", "numeros", "comida", "animales",
    "cuerpo", "rutina", "tiempo", "sustantivos", "preposiciones",
    "verbos", "saludos", "sabores", "salud", "pronombres",
    "direcciones", "adverbios", "conversacion",
    "naturaleza", "tecnologia", "deportes",
}

entries = []
skipped_broken = []
files = sorted(QA_DIR.glob("*.json"))
if not files:
    print("No Q&A JSON files to insert."); sys.exit(0)

for f in files:
    try:
        data = json.loads(f.read_text(encoding="utf-8"))
    except Exception as e:
        skipped_broken.append(f"{f.name}: bad JSON ({e})"); continue

    if isinstance(data, dict) and "entries" in data:
        items = data["entries"]
    elif isinstance(data, list):
        items = data
    else:
        skipped_broken.append(f"{f.name}: expected list or {{entries: [...]}}"); continue

    for i, e in enumerate(items):
        missing = [k for k in ("source", "q_thai", "a_thai", "q_spanish", "a_spanish", "category") if not e.get(k)]
        if missing:
            skipped_broken.append(f"{f.name}[{i}]: missing {missing}"); continue
        if e["category"] not in VALID_CATEGORIES:
            skipped_broken.append(f"{f.name}[{i}]: bad category '{e['category']}'"); continue
        e.setdefault("lesson", 14)
        e.setdefault("verified", False)
        entries.append(e)

if not entries:
    print("No valid entries."); sys.exit(1)

if skipped_broken:
    report_path = QA_DIR.parent / "broken_entries.txt"
    report_path.write_text("\n".join(skipped_broken) + "\n", encoding="utf-8")
    print(f"⚠ Skipped {len(skipped_broken)} broken entries → {report_path}", file=sys.stderr)

# Load target JSON
text = DATA_PATH.read_text(encoding="utf-8")
app = json.loads(text)
conversations = app.get("conversations", [])
before = len(conversations)

# Dedup by (q_thai, a_thai) — skip entries already in conversations
existing = {(c.get("q_thai"), c.get("a_thai")) for c in conversations}
added = 0
skipped = 0
for e in entries:
    key = (e.get("q_thai"), e.get("a_thai"))
    if key in existing:
        skipped += 1
        continue
    conversations.append(e)
    existing.add(key)
    added += 1

app["conversations"] = conversations

# Backup + write
backup = DATA_PATH.with_suffix(".json.bak")
backup.write_text(text, encoding="utf-8")
DATA_PATH.write_text(json.dumps(app, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"✓ Inserted {added} new entries from {len(files)} JSON files")
print(f"  Skipped {skipped} duplicates (already in conversations)")
print(f"  conversations: {before} → {len(conversations)}")
print(f"  Backup: {backup}")
print(f"  Now run: python3 scripts/gen_audio.py")
