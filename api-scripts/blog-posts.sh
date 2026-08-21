#!/bin/bash
# Blog Posts API Scripts
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

# 1. List published blog posts
# GET /api/blog-posts
# Query params: search, tag, page, limit, sortBy, sortOrder, status
list_blog_posts() {
  local params="$1"
  curl -X GET "$API_BASE/blog-posts?$params" $(get_headers)
}

# 2. Get blog post by slug
# GET /api/blog-posts/slug/:slug
get_blog_post_by_slug() {
  local slug="$1"
  curl -X GET "$API_BASE/blog-posts/slug/$slug" $(get_headers)
}

# 3. Get blog post by ID
# GET /api/blog-posts/:id
get_blog_post_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/blog-posts/$id" $(get_headers)
}

# 4. Create blog post (admin)
# POST /api/blog-posts
# Body: tag, title, slug, excerpt, content?, coverImage?, author?, metaTitle?, metaDescription?, canonicalUrl?, noindex?, nofollow?, ogImageUrl?, ogImageAlt?, status?, publishedAt?
create_blog_post() {
  local data="$1"
  curl -X POST "$API_BASE/blog-posts" $(get_headers) -d "$data"
}

# 5. Update blog post (admin)
# PATCH /api/blog-posts/:id
# Body: tag?, title?, slug?, excerpt?, content?, coverImage?, author?, metaTitle?, metaDescription?, canonicalUrl?, noindex?, nofollow?, ogImageUrl?, ogImageAlt?, status?, publishedAt?
update_blog_post() {
  local id="$1"
  local data="$2"
  curl -X PATCH "$API_BASE/blog-posts/$id" $(get_headers) -d "$data"
}

# 6. Delete blog post (admin)
# DELETE /api/blog-posts/:id
delete_blog_post() {
  local id="$1"
  curl -X DELETE "$API_BASE/blog-posts/$id" $(get_headers)
}

# 7. List all blog posts including unpublished (admin)
# GET /api/blog-posts/admin/all
# Query params: search, status, page, limit
admin_list_blog_posts() {
  local params="$1"
  curl -X GET "$API_BASE/blog-posts/admin/all?$params" $(get_headers)
}

# Example usage:
# list_blog_posts "page=1&limit=10&tag=naati&sortBy=publishedAt&sortOrder=desc"
# get_blog_post_by_slug "how-to-prepare-for-naati-ccl"
# create_blog_post '{"tag":"NAATI CCL","title":"How to Prepare","slug":"how-to-prepare","excerpt":"Tips for NAATI CCL","content":"Full content here...","author":"John Doe"}'