#!/usr/bin/env bash
#
# populate.sh — POST demo content (case studies, blog posts, announcements)
# to the running backend via the public admin API.
#
# Usage:
#   ./populate.sh                     # uses defaults + backend/.env
#   API_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... ./populate.sh
#
# The script logs in as admin, validates that every payload field is
# non-empty, then POSTs each item. Already-existing slugs are skipped.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PAYLOAD_DIR="$SCRIPT_DIR/payloads"

API_URL="${API_URL:-http://localhost:4000}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@naatiexcellence.com.au}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@123}"

if [[ -f "$BACKEND_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$BACKEND_DIR/.env"
  set +a
  API_URL="${API_URL:-http://localhost:4000}"
  ADMIN_EMAIL="${ADMIN_EMAIL:-admin@naatiexcellence.com.au}"
  ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@123}"
fi

FAILED=0
SKIPPED=0
POSTED=0

log() { printf '\033[1;32m%s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m%s\033[0m\n' "$*"; }
err() { printf '\033[1;31m%s\033[0m\n' "$*"; }

# Fields that must be present and non-empty for each entity type.
declare -A REQUIRED_FIELDS=(
  [blog-posts]="title slug tag excerpt content coverImage author readTime metaTitle metaDescription ogImageUrl ogImageAlt"
  [case-studies]="title slug excerpt content image result tags sortOrder metaTitle metaDescription ogImageUrl ogImageAlt"
  [announcements]="slug text link linkText"
)

validate_payload() {
  local file="$1" type="$2" field
  for field in ${REQUIRED_FIELDS[$type]}; do
    if [[ "$field" == "sortOrder" ]]; then
      if ! jq -e '.["sortOrder"] | (type == "number") and . >= 0' "$file" >/dev/null 2>&1; then
        err "  [INVALID] sortOrder must be a non-negative number in $(basename "$file")"
        return 1
      fi
      continue
    fi
    if ! jq -e --arg f "$field" '.[$f] | type == "string" and length > 0' "$file" >/dev/null 2>&1; then
      err "  [INVALID] $field is missing or empty in $(basename "$file")"
      return 1
    fi
  done

  # DB column limits (metaTitle VarChar(70), metaDescription VarChar(160))
  if jq -e 'has("metaTitle") and (.metaTitle | type == "string" and length > 70)' "$file" >/dev/null 2>&1; then
    err "  [INVALID] metaTitle exceeds 70 chars in $(basename "$file")"
    return 1
  fi
  if jq -e 'has("metaDescription") and (.metaDescription | type == "string" and length > 160)' "$file" >/dev/null 2>&1; then
    err "  [INVALID] metaDescription exceeds 160 chars in $(basename "$file")"
    return 1
  fi
  return 0
}

post_entity() {
  local type="$1" file="$2"
  local name status body
  name="$(basename "$file")"

  if ! validate_payload "$file" "$type"; then
    FAILED=$((FAILED + 1))
    return
  fi

  body="$(mktemp)"
  status="$(curl -s -o "$body" -w '%{http_code}' -X POST \
    "$API_URL/api/$type" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    --data-binary @"$file")"

  if [[ "$status" == "201" || "$status" == "200" ]]; then
    log "  [OK] $type/$name (201)"
    POSTED=$((POSTED + 1))
  elif grep -qi 'already in use\|Unique constraint\|P2002\|reserved' "$body"; then
    warn "  [SKIP] $type/$name already exists"
    SKIPPED=$((SKIPPED + 1))
  else
    err "  [FAIL] $type/$name -> HTTP $status"
    cat "$body"
    FAILED=$((FAILED + 1))
  fi
  rm -f "$body"
}

log "==> Logging in as $ADMIN_EMAIL"
LOGIN_BODY="$(mktemp)"
LOGIN_STATUS="$(curl -s -o "$LOGIN_BODY" -w '%{http_code}' -X POST \
  "$API_URL/api/auth/login" \
  -H 'Content-Type: application/json' \
  --data-binary "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")"

if [[ "$LOGIN_STATUS" != "201" && "$LOGIN_STATUS" != "200" ]]; then
  err "Login failed (HTTP $LOGIN_STATUS):"
  cat "$LOGIN_BODY"
  rm -f "$LOGIN_BODY"
  exit 1
fi

TOKEN="$(jq -r '.data.accessToken // empty' "$LOGIN_BODY")"
rm -f "$LOGIN_BODY"

if [[ -z "$TOKEN" ]]; then
  err "Login response did not contain an access token"
  exit 1
fi
log "==> Got access token"

for type in case-studies blog-posts announcements; do
  dir="$PAYLOAD_DIR/$type"
  [[ -d "$dir" ]] || continue
  log "==> Posting $type"
  for file in "$dir"/*.json; do
    [[ -f "$file" ]] || continue
    post_entity "$type" "$file"
  done
done

echo
log "==> Done: $POSTED posted, $SKIPPED skipped, $FAILED failed"
if [[ "$FAILED" -gt 0 ]]; then
  exit 1
fi