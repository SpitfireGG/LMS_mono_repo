#!/bin/bash
# Payments API Scripts
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

# 1. Get payment config (public)
# GET /api/payments/config
get_payment_config() {
  curl -X GET "$API_BASE/payments/config" $(get_headers)
}

# 2. Create checkout session (authenticated user)
# POST /api/payments/checkout
# Body: courseId, provider (STRIPE|PAYONEER|CARD), paymentMethodId?, card?, successUrl?, cancelUrl?
# card: number, expMonth, expYear, cvc, holderName?
create_checkout() {
  local data="$1"
  curl -X POST "$API_BASE/payments/checkout" $(get_headers) -d "$data"
}

# 3. List payments (authenticated user)
# GET /api/payments
# Query params: status (PENDING|PROCESSING|REQUIRES_ACTION|SUCCEEDED|FAILED|CANCELLED|REFUNDED), page, limit
list_payments() {
  local params="$1"
  curl -X GET "$API_BASE/payments?$params" $(get_headers)
}

# 4. Get payment by ID (authenticated user)
# GET /api/payments/:id
get_payment_by_id() {
  local id="$1"
  curl -X GET "$API_BASE/payments/$id" $(get_headers)
}

# 5. Refresh payment status from provider (authenticated user)
# POST /api/payments/:id/refresh
refresh_payment() {
  local id="$1"
  curl -X POST "$API_BASE/payments/$id/refresh" $(get_headers) -d '{}'
}

# 6. Sandbox payment decision (admin/sandbox only)
# POST /api/payments/:id/sandbox
# Body: decision (approve|decline)
sandbox_payment() {
  local id="$1"
  local decision="$2"
  curl -X POST "$API_BASE/payments/$id/sandbox" $(get_headers) -d "{\"decision\":\"$decision\"}"
}

# Example usage:
# get_payment_config
# create_checkout '{"courseId":"course-123","provider":"STRIPE","successUrl":"https://example.com/success","cancelUrl":"https://example.com/cancel"}'
# create_checkout '{"courseId":"course-123","provider":"CARD","card":{"number":"4242424242424242","expMonth":12,"expYear":2025,"cvc":"123","holderName":"John Doe"}}'
# list_payments "status=SUCCEEDED&page=1&limit=10"
# get_payment_by_id "payment-id-123"
# refresh_payment "payment-id-123"
# sandbox_payment "payment-id-123" "approve"