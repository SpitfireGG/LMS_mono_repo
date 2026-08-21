#!/bin/bash
# Announcements API Scripts
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

# 1. List published announcements
# GET /api/announcements
# Query params: search, page, limit, sortBy, sortOrder, status
list_announcements() {
  local params="$1"
  curl -X GET "$API_BASE/announcements?$params" $(get_headers)
}

# 2. Get active announcements
# GET /api/announcements/active
get_active_announcements() {
  curl -X GET "$API_BASE/announcements/active" $(get_headers)
}

# 3. Get announcement by slug
# GET /api/announcements/slug/:slug
get_announcement_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/announcements/slug/$slug" $(get_headers)
}

# 4. Get announcement by ID
# GET /api/announcements/:id
get_announcement_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/announcements/$id" $(get_headers)
}

# 5. Create announcement (admin)
# POST /api/announcements
# Body: text, link?, linkText?, status?, publishedAt?
create_announcement() {
  local data="$1"
  curl -X POST "$API_BASE/announcements" $(get_headers) -d "$data"
}

# 6. Update announcement (admin)
# PATCH /api/announcements/:id
# Body: text?, link?, linkText?, status?, publishedAt?
update_announcement() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/announcements/$id" $(get_headers) -d "$data"
}

# 7. Delete announcement (admin)
# DELETE /api/announcements/:id
delete_announcement() {
  local id="$1"
  curl -X DELETE "$API_BASE/announcements/$id" $(get_headers)
}

# 8. List all announcements including unpublished (admin)
# GET /api/announcements/admin/all
# Query params: search, status, page, limit
admin_list_announcements() {
  local params="$1"
  curl -X GET "$API_BASE/announcements/admin/all?$params" $(get_headers)
}

# Example usage:
# list_announcements "page=1&limit=5"
# get_active_announcements
# create_announcement '{"text":"New course launched!","link":"/courses/new-course","linkText":"View Course"}'