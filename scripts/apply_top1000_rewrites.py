#!/usr/bin/env python3
"""
Apply manual rewrites to top1000.js.
- Reads one or more JSON files from scripts/rewrites/
- For each entry, finds the rank in top1000.js and replaces the phrase/question/answer fields.
- Writes top1000.js back.

JSON format:
{
  "rewrites": [
    {
      "rank": 4, "thai": "ใน", "category": "adverbios",
      "phrase":   {"thai": "...", "es": "...", "spanish": "...", "en": "..."},
      "question": {"thai": "...", "es": "...", "spanish": "...", "en": "..."},
      "answer":   {"thai": "...", "es": "...", "spanish": "...", "en": "..."}
    }
  ]
}
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOP1000 = os.path.join(ROOT, "top1000.js")
REWRITES_DIR = os.path.join(ROOT, "scripts", "rewrites")


def fmt_field(name, data):
    return (
        f'    {name}: {{ thai: "{data["thai"]}", es: "{data["es"]}", '
        f'spanish: "{data["spanish"]}", en: "{data["en"]}" }}'
    )


def build_replacement(rw):
    return ",\n".join([
        fmt_field("phrase", rw["phrase"]),
        fmt_field("question", rw["question"]),
        fmt_field("answer", rw["answer"]),
    ])


def apply_rewrite(src, rw):
    """Find the entry with this rank and replace its phrase/question/answer."""
    # Match the entry block: from `rank: N` to the closing `}` before next `{ rank:` or `];`
    # Strategy: find "rank: N" then locate the next "phrase: { ... } ... answer: { ... }" and replace.
    rank_pattern = re.compile(
        r'(\{\s*rank:\s*' + str(rw["rank"]) + r',[^}]*?category:\s*"' + re.escape(rw["category"]) + r'"[^}]*?\b)(phrase:\s*\{[^}]*\},\s*question:\s*\{[^}]*\},\s*answer:\s*\{[^}]*\})',
        re.DOTALL
    )
    m = rank_pattern.search(src)
    if not m:
        print(f"[skip] rank {rw['rank']} ({rw['thai']}) — pattern not matched")
        return src, False
    new_block = m.group(1) + build_replacement(rw)
    return src[:m.start()] + new_block + src[m.end():], True


def main():
    files = sorted(sys.argv[1:]) if len(sys.argv) > 1 else sorted(os.listdir(REWRITES_DIR))
    files = [f for f in files if f.endswith(".json")]
    if not files:
        print("No rewrites JSON files found.")
        return

    with open(TOP1000, encoding="utf-8") as f:
        src = f.read()

    applied, skipped = 0, 0
    for fname in files:
        path = fname if os.path.isabs(fname) else os.path.join(REWRITES_DIR, fname)
        if not os.path.exists(path):
            print(f"[skip] {fname}: file not found")
            continue
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        rewrites = data.get("rewrites", [])
        print(f"\n=== {fname}: {len(rewrites)} entries ===")
        for rw in rewrites:
            src, ok = apply_rewrite(src, rw)
            if ok:
                applied += 1
                print(f"  [ok]   rank {rw['rank']:3d}  {rw['thai']}")
            else:
                skipped += 1

    with open(TOP1000, "w", encoding="utf-8") as f:
        f.write(src)
    print(f"\nApplied {applied} rewrites, skipped {skipped}. Wrote {TOP1000}.")


if __name__ == "__main__":
    main()
