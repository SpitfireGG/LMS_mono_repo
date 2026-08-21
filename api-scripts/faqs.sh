#!/bin/bash
# FAQs API Scripts
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

# 1. List published FAQs
# GET /api/faqs
# Query params: search, category, page, limit, sortBy, sortOrder, status
list_faqs() {
  local params="$1"
  curl -X GET "$API_BASE/faqs?$params" $(get_headers)
}

# 2. Get FAQ by slug
# GET /api/faqs/slug/:slug
get_faq_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/faqs/slug/$slug" $(get_headers)
}

# 3. Get FAQ by ID
# GET /api/faqs/:id
get_faq_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/faqs/$id" $(get_headers)
}

# 4. Create FAQ (admin)
# POST /api/faqs
# Body: question, answer, category, sortOrder?, status?, publishedAt?
create_faq() {
  local data="$1"
  curl -X POST "$API_BASE/faqs" $(get_headers) -d "$data"
}

# 5. Update FAQ (admin)
# PATCH /api/faqs/:id
# Body: question?, answer?, category?, sortOrder?, status?, publishedAt?
update_faq() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/faqs/$id" $(get_headers) -d "$data"
}

# 6. Delete FAQ (admin)
# DELETE /api/faqs/:id
delete_faq() {
  local id="$1"
  curl -X DELETE "$API_BASE/faqs/$id" $(get_headers)
}

# 7. List all FAQs including unpublished (admin)
# GET /api/faqs/admin/all
# Query params: search, status, page, limit
admin_list_faqs() {
  local params="$1"
  curl -X GET "$API_BASE/faqs/admin/all?$params" $(get_headers)
}

# Example usage:
# list_faqs "page=1&limit=20&category=general"
# get_faq_by_slug "what-is-naati-ccl"
# create_faq '{"question":"What is NAATI CCL?","answer":"NAATI CCL is...","category":"general","sortOrder":1}'