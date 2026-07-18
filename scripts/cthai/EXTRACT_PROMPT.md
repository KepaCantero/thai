# cthai Q&A extraction — agent prompt template

You are extracting Comprehensible Thai beginner Q&A pairs from a Thai transcript into a structured JSON for the flashcard app `data.js`.

## Input
One or more transcript files at `data/cthai/transcripts/{VIDEO_ID}.transcript.txt`. Each is a YouTube auto-caption of a Comprehensible Thai lesson (teachers ครูหญิง / ครูฟ้า, beginner level).

## Output
One JSON file per video at `data/cthai/qa/{VIDEO_ID}.json` with this top-level shape:

```json
{
  "video_id": "iT6HWhoL9KU",
  "tag": "days_of_week_2",
  "entries": [
    {
      "source": "cthai:days_of_week_2",
      "q_thai": "วันนี้วันอะไรคะ",
      "q_phonetic": "wan-nîi wan a-rai khâ",
      "q_es": "uan-nî uan à-rai ká",
      "q_tone": "m-h-m-l-m-h",
      "q_spanish": "¿Qué día es hoy?",
      "q_en": "What day is today?",
      "a_thai": "วันนี้วันอังคารค่ะ",
      "a_phonetic": "wan-nîi wan-ang-kaan khâ",
      "a_es": "uan-nî uan-ang-kan kâ",
      "a_tone": "m-h-m-m-m-f",
      "a_spanish": "Hoy es martes.",
      "a_en": "Today is Tuesday.",
      "category": "tiempo"
    }
  ]
}
```

## Rules

1. **Source tag**: derive a short snake_case tag from the video topic (e.g. `shopping`, `days_of_week_2`, `family_members`). Use the same tag in `source` and `tag`.
2. **Yield**: aim for **8–15 Q&A pairs per video**. Skip pure narration, transitions, English explanations, and repeats.
3. **Coverage**: prefer Q&A that demonstrates vocabulary in context. The point is comprehensible input — Thai learners should be able to infer meaning from the Q&A pair.
4. **q_thai / a_thai**: real Thai (no RTGS), no quotes inside. If the lesson repeats a phrase with/without particles, pick ONE form (prefer the version with polite particle).
5. **q_phonetic / a_phonetic**: Paiboon-style romanization with tone marks (á à ǎ â a = falling/low/rising/high/mid). Match existing entries in `data.js` for consistency.
6. **q_es / a_es**: Spanish-friendly phonetic (the learner is a native ES speaker). Use Spanish orthography approximations.
7. **q_tone / a_tone**: one tone label per syllable, hyphen-separated, drawn from `m l h f r` (mid/low/high/falling/rising). One tag per syllable, NOT per word.
8. **q_spanish / a_spanish**: natural Spanish translation.
9. **q_en / a_en**: natural English translation (used as secondary).
10. **Category** MUST be one of: `preguntas`, `colores`, `numeros`, `comida`, `animales`, `cuerpo`, `rutina`, `tiempo`, `sustantivos`, `preposiciones`, `verbos`, `saludos`, `sabores`, `salud`, `pronombres`, `direcciones`, `adverbios`, `conversacion`. Pick the closest fit; when ambiguous default to `sustantivos`.
    - **Priority rule**: if the lesson is about actions/verbs, prefer `verbos` over `rutina` (e.g. "to eat", "to sleep", "to go"). If the lesson is about spatial relationships or movement, prefer `preposiciones` (e.g. "on", "under", "into", "in front of"). Reserve `rutina` for daily-routine sequences (morning/evening habits), and `conversacion` for dialogue-fillers (greetings longer than `saludos`, small talk, filler words).
    - `saludos`: short hello/bye/thank-you formulas. `salud`: feeling sick, body ailments, doctor visits. `sabores`: sweet/sour/spicy/bland and taste verbs. `direcciones`: asking/giving directions, locations. `pronombres`: I/you/he/she/we/they and classifiers used as pronouns. `adverbios`: frequency/degree/manner adverbs (very, often, quickly).
11. **No invented content**: if a part of the transcript is unclear, skip it. Do NOT hallucinate Q&A pairs.

## Validation before writing
For each entry check:
- [ ] All 12 fields (`q_*`, `a_*`) are non-empty strings
- [ ] `q_tone` and `a_tone` have one label per syllable in the corresponding Thai
- [ ] `category` is in the allowlist
- [ ] `source` starts with `cthai:`
- [ ] JSON is valid (no trailing commas, no unescaped quotes)

## After extraction
Write the JSON file(s). Do NOT modify `data.js` directly — the orchestrator script does that via `scripts/cthai/insert_qa.py`.

When done, report:
- Number of videos processed
- Total Q&A pairs extracted
- Any transcripts that yielded 0 pairs (with reason)
