#!/bin/bash
# Contacts API Scripts
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

# 1. Submit contact form (public)
# POST /api/contacts
# Body: enquiryType, firstName, lastName, email, phone?, courseOfInterest?, preferredContact, message, consented
submit_contact() {
  local data="$1"
  curl -X POST "$API_BASE/contacts" $(get_headers) -d "$data"
}

# 2. List contacts (admin)
# GET /api/contacts
# Query params: page, limit
list_contacts() {
  local params="$1"
  curl -X GET "$API_BASE/contacts?$params" $(get_headers)
}

# Example usage:
# submit_contact '{"enquiryType":"General enquiry","firstName":"John","lastName":"Doe","email":"john@example.com","phone":"123456789","courseOfInterest":"NAATI CCL","preferredContact":"Email","message":"I want to know more...","consented":true}'
# list_contacts "page=1&limit=20"