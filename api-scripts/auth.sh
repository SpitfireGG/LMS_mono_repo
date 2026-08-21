#!/bin/bash
# Auth API Scripts
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

# 1. Login
# POST /api/auth/login
# Body: email, password
# Returns: accessToken, refreshToken, user
login() {
  local email="$1"
  local password="$2"
  curl -X POST "$API_BASE/auth/login" $(get_headers) -d "{\"email\":\"$email\",\"password\":\"$password\"}"
}

# 2. Signup
# POST /api/auth/signup
# Body: name, email, password
# Returns: accessToken, refreshToken, user, message
signup() {
  local name="$1"
  local email="$2"
  local password="$3"
  curl -X POST "$API_BASE/auth/signup" $(get_headers) -d "{\"name\":\"$name\",\"email\":\"$email\",\"password\":\"$password\"}"
}

# 3. Google Login
# POST /api/auth/google
# Body: googleId, email, name, image?
# Returns: accessToken, refreshToken, user
google_login() {
  local google_id="$1"
  local email="$2"
  local name="$3"
  local image="$4"
  local data="{\"googleId\":\"$google_id\",\"email\":\"$email\",\"name\":\"$name\"}"
  if [ -n "$image" ]; then
    data=$(echo "$data" | sed "s/}$/,\"image\":\"$image\"}/")
  fi
  curl -X POST "$API_BASE/auth/google" $(get_headers) -d "$data"
}

# 4. Verify Email
# POST /api/auth/verify-email
# Body: token
verify_email() {
  local token="$1"
  curl -X POST "$API_BASE/auth/verify-email" $(get_headers) -d "{\"token\":\"$token\"}"
}

# 5. Resend Verification Email
# POST /api/auth/resend-verification
# Body: email
resend_verification() {
  local email="$1"
  curl -X POST "$API_BASE/auth/resend-verification" $(get_headers) -d "{\"email\":\"$email\"}"
}

# 6. Refresh Token
# POST /api/auth/refresh
# Body: refreshToken
# Returns: accessToken, refreshToken
refresh_token() {
  local refresh_token="$1"
  curl -X POST "$API_BASE/auth/refresh" $(get_headers) -d "{\"refreshToken\":\"$refresh_token\"}"
}

# 7. Logout
# POST /api/auth/logout
logout() {
  curl -X POST "$API_BASE/auth/logout" $(get_headers) -d '{}'
}

# 8. Forgot Password
# POST /api/auth/forgot-password
# Body: email
forgot_password() {
  local email="$1"
  curl -X POST "$API_BASE/auth/forgot-password" $(get_headers) -d "{\"email\":\"$email\"}"
}

# 9. Reset Password
# POST /api/auth/reset-password
# Body: token, password
reset_password() {
  local token="$1"
  local password="$2"
  curl -X POST "$API_BASE/auth/reset-password" $(get_headers) -d "{\"token\":\"$token\",\"password\":\"$password\"}"
}

# 10. Get Profile (authenticated)
# GET /api/auth/profile
get_profile() {
  curl -X GET "$API_BASE/auth/profile" $(get_headers)
}

# Example usage:
# login "user@example.com" "password123"
# signup "John Doe" "john@example.com" "SecurePass123!"
# google_login "google-oauth-id" "john@gmail.com" "John Doe" "https://example.com/photo.jpg"
# verify_email "verification-token"
# resend_verification "john@example.com"
# refresh_token "refresh-token-value"
# logout
# forgot_password "john@example.com"
# reset_password "reset-token" "NewSecurePass123!"
# get_profile