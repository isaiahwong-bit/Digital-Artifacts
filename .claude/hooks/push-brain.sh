#!/usr/bin/env bash
# SessionEnd hook: push-only, branch-aware. Never stages, never commits.
#   feature branch -> push (safe backup, no deploy)
#   main           -> nudge only (a push to main deploys the live site + updates n8n)
# Always exits 0 so it cannot disrupt a session.

set -uo pipefail

DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$DIR" 2>/dev/null || exit 0

# Only fire inside the Digital Artifacts repo.
remote="$(git remote get-url origin 2>/dev/null || true)"
case "$remote" in
  *Digital-Artifacts*) ;;
  *) exit 0 ;;
esac

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
[ -z "$branch" ] && exit 0

has_upstream=0
git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1 && has_upstream=1

# main: never auto-push. A push to main is a production deploy.
if [ "$branch" = "main" ]; then
  ahead=0
  [ "$has_upstream" = "1" ] && ahead="$(git rev-list --count '@{u}'..HEAD 2>/dev/null || echo 0)"
  if [ "${ahead:-0}" -gt 0 ] 2>/dev/null; then
    echo "main is $ahead commit(s) ahead of origin. Not auto-pushing."
    echo "A push to main deploys the live site and updates what n8n reads. Run /sync or 'git push' when ready to go live."
  fi
  exit 0
fi

# Feature branch: safe to push (no deploy).
if [ "$has_upstream" = "1" ]; then
  ahead="$(git rev-list --count '@{u}'..HEAD 2>/dev/null || echo 0)"
  if [ "${ahead:-0}" -gt 0 ] 2>/dev/null; then
    echo "Pushing $ahead commit(s) on $branch (feature branch, no deploy)."
    git push >/dev/null 2>&1 && echo "Pushed." || echo "Push failed; run 'git push' manually."
  fi
elif git log -1 >/dev/null 2>&1; then
  # No upstream yet: publish the branch so the work is backed up.
  echo "Publishing $branch to origin (feature branch, no deploy)."
  git push -u origin "$branch" >/dev/null 2>&1 && echo "Pushed." || echo "Push failed; run 'git push -u origin $branch' manually."
fi

exit 0
