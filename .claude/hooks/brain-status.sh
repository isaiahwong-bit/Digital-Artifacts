#!/usr/bin/env bash
# SessionStart hook: read-only brain sync nudge for Digital Artifacts.
# Never changes anything. Always exits 0 so it cannot disrupt a session.

set -uo pipefail

DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$DIR" 2>/dev/null || exit 0

# Only fire inside the Digital Artifacts repo.
remote="$(git remote get-url origin 2>/dev/null || true)"
case "$remote" in
  *Digital-Artifacts*) ;;
  *) exit 0 ;;
esac

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"

# Uncommitted brain/skills markdown.
dirty="$(git status --porcelain -- brain skills 2>/dev/null | grep -c '\.md' || true)"

# Unpushed commits on the current branch.
ahead=0
if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  ahead="$(git rev-list --count '@{u}'..HEAD 2>/dev/null || echo 0)"
elif git rev-parse --verify origin/main >/dev/null 2>&1; then
  ahead="$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)"
fi

echo "Brain sync nudge (DA):"
echo "  branch: $branch"
echo "  uncommitted brain/skills .md: $dirty"
echo "  unpushed commits: $ahead"

if [ "$branch" = "main" ] && [ "${ahead:-0}" -gt 0 ] 2>/dev/null; then
  echo "  note: on main, a push deploys the live site AND updates what n8n reads."
fi

exit 0
