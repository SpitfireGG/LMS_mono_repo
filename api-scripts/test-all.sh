#!/bin/bash
# Master API Test Script
# This script demonstrates how to use all API scripts

set -e

API_BASE="${API_BASE:-http://localhost:4000/api}"

echo "=========================================="
echo "LMS Landing Page - API Test Scripts"
echo "=========================================="
echo "API Base: $API_BASE"
echo ""

# Source all API scripts
source ./courses.sh
source ./blog-posts.sh
source ./testimonials.sh
source ./faqs.sh
source ./services.sh
source ./team-members.sh
source ./announcements.sh
source ./case-studies.sh
source ./contacts.sh
source ./subscriptions.sh
source ./mock-tests.sh
source ./wishlist.sh
source ./payments.sh
source ./auth.sh

echo "All API scripts loaded successfully!"
echo ""
echo "Available functions:"
echo "  Courses:           list_courses, get_course_by_slug, get_course_by_id, create_course, update_course, upload_course_image, delete_course, admin_list_courses"
echo "  Blog Posts:        list_blog_posts, get_blog_post_by_slug, get_blog_post_by_id, create_blog_post, update_blog_post, delete_blog_post, admin_list_blog_posts"
echo "  Testimonials:      list_testimonials, get_testimonial_by_slug, get_testimonial_by_id, create_testimonial, update_testimonial, delete_testimonial, admin_list_testimonials"
echo "  FAQs:              list_faqs, get_faq_by_slug, get_faq_by_id, create_faq, update_faq, delete_faq, admin_list_faqs"
echo "  Services:          list_services, get_service_by_slug, get_service_by_id, create_service, update_service, delete_service, admin_list_services"
echo "  Team Members:      list_team_members, get_team_member_by_slug, get_team_member_by_id, create_team_member, update_team_member, delete_team_member, admin_list_team_members"
echo "  Announcements:     list_announcements, get_active_announcements, get_announcement_by_slug, get_announcement_by_id, create_announcement, update_announcement, delete_announcement, admin_list_announcements"
echo "  Case Studies:      list_case_studies, get_case_study_by_slug, get_case_study_by_id, create_case_study, update_case_study, delete_case_study, admin_list_case_studies"
echo "  Contacts:          submit_contact, list_contacts"
echo "  Subscriptions:     subscribe, list_subscriptions"
echo "  Mock Tests:        list_mock_tests, get_mock_test_facets, get_mock_test_by_slug, create_mock_test, update_mock_test, delete_mock_test, admin_list_mock_tests, save_attempt, get_my_attempts, delete_attempt"
echo "  Wishlist:          list_wishlist, get_wishlist_ids, add_to_wishlist, remove_from_wishlist, clear_wishlist"
echo "  Payments:          get_payment_config, create_checkout, list_payments, get_payment_by_id, refresh_payment, sandbox_payment"
echo "  Auth:              login, signup, google_login, verify_email, resend_verification, refresh_token, logout, forgot_password, reset_password, get_profile"
echo ""
echo "Usage examples:"
echo "  # Public endpoints (no token needed)"
echo "  list_courses \"page=1&limit=12&category=lang\""
echo "  get_course_by_slug \"naati-ccl-complete-mastery\""
echo "  submit_contact '{\"enquiryType\":\"General\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"message\":\"Hello\",\"consented\":true}'"
echo ""
echo "  # Authenticated endpoints (set TOKEN first)"
echo "  export TOKEN=\"your-jwt-token\""
echo "  list_wishlist \"page=1&limit=20\""
echo "  add_to_wishlist \"course-id-123\""
echo ""
echo "  # Admin endpoints (set admin TOKEN)"
echo "  export TOKEN=\"admin-jwt-token\""
echo "  create_course '{\"category\":\"lang\",\"tag\":\"NAATI CCL\",\"title\":\"Test\",\"slug\":\"test\",\"author\":\"Author\",\"level\":\"All Levels\",\"lessons\":10,\"hours\":5,\"students\":0,\"rating\":0,\"price\":100}'"