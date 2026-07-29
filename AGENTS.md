<!-- BEGIN spec-flow orientation -->
## Spec-flow orientation for coding agents

This project uses spec-flow, a per-feature specification workflow. Project-specific rules live in
`spec/constitution.md` and `spec/product-global.md`.

- `spec/features/<slug>/spec.md` is the source of truth for each feature.
- `spec/product.md`, `spec/dashboard.md`, and `spec/view.html` are generated. Never hand-edit them.
- Read `spec/constitution.md`, `spec/product-global.md`, and `spec/engineering.md` before changing
  product code.
- Do not change approved behavior only in code. Record a specification delta or a traced defect.
- Run analyze before implementation and converge after implementation.
- Tests cite the acceptance criterion they verify as `feat-NNN/AC-N`.
- Never use em dashes or en dashes in source, documentation, or release material.
- Never attribute a commit to an AI system.
<!-- END spec-flow orientation -->
