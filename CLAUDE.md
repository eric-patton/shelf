<!-- BEGIN spec-flow orientation -->
## Spec-flow workspace

This project uses spec-flow.

- The per-feature `spec/features/<slug>/spec.md` is canonical.
- `spec/product.md`, `spec/dashboard.md`, and `spec/view.html` are generated and must not be edited
  by hand.
- Read `spec/constitution.md`, `spec/product-global.md`, and `spec/engineering.md` before changing
  product code.
- Continue work through the feature readiness vector and stop at unresolved human gates.
- Do not change approved behavior only in code. Record a specification delta or traced defect.
- Run analyze before implementation and converge after implementation.
- Tests cite the acceptance criterion they verify as `feat-NNN/AC-N`.
- Never use em dashes or en dashes in source, documentation, or release material.
- Never attribute a commit to an AI system.
<!-- END spec-flow orientation -->
