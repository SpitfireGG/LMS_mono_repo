#!/bin/bash
# Wishlist API Scripts
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

# 1. List wishlist items (authenticated user)
# GET /api/wishlist
# Query params: page, limit
list_wishlist() {
  local params="$1"
  curl -X GET "$API_BASE/wishlist?$params" $(get_headers)
}

# 2. Get wishlist course IDs (authenticated user)
# GET /api/wishlist/ids
get_wishlist_ids() {
  curl -X GET "$API_BASE/wishlist/ids" $(get_headers)
}

# 3. Add to wishlist (authenticated user)
# POST /api/wishlist
# Body: courseId
add_to_wishlist() {
  local course_id="$1"
  curl -X POST "$API_BASE/wishlist" $(get_headers) -d "{\"courseId\":\"$course_id\"}"
}

# 4. Remove from wishlist (authenticated user)
# DELETE /api/wishlist/:courseId
remove_from_wishlist() {
  local course_id="$1"
  curl -X DELETE "$API_BASE/wishlist/$course_id" $(get_headers)
}

# 5. Clear wishlist (authenticated user)
# DELETE /api/wishlist/all
clear_wishlist() {
  curl -X DELETE "$API_BASE/wishlist/all" $(get_headers)
}

# Example usage:
# list_wishlist "page=1&limit=20"
# get_wishlist_ids
# add_to_wishlist "course-id-123"
# remove_from_wishlist "course-id-123"
# clear_wishlist