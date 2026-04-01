#!/bin/bash
# check-docs.sh — Warn if key doc files appear older than the newest changed source file.
# This is a warning-only check; it exits 0 regardless so it never blocks a merge.

DOCS=(
  "replit.md"
  "guidelines/TESSOR_COMPONENTS.md"
  "guidelines/AGENT_ITERATION.md"
)

SRC_DIR="src"

# Find the newest modification time among source files
newest_src=0
newest_src_file=""
while IFS= read -r -d '' f; do
  mt=$(stat -c "%Y" "$f" 2>/dev/null || stat -f "%m" "$f" 2>/dev/null)
  if [ -n "$mt" ] && [ "$mt" -gt "$newest_src" ]; then
    newest_src=$mt
    newest_src_file=$f
  fi
done < <(find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -print0 2>/dev/null)

if [ "$newest_src" -eq 0 ]; then
  echo "[check-docs] No source files found in $SRC_DIR — skipping doc freshness check."
  exit 0
fi

newest_src_date=$(date -d "@$newest_src" "+%Y-%m-%d %H:%M:%S" 2>/dev/null \
  || date -r "$newest_src" "+%Y-%m-%d %H:%M:%S" 2>/dev/null \
  || echo "unknown")

echo "[check-docs] Newest source file: $newest_src_file ($newest_src_date)"

stale=()
for doc in "${DOCS[@]}"; do
  if [ ! -f "$doc" ]; then
    echo "[check-docs] WARNING: Doc file not found: $doc"
    stale+=("$doc (missing)")
    continue
  fi
  doc_mt=$(stat -c "%Y" "$doc" 2>/dev/null || stat -f "%m" "$doc" 2>/dev/null)
  if [ -z "$doc_mt" ]; then
    echo "[check-docs] WARNING: Could not read modification time for $doc"
    stale+=("$doc (unreadable)")
    continue
  fi
  if [ "$doc_mt" -lt "$newest_src" ]; then
    doc_date=$(date -d "@$doc_mt" "+%Y-%m-%d %H:%M:%S" 2>/dev/null \
      || date -r "$doc_mt" "+%Y-%m-%d %H:%M:%S" 2>/dev/null \
      || echo "unknown")
    echo "[check-docs] WARNING: $doc may be stale (last modified $doc_date, src changed $newest_src_date)"
    stale+=("$doc")
  else
    echo "[check-docs] OK: $doc"
  fi
done

if [ ${#stale[@]} -gt 0 ]; then
  echo ""
  echo "[check-docs] DOCS MAY BE STALE — please review:"
  for s in "${stale[@]}"; do
    echo "  - $s"
  done
  echo ""
  echo "[check-docs] Refer to the Documentation Policy in replit.md to decide if an update is needed."
  echo "[check-docs] This is a warning only — no action is blocked."
fi

exit 0
