# Prepared Demo Prompts

These prompts are designed for the recorded/live-review demo described in the workshop concept notes.

The condensed demo narrative:

1. Give the agent context and constraints.
2. Let it inspect the repository and propose a plan.
3. Let it use Sketch via MCP to create a first design concept.
4. Ask it to build the complete first website version from the accepted architecture, prepared content, and Sketch design.
5. Add CI/CD for GitHub Pages and show the finished result.

The website build prompt is intentionally large. In real project work, this should normally be split into smaller reviewable slices for quality assurance. For the workshop, the larger run is an experiment and a clearer story: the agent receives strong context, a design artifact, source boundaries, and accepted architecture decisions, then attempts a complete first implementation.

## Suggested Recording Checkpoints

- `demo/01-orientation-plan` after the agent has inspected the repo and proposed architecture.
- `demo/02-sketch-design` after a first Sketch concept exists via MCP.
- `demo/03-complete-website` after the Astro website builds locally.
- `demo/04-deployment` after GitHub Pages workflow exists.

## How To Use

For each prompt:

1. Paste the `Copy-paste prompt` section into Codex or Claude Code.
2. Let the agent work.
3. Pause and inspect the result using the `Review checkpoint` section.
4. Branch, tag, or commit if the state is useful for the later video walkthrough.

Keep the human review visible. The point of the demo is not that the agent magically knows everything. The point is the loop: task, context, work, review, redirect, decision.
