#!/bin/bash
# Courses API Scripts
# Base URL: http://localhost:4000/api

API_BASE="${API_BASE:-http://localhost:4000/api}"
TOKEN="${TOKEN:-}"

# Headers
get_headers() {
  if [ -n "$TOKEN" ]; then
    echo "-H \"Authorization: Bearer $TOKEN\" -H \"Content-Type: application/json\""
  else
    echo "-H \"Content-Type: application/json\""
  fi
}

# 1. List published courses with filter/sort/pagination
# GET /api/courses
# Query params: search, category, level, priceRange (lt200|200to300|gt300), minRating, sort (popular|rating|price-asc|price-desc|students), page, limit
list_courses() {
  local params="$1"
  curl -X GET "$API_BASE/courses?$params" $(get_headers)
}

# 2. Get course by slug
# GET /api/courses/slug/:slug
get_course_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/courses/slug/$slug" $(get_headers)
}

# 3. Get course by ID
# GET /api/courses/:id
get_course_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/courses/$id" $(get_headers)
}

# 4. Create course (admin)
# POST /api/courses
# Body: category, tag, title, slug, author, level, lessons, hours, students, rating, price, originalPrice?, tone?, glyph?, description?, status?, metaTitle?, metaDescription?, noindex?, nofollow?, ogImageUrl?, ogImageAlt?
create_course() {
  local data="$1"
  curl -X POST "$API_BASE/courses" $(get_headers) -d "$data"
}

# 5. Update course (admin)
# PATCH /api/courses/:id
# Body: category?, tag?, title?, slug?, author?, level?, lessons?, hours?, students?, rating?, price?, originalPrice?, tone?, glyph?, description?, status?, metaTitle?, metaDescription?, noindex?, nofollow?, ogImageUrl?, ogImageAlt?
update_course() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/courses/$id" $(get_headers) -d "$data"
}

# 6. Upload course image (admin)
# POST /api/courses/:id/image
# Form-data: image (file)
upload_course_image() {
  local id="$1"
  local file_path="$2"
  curl -X POST "$API_BASE/courses/$id/image" \
    -H "Authorization: Bearer $TOKEN" \
    -F "image=@$file_path"
}

# 7. Delete course (admin)
# DELETE /api/courses/:id
delete_course() {
  local id="$1"
  curl -X DELETE "$API_BASE/courses/$id" $(get_headers)
}

# 8. List all courses including unpublished (admin)
# GET /api/courses/admin/all
# Query params: search, category, status, page, limit
admin_list_courses() {
  local params="$1"
  curl -X GET "$API_BASE/courses/admin/all?$params" $(get_headers)
}

# Example usage:
# list_courses "page=1&limit=12&category=lang&sort=popular"
# get_course_by_slug "naati-ccl-complete-mastery"
# create_course '{"category":"lang","tag":"NAATI CCL","title":"Test Course","slug":"test-course","author":"Test Author","level":"All Levels","lessons":10,"hours":5,"students":0,"rating":0,"price":100}'