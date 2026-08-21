#!/bin/bash
# Testimonials API Scripts
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

# 1. List published testimonials
# GET /api/testimonials
# Query params: search, featured, page, limit, sortBy, sortOrder, status
list_testimonials() {
  local params="$1"
  curl -X GET "$API_BASE/testimonials?$params" $(get_headers)
}

# 2. Get testimonial by slug
# GET /api/testimonials/slug/:slug
get_testimonial_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/testimonials/slug/$slug" $(get_headers)
}

# 3. Get testimonial by ID
# GET /api/testimonials/:id
get_testimonial_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/testimonials/$id" $(get_headers)
}

# 4. Create testimonial (admin)
# POST /api/testimonials
# Body: quote, authorName, authorTitle, avatar?, featured?, sortOrder?, status?, publishedAt?
create_testimonial() {
  local data="$1"
  curl -X POST "$API_BASE/testimonials" $(get_headers) -d "$data"
}

# 5. Update testimonial (admin)
# PATCH /api/testimonials/:id
# Body: quote?, authorName?, authorTitle?, avatar?, featured?, sortOrder?, status?, publishedAt?
update_testimonial() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/testimonials/$id" $(get_headers) -d "$data"
}

# 6. Delete testimonial (admin)
# DELETE /api/testimonials/:id
delete_testimonial() {
  local id="$1"
  curl -X DELETE "$API_BASE/testimonials/$id" $(get_headers)
}

# 7. List all testimonials including unpublished (admin)
# GET /api/testimonials/admin/all
# Query params: search, status, page, limit
admin_list_testimonials() {
  local params="$1"
  curl -X GET "$API_BASE/testimonials/admin/all?$params" $(get_headers)
}

# Example usage:
# list_testimonials "page=1&limit=6&featured=true"
# get_testimonial_by_slug "student-success-story"
# create_testimonial '{"quote":"Amazing course!","authorName":"Jane Smith","authorTitle":"NAATI CCL Student","featured":true,"sortOrder":1}'