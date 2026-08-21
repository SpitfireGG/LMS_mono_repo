#!/bin/bash
# Case Studies API Scripts
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

# 1. List published case studies
# GET /api/case-studies
# Query params: search, page, limit, sortBy, sortOrder, status
list_case_studies() {
  local params="$1"
  curl -X GET "$API_BASE/case-studies?$params" $(get_headers)
}

# 2. Get case study by slug
# GET /api/case-studies/slug/:slug
get_case_study_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/case-studies/slug/$slug" $(get_headers)
}

# 3. Get case study by ID
# GET /api/case-studies/:id
get_case_study_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/case-studies/$id" $(get_headers)
}

# 4. Create case study (admin)
# POST /api/case-studies
# Body: title, slug, excerpt, content?, image?, result?, tags?, sortOrder?, metaTitle?, metaDescription?, canonicalUrl?, noindex?, nofollow?, ogImageUrl?, ogImageAlt?, status?, publishedAt?
create_case_study() {
  local data="$1"
  curl -X POST "$API_BASE/case-studies" $(get_headers) -d "$data"
}

# 5. Update case study (admin)
# PATCH /api/case-studies/:id
# Body: title?, slug?, excerpt?, content?, image?, result?, tags?, sortOrder?, metaTitle?, metaDescription?, canonicalUrl?, noindex?, nofollow?, ogImageUrl?, ogImageAlt?, status?, publishedAt?
update_case_study() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/case-studies/$id" $(get_headers) -d "$data"
}

# 6. Delete case study (admin)
# DELETE /api/case-studies/:id
delete_case_study() {
  local id="$1"
  curl -X DELETE "$API_BASE/case-studies/$id" $(get_headers)
}

# 7. List all case studies including unpublished (admin)
# GET /api/case-studies/admin/all
# Query params: search, status, page, limit
admin_list_case_studies() {
  local params="$1"
  curl -X GET "$API_BASE/case-studies/admin/all?$params" $(get_headers)
}

# Example usage:
# list_case_studies "page=1&limit=10"
# get_case_study_by_slug "student-passed-naati-first-attempt"
# create_case_study '{"title":"Student Success","slug":"student-success","excerpt":"How John passed NAATI CCL","content":"Full story...","result":"Scored 85/90","tags":"success,naati"}'