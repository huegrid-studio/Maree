#!/bin/bash
set -e

echo "Running post-merge setup for Tessor..."

# Install/sync npm dependencies
npm install --legacy-peer-deps

echo "Post-merge setup complete."

echo ""
echo "============================================================"
echo "  DOC FRESHNESS REMINDER"
echo "============================================================"
echo "  After any merge, verify these docs are still accurate:"
echo ""
echo "  replit.md"
echo "    -> Update if: project structure, shape types, pattern"
echo "       system, tech stack, or dev/deploy config changed."
echo ""
echo "  guidelines/AGENT_ITERATION.md"
echo "    -> Update if: new shape type added/removed, new UI"
echo "       subsystem added, or iteration recipes need changes."
echo ""
echo "  guidelines/TESSOR_COMPONENTS.md"
echo "    -> Update if: a Tessor component was added, renamed,"
echo "       or had its props changed."
echo ""
echo "  Run 'bash scripts/check-docs.sh' for a freshness check."
echo "  See replit.md 'Documentation Policy' for the full rules."
echo "============================================================"
echo ""
