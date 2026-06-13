# Kitchen Prompt Experiment (A / B / C)

**Branch:** `experiment/prompt-variants-kitchen`  
**Model:** `fal-ai/flux-pro/kontext` (production default)

## Purpose

Compare three prompt strategies on the **same kitchen before photo** to tune how aggressively Kontext Pro renovates a construction-phase kitchen.

| Variant | Intent |
|---------|--------|
| **A** | Current production prompt (`buildStyleRenderPrompt("modern")`) |
| **B** | Strong luxury kitchen redesign — explicit preserve/replace lists |
| **C** | Aggressive renovation — new finishes everywhere, structure only preserved |

## Run

```bash
PROMPT_EXPERIMENT_IMAGE_PATH=./scripts/prompt-experiment-input/kitchen-before.jpg \
  node --env-file=.env.local scripts/run-prompt-experiment-kitchen.mjs
```

Optional env:

- `FAL_MODEL_ID` — defaults to `fal-ai/flux-pro/kontext`
- `FAL_GUIDANCE_SCALE` — defaults to `3.5`

## Output

`scripts/prompt-experiment-output/kitchen/`

| File | Description |
|------|-------------|
| `input-before.jpg` | Copy of input photo |
| `variant-a.jpg` / `variant-b.jpg` / `variant-c.jpg` | Fal outputs |
| `variant-*.json` | Per-variant metadata (URL, seed, timing) |
| `summary.json` | Full run summary |
| `compare.html` | Side-by-side comparison (open in browser) |

## Input image

Default: `scripts/prompt-experiment-input/kitchen-before.jpg` — cropped from a production RenoVision before panel (construction kitchen, June 2026).

Replace with your own kitchen photo via `PROMPT_EXPERIMENT_IMAGE_PATH`.

## Notes

- This branch does **not** change production prompts in `lib/generation/style-prompts.ts`.
- Results are local experiment artifacts; merge prompt changes to `main` only after review.
