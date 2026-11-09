# Callsign

A Lens for Snap Specs. When one of my AI coding sessions needs me, it calls me by name, and I answer out loud without leaving my workout.

**Video (2:34):** https://youtu.be/cusl_jVHmCY

## What it does

I run four AI coding sessions on three machines: Steph (Windows) and Ana (WSL) on my PC, Meli on my Mac, Alina on my Ubuntu Server. When a session needs a decision, it stops and waits for me.

Callsign brings the question to me:

- Nothing shows until a machine needs me.
- A chime and a spoken call play ("Meli calling Joy"), and a card shows the question.
- I answer by voice (in the preview, the Speak button stands in), or with one pinch: Yes, No or Later.
- A row of four callsigns shows who is working and who needs me. Pinch one to see what that machine is doing.

Today the questions are sample data (`Assets/Scripts/CallsignFleetData.ts`). Next is a small relay that my sessions post to, so the Lens shows live questions.

## Run it

1. Open `specs-lens.esproj` in Lens Studio 5.23.2 (5.22 or later).
2. Press Preview. Meli calls first; answer with Speak or a pinch.

## Tests

LEAF tests cover each done criterion in the brief: 6 of 6 pass in the Lens Studio preview (LEAF 2.0.2, Spectacles Interaction Kit 2.0.0).

## How it was built

- Planned with the `plan-lens` skill: `devpost/design-brief.md`.
- Built with Snap's CLAD agents in Lens Studio, using Spectacles Interaction Kit and UI Kit.
- Call voices: Microsoft Edge neural voices (Ava, Emily, Natasha) and Piper (Amy), pre-made clips.
- Devpost text: `devpost/submission.md`.

Made for the Learn AR with SPECS hackathon.
