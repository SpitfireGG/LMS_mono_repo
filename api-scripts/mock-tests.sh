#!/bin/bash
# Mock Tests API Scripts
# Base URL: http://localhost:4000/api

API_BASE="${API_BASE:-http://localhost:4000/api}"
TOKEN="${TOKEN:-}"

get_headers() {
  if [ -n "$TOKEN" ]; then
    echo "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\""
  else
    echo "-H \"Content-Type: application/json\""
  fi
}

# 1. List published mock tests
# GET /api/mock-tests
# Query params: search, language, category, kind (MOCK_TEST|INTERVIEW), page, limit
list_mock_tests() {
  local params="$1"
  curl -X GET "$API_BASE/mock-tests?$params" $(get_headers)
}

# 2. Get mock test facets (filter options)
# GET /api/mock-tests/facets
get_mock_test_facets() {
  curl -X GET "$API_BASE/mock-tests/facets" $(get_headers)
}

# 3. Get mock test by slug
# GET /api/mock-tests/slug/:slug
get_mock_test_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/mock-tests/slug/$slug" $(get_headers)
}

# 4. Create mock test (admin) - multipart form data
# POST /api/mock-tests
# Form fields: title, slug?, description?, language?, category?, level?, kind?, isFree?, sortOrder?, status?, durationSeconds?
# Files: pdf?, media?
create_mock_test() {
  local title="$1"
  local slug="$2"
  local description="$3"
  local language="$4"
  local category="$5"
  local level="$6"
  local kind="$7"
  local isFree="$8"
  local sortOrder="$9"
  local status="${10}"
  local durationSeconds="${11}"
  local pdf_file="${12}"
  local media_file="${13}"

  curl -X POST "$API_BASE/mock-tests" \
    -H "Authorization: Bearer $TOKEN" \
    -F "title=$title" \
    -F "slug=$slug" \
    -F "description=$description" \
    -F "language=$language" \
    -F "category=$category" \
    -F "level=$level" \
    -F "kind=$kind" \
    -F "isFree=$isFree" \
    -F "sortOrder=$sortOrder" \
    -F "status=$status" \
    -F "durationSeconds=$durationSeconds" \
    ${pdf_file:+-F "pdf=@$pdf_file"} \
    ${media_file:+-F "media=@$media_file"}
}

# 5. Update mock test (admin) - multipart form data
# PATCH /api/mock-tests/:id
# Form fields: title?, slug?, description?, language?, category?, level?, kind?, isFree?, sortOrder?, status?, durationSeconds?
# Files: pdf?, media?
update_mock_test() {
  local id="$1"
  shift
  local data="{}"
  local pdf_file=""
  local media_file=""

  # Parse named arguments
  while [ $# -gt 0 ]; do
    case "$1" in
      --pdf) pdf_file="$2"; shift 2 ;;
      --media) media_file="$2"; shift 2 ;;
      *) data=$(echo "$data" | jq ". + {\"$1\": \"$2\"}"); shift 2 ;;
    esac
  done

  curl -X PATCH "$API_BASE/mock-tests/$id" \
    -H "Authorization: Bearer $TOKEN" \
    ${pdf_file:+-F "pdf=@$pdf_file"} \
    ${media_file:+-F "media=@$media_file"} \
    -F "data=$data"
}

# 6. Delete mock test (admin)
# DELETE /api/mock-tests/:id
delete_mock_test() {
  local id="$1"
  curl -X DELETE "$API_BASE/mock-tests/$id" $(get_headers)
}

# 7. List all mock tests including unpublished (admin)
# GET /api/mock-tests/admin/all
# Query params: search, status, language, kind, page, limit
admin_list_mock_tests() {
  local params="$1"
  curl -X GET "$API_BASE/mock-tests/admin/all?$params" $(get_headers)
}

# 8. Save attempt (authenticated user)
# POST /api/mock-tests/:mockTestId/attempts
# Form-data: recording (file), durationSeconds?, notes?
save_attempt() {
  local mock_test_id="$1"
  local recording_file="$2"
  local duration_seconds="$3"
  local notes="$4"

  curl -X POST "$API_BASE/mock-tests/$mock_test_id/attempts" \
    -H "Authorization: Bearer $TOKEN" \
    -F "recording=@$recording_file" \
    ${duration_seconds:+-F "durationSeconds=$duration_seconds"} \
    ${notes:+-F "notes=$notes"}
}

# 9. Get my attempts (authenticated user)
# GET /api/mock-tests/attempts/mine
# Query params: mockTestId?
get_my_attempts() {
  local params="$1"
  curl -X GET "$API_BASE/mock-tests/attempts/mine?$params" $(get_headers)
}

# 10. Delete attempt (authenticated user)
# DELETE /api/mock-tests/attempts/:attemptId
delete_attempt() {
  local attempt_id="$1"
  curl -X DELETE "$API_BASE/mock-tests/attempts/$attempt_id" $(get_headers)
}

# Example usage:
# list_mock_tests "page=1&limit=10&language=english&category=naati"
# get_mock_test_facets
# get_mock_test_by_slug "naati-ccl-mock-test-1"
# create_mock_test "NAATI CCL Mock Test 1" "naati-ccl-mock-test-1" "Practice test" "english" "naati" "All Levels" "MOCK_TEST" "false" "1" "PUBLISHED" "3600" "test.pdf" "audio.mp3"
# save_attempt "mock-test-id" "recording.webm" "1800" "First attempt"