# Learn AR with SPECS - delivery plan

This is a delivery plan only. It has no Lens code and no design brief.
The Lens idea is open. Joy picks it in `plan-lens`. Only candidate so far: ZettaByte alert cards (undecided).

Times are Dhaka time (UTC+6). Today is Sat 7 Nov 2026, about 07:30 Dhaka.

- Deadline: Mon 9 Nov 22:00 UTC = **Tue 10 Nov 04:00 Dhaka**.
- Our target: submit **Mon 9 Nov 22:00 Dhaka**. That is 6 hours early.
- No glasses needed. Everything runs in the Lens Studio preview.
- Cost: nothing found that needs payment. Lens Studio is free. Devpost account is free. Snap developer account: unverified.

Who: **Joy** or **Agent**. Joy-only steps are marked JOY-ONLY.

## Phase 0 - the gate (Sat 7 Nov, 08:00 to 10:00)

If sign-in fails from Bangladesh, the entry is dead. We stop here and tell Joy.

- [ ] Joy (JOY-ONLY): press **Join hackathon** at learn-specs.devpost.com.
- [ ] Joy: install Lens Studio **5.23.2** from ar.snap.com/download/v5-23-2. Not 5.24: Devpost says sign-in can fail there. Rules accept 5.22 or later. Needs Windows 11 (this PC is).
- [ ] Joy (JOY-ONLY): open Lens Studio and sign in to Snap's developer platform.
- [ ] Gate decision at 10:00: sign-in works = go. Fails = try once with a different account/network, ask in the SPECS Discord channel, then stop by 11:00.

## Phase 1 - setup (Sat 7 Nov, 10:00 to 13:00)

- [ ] Joy: Lens Studio home > SPECS > Base Template > File > Save As (see "How the repo and the Lens project fit" below).
- [ ] Agent: confirm the `.esproj` file sits in the repo root. Fix the layout if not.
- [ ] Joy: keep Lens Studio OPEN on this project. It creates the MCP link the agent uses.
- [ ] Joy: open a terminal in the project folder, run `claude`. Choose "Yes, I trust this folder" and "Use this and all future MCP servers in this project".
- [ ] Agent: in Claude Code run `/plugin marketplace add https://github.com/lens-studio-devs/ls-extensions.git`
- [ ] Agent: `/plugin install ls-clad@ls-extensions` then `/reload-plugins`.
- [ ] Agent: `/mcp` must show `lens-studio` connected. If not, see Snap's "Troubleshoot Lens Studio MCP".
- [ ] Agent: `npx skills add challengepost/learn-specs --all -y` in the same folder.
- [ ] Joy: watch the short concept video on the Devpost overview page. It says what judges look for.

## Phase 2 - plan the Lens (Sat 7 Nov, 14:00 to 15:00)

- [ ] Joy (JOY-ONLY): say `plan-lens`. About 20 to 30 minutes, 6 to 8 questions. Joy answers all of them.
- [ ] Joy: pick the idea here. The skill will not suggest ideas. It writes `devpost/design-brief.md`.
- [ ] Joy (JOY-ONLY): approve the brief ("looks good").
- [ ] Agent: commit `devpost/` to git.

## Phase 3 - build (Sat 7 Nov, 15:00 to Sun 8 Nov 12:00)

- [ ] Joy: clear the chat (`/clear`).
- [ ] Agent: paste the build prompt: "Read devpost/design-brief.md and build it for SPECS. Follow the brief closely. Get the basic flow working first, then add detail. Write and run LEAF tests for each done criterion, and tell me which pass."
- [ ] Agent: a build can take 30 minutes or more. Wait. Commit after each good state.
- [ ] Joy: open the preview and try it. Is the basic flow working?
- [ ] Checkpoint **Sun 8 Nov 12:00**: basic flow works in the preview. If not, go to the fallback.

## Phase 4 - polish (Sun 8 Nov 12:00 to Mon 9 Nov 08:00)

- [ ] Joy + Agent: work through the "After the build" section of the brief. Judge in the preview, write design notes, fix, repeat.
- [ ] Agent: re-run LEAF tests. Report how many pass.
- [ ] Agent: keep a list of any pre-existing code or assets beyond Lens Studio templates (to disclose).
- [ ] **Build freeze Mon 9 Nov 08:00.** After this, only bug fixes. Tag the freeze commit.

## Phase 5 - video (Mon 9 Nov 08:00 to 14:00)

Under 3 minutes. Public on YouTube. See "Video plan".

- [ ] Joy: record the Lens Studio preview, working end to end.
- [ ] Joy: record the voice. Say the problem, who it is for, why it matters.
- [ ] Agent: help with the script and the cut list. (Editing tool is Joy's choice. unverified: no editor chosen yet.)
- [ ] Joy (JOY-ONLY): approve the video.
- [ ] Joy: upload to YouTube, set **Public**. Open the link logged out to check.

## Phase 6 - repo and text (Mon 9 Nov 14:00 to 18:00)

- [ ] Joy (JOY-ONLY): choose the public repo name. Not chosen yet.
- [ ] Agent: check the repo has no secrets, no tokens, nothing private. Check the `.gitignore`.
- [ ] Agent: confirm the repo root has the `.esproj` file and `devpost/`.
- [ ] Joy: create the public GitHub repo and push (the agent does not do this without Joy).
- [ ] Agent: write the short description: what the Lens does, who it is for, what we learned.
- [ ] Agent: write the disclosure of any pre-existing code (or "none beyond templates, libraries and AI tools").
- [ ] Agent: check the repo is public by opening it logged out.

## Phase 7 - submit (Mon 9 Nov 18:00 to 22:00)

- [ ] Joy: open "Enter a Submission". Paste repo link, video link, description, disclosure.
- [ ] Joy (JOY-ONLY): tick the terms and press **Submit**.
- [ ] Joy + Agent: check the page logged out. It shows the video and repo, status SUBMITTED.
- [ ] Target done: **Mon 9 Nov 22:00 Dhaka.**

Buffer: Mon 22:00 to Tue 10 Nov 04:00 Dhaka. Use it only for a fix. Do not plan work in it.

## How the repo and the Lens project fit

Facts from Snap and Devpost:
- Save As makes the project in its own folder. Snap's page only says "Save the project to your machine". unverified: whether it adds an extra subfolder.
- The agent must start in the folder with `.esproj` and `.mcp.json`. `plan-lens` stops if `.esproj` is in a subfolder.
- Devpost says: publish the Lens project folder, with `devpost/` inside it, as the repo.

So the answer: **the repo root and the Lens project folder are the same folder.** `docs/PLAN.md` is just one more file in it.

Steps:
1. In Save As, pick `G:\08_mobile\specs-lens` as the place to save.
2. Look at where `.esproj` landed.
   - In `specs-lens\` itself: done. This git repo is already the right root.
   - In a subfolder `specs-lens\<Name>\`: move `.git` and `docs\` into that subfolder. The subfolder is the repo root and the agent folder. Delete the empty outer folder later.
   - Lens Studio refuses a non-empty folder: Save As into a new empty folder, then move `.git` and `docs\` into it.
3. `plan-lens` creates `devpost/` in that same root.
4. Check `.gitignore` for Lens Studio cache folders. unverified: which folders Lens Studio generates.
5. The `joy` branch stays. The public repo gets pushed from it later.

## Video plan (under 3 minutes)

Judging is four equal parts. Each gets time in the video.

| Part | What to show | Time |
|---|---|---|
| Presentation | Hook: the problem, who it is for, why it matters | 0:00 - 0:30 |
| Innovation / Idea | Why this needs glasses (hands free, in your space, shared view) | 0:30 - 0:50 |
| Technical Implementation | Show the plan (`design-brief.md`), CLAD building, LEAF tests passing, N of N | 0:50 - 1:25 |
| Design | Full Lens working end to end in the preview. Real mouse use. No cuts that hide failures. | 1:25 - 2:30 |
| Presentation | What I learned. Close. | 2:30 - 2:50 |

Rules:
- Screen recording of the Lens Studio preview. Not slides.
- No copyrighted music. No third-party logos or trademarks.
- Public on YouTube. Under 3:00. Aim for 2:50.
- Reviewers will not clone or run the repo. The video is the proof.

## Fallback if time runs short

- **Sun 8 Nov 12:00, no working basic flow:** cut the idea to one spatial moment. Ask CLAD for only that moment. Joy re-runs `plan-lens` for a smaller brief (fresh brief, still planned with the skill).
- **Mon 9 Nov 08:00, still rough:** freeze anyway. Fix only what the video shows. Cut features that do not work.
- **Mon 9 Nov 14:00, no video yet:** record in one take. A plain voice-over on a working preview beats a polished video of something broken.
- **Mon 9 Nov 20:00, anything missing:** submit what exists by 22:00. Video + repo + description. You can edit a Devpost submission before the deadline.
- Never fake it. No slides instead of the Lens. Never write Lens code outside CLAD.

## What fails an entry (do not do)

- Code started before 15 Oct.
- Lens not planned with the `plan-lens` skill, or not built through CLAD.
- A video of slides.
- Pre-existing code not disclosed.
- Private repo.

## Risks and unverified

- Snap sign-in from Bangladesh: **unverified**. This is the gate (Phase 0).
- Bangladesh eligibility: the rules list Brazil, Quebec, Russia, Crimea, Cuba, Iran, North Korea and "any other country sanctioned by US Treasury". Bangladesh is not named. Not fully read. **unverified.** Prize payment method for Bangladesh: **unverified**.
- Snap developer account needing payment: nothing found in the pages read. **unverified.**
- Lens Studio Save As folder behaviour: **unverified** (see above).
- Lens Studio 5.23.2 works with the current CLAD plugin: **unverified.** Snap's guide only says 5.22 or later.
- Windows `claude` CLI install: Snap's page gives `irm https://claude.ai/install.ps1 | iex`. This PC may already have Claude Code. **unverified.**
- Whether Joy already pressed Join: **unverified.**

## Sources

- learn-specs.devpost.com: overview, /rules, /resources (read 2026-11-07)
- developers.specs.com/docs/clad/setup/setup-lens-studio
- developers.specs.com/docs/clad/setup/setup-ai/claude-code-setup
- github.com/challengepost/learn-specs: README, skills/plan-lens/SKILL.md
