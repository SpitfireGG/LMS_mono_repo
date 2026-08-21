#!/bin/bash
# Subscriptions API Scripts
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

# 1. Subscribe to newsletter (public)
# POST /api/subscriptions
# Body: email
subscribe() {
  local email="$1"
  curl -X POST "$API_BASE/subscriptions" $(get_headers) -d "{\"email\":\"$email\"}"
}

# 2. List subscriptions (admin)
# GET /api/subscriptions
# Query params: page, limit
list_subscriptions() {
  local params="$1"
  curl -X GET "$API_BASE/subscriptions?$params" $(get_headers)
}

# Example usage:
# subscribe "user@example.com"
# list_subscriptions "page=1&limit=50"