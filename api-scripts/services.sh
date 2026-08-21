#!/bin/bash
# Services API Scripts
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

# 1. List published services
# GET /api/services
# Query params: search, category, page, limit, sortBy, sortOrder, status
list_services() {
  local params="$1"
  curl -X GET "$API_BASE/services?$params" $(get_headers)
}

# 2. Get service by slug
# GET /api/services/slug/:slug
get_service_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/services/slug/$slug" $(get_headers)
}

# 3. Get service by ID
# GET /api/services/:id
get_service_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/services/$id" $(get_headers)
}

# 4. Create service (admin)
# POST /api/services
# Body: title, body, icon, category, sortOrder?, status?, publishedAt?
create_service() {
  local data="$1"
  curl -X POST "$API_BASE/services" $(get_headers) -d "$data"
}

# 5. Update service (admin)
# PATCH /api/services/:id
# Body: title?, body?, icon?, category?, sortOrder?, status?, publishedAt?
update_service() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/services/$id" $(get_headers) -d "$data"
}

# 6. Delete service (admin)
# DELETE /api/services/:id
delete_service() {
  local id="$1"
  curl -X DELETE "$API_BASE/services/$id" $(get_headers)
}

# 7. List all services including unpublished (admin)
# GET /api/services/admin/all
# Query params: search, status, page, limit
admin_list_services() {
  local params="$1"
  curl -X GET "$API_BASE/services/admin/all?$params" $(get_headers)
}

# Example usage:
# list_services "page=1&limit=10&category=coaching"
# get_service_by_slug "private-coaching"
# create_service '{"title":"Private Coaching","body":"One-on-one coaching sessions","icon":"user","category":"coaching","sortOrder":1}'