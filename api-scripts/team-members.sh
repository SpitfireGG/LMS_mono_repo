#!/bin/bash
# Team Members API Scripts
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

# 1. List published team members
# GET /api/team-members
# Query params: search, category, page, limit, sortBy, sortOrder, status
list_team_members() {
  local params="$1"
  curl -X GET "$API_BASE/team-members?$params" $(get_headers)
}

# 2. Get team member by slug
# GET /api/team-members/slug/:slug
get_team_member_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/team-members/slug/$slug" $(get_headers)
}

# 3. Get team member by ID
# GET /api/team-members/:id
get_team_member_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/team-members/$id" $(get_headers)
}

# 4. Create team member (admin)
# POST /api/team-members
# Body: name, role, bio?, image?, category, sortOrder?, status?, publishedAt?
create_team_member() {
  local data="$1"
  curl -X POST "$API_BASE/team-members" $(get_headers) -d "$data"
}

# 5. Update team member (admin)
# PATCH /api/team-members/:id
# Body: name?, role?, bio?, image?, category?, sortOrder?, status?, publishedAt?
update_team_member() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/team-members/$id" $(get_headers) -d "$data"
}

# 6. Delete team member (admin)
# DELETE /api/team-members/:id
delete_team_member() {
  local id="$1"
  curl -X DELETE "$API_BASE/team-members/$id" $(get_headers)
}

# 7. List all team members including unpublished (admin)
# GET /api/team-members/admin/all
# Query params: search, status, page, limit
admin_list_team_members() {
  local params="$1"
  curl -X GET "$API_BASE/team-members/admin/all?$params" $(get_headers)
}

# Example usage:
# list_team_members "page=1&limit=10&category=instructors"
# get_team_member_by_slug "jane-smith"
# create_team_member '{"name":"Jane Smith","role":"Senior Instructor","bio":"Expert in NAATI CCL","category":"instructors","sortOrder":1}'