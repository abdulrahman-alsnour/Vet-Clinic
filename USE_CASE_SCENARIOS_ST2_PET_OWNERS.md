# Use Case Scenarios - Pet Owners / Registered Users (ST2)

## Use Case 1: Sign Up

| Field | Description |
|-------|-------------|
| **Use Case Name** | Sign Up |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A new user registers an account with name, email, password, and phone number. The system validates email format and password strength (min 8 chars, uppercase, lowercase, number) and hashes the password. |
| **Data** | User name, email address, password, phone number, session information, rate limiting data (IP address, attempt count) |
| **Stimulus** | User navigates to sign up page, fills in registration form with name, email, password, and phone number, and clicks "Sign Up" or "Register" button |
| **Response** | System validates email format, validates password strength (min 8 chars, uppercase, lowercase, number), checks rate limiting (3 attempts per 10 minutes per IP), hashes password with bcrypt (12 rounds), creates user account in database, stores user session in localStorage, redirects to user dashboard, and displays success message |
| **Comments** | Password strength validation includes visual indicator. Rate limiting prevents abuse (3 attempts per 10 minutes per IP). Email must be unique. User role is set to 'user' by default. Password is never stored in plain text. |

---

## Use Case 2: Sign In

| Field | Description |
|-------|-------------|
| **Use Case Name** | Sign In |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A registered user logs in with email and password. The system validates credentials, checks rate limiting, and stores user session in localStorage. Admin users are redirected to admin login. |
| **Data** | Email address, password, session information, rate limiting data (IP address, attempt count, timestamp), user role |
| **Stimulus** | User navigates to login page, enters email and password, and clicks "Login" or "Sign In" button |
| **Response** | System validates rate limiting (5 attempts per 15 minutes per IP), validates email format, retrieves user from database, compares password with bcrypt, checks user role, prevents user enumeration (same error for invalid email/password), stores user session in localStorage if login successful, redirects to user dashboard if user role, redirects to admin login page if admin role, or displays error message if credentials invalid |
| **Comments** | Rate limiting prevents brute force attacks (5 attempts per 15 minutes per IP). User enumeration protection ensures same error message for invalid email and invalid password. Admin users are prevented from logging in through regular user login. Session is stored in localStorage (security consideration for production). |

---

## Use Case 3: Reset Password

| Field | Description |
|-------|-------------|
| **Use Case Name** | Reset Password |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A user requests password reset via email. The system sends a secure reset link that expires after 24 hours. User can then set a new password. |
| **Data** | Email address, reset token, token expiration timestamp, user ID, new password (hashed) |
| **Stimulus** | User clicks "Forgot Password" link on login page, enters email address, and clicks "Send Reset Link" button. Later, user clicks reset link in email, enters new password, and clicks "Reset Password" button |
| **Response** | System validates email exists (without revealing if email is registered for security), generates secure reset token, stores token with expiration (24 hours), sends email with reset link, displays confirmation message. When user clicks link, system validates token and expiration, prompts for new password, validates password strength, hashes new password with bcrypt, updates user password in database, invalidates reset token, and redirects to login page with success message |
| **Comments** | Reset link expires after 24 hours for security. Token should be cryptographically secure and single-use. Email validation should not reveal whether email exists in system. Password strength requirements apply to new password. |

---

## Use Case 4: Update Profile

| Field | Description |
|-------|-------------|
| **Use Case Name** | Update Profile |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user updates their profile information including name, phone, governorate, area, and address. |
| **Data** | User ID, updated name, phone number, governorate, area, address, current user session |
| **Stimulus** | User navigates to profile settings page, modifies profile information in the form, and clicks "Update Profile" or "Save Changes" button |
| **Response** | System validates input data, updates user record in database, updates user session in localStorage with new information, displays success message, refreshes profile information in the UI, and updates profile information used for order pre-filling |
| **Comments** | Profile updates are immediately reflected in user session. Address information is used to pre-fill checkout forms. Governorate and area are used for delivery address selection. Email and password updates may require separate flows for security. |

---

## Use Case 5: Create Pet Profile

| Field | Description |
|-------|-------------|
| **Use Case Name** | Create Pet Profile |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user creates a pet profile with name, species, gender, and optional fields (breed, birth date, color, photo, medical information). The system auto-generates a unique pet code (PET-XXXXX format) and uploads photo to Cloudinary. |
| **Data** | User ID, pet name, species, gender, optional breed, birth date, color, photo file, optional allergies, medications, medical history, surgical history, chronic conditions, pet code (auto-generated) |
| **Stimulus** | User navigates to pets page, clicks "Add Pet" or "New Pet" button, fills in pet information form, optionally uploads pet photo, and clicks "Create Pet" or "Save" button |
| **Response** | System validates required fields (name, species), uploads photo to Cloudinary if provided, auto-generates pet code (PET-XXXXX format), creates pet record in database, stores photo URL, associates pet with user, displays success message, adds pet to pets list, and refreshes pets view |
| **Comments** | Photo upload to Cloudinary validates file type (JPEG, JPG, PNG, WebP, GIF) and file size (max 5MB). Pet code is unique and auto-generated sequentially. Medical information fields are optional but useful for future appointments and records. |

---

## Use Case 6: View Pet Profile

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Pet Profile |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user views detailed information about their pet including basic information, photo, and medical records overview. |
| **Data** | Pet ID, user ID, pet information (name, species, breed, gender, birth date, color, photo), pet code, medical records summary |
| **Stimulus** | User navigates to pets page, clicks on a pet card or "View Details" button for a pet |
| **Response** | System retrieves pet information from database, displays pet profile with all basic information, shows pet photo, displays pet code (PET-XXXXX), shows medical records summary (vaccinations, dewormings, clinic visits, weight history), provides options to edit pet or add medical records, and displays pet in user-friendly format |
| **Comments** | Pet profile provides comprehensive view of pet information. Medical records are displayed chronologically with most recent first. Pet code is displayed for reference and tracking. |

---

## Use Case 7: View Medical Records

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Medical Records |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user views detailed medical records for their pet including vaccinations, dewormings, clinic visits, and weight history, displayed chronologically. |
| **Data** | Pet ID, user ID, vaccination records, deworming records, clinic visit records, weight records, record dates and details |
| **Stimulus** | User navigates to pet profile, clicks "View Medical Records" or expands medical records section |
| **Response** | System retrieves all medical records for the pet from database, displays records organized by type (vaccinations, dewormings, clinic visits, weight), shows records chronologically (most recent first), displays record details (dates, names, notes, next due dates), limits display to 5-10 most recent per type, and provides option to view all records |
| **Comments** | Medical records are displayed with most recent first for easy access to latest information. Records are limited to prevent overwhelming display. Next due dates help users track upcoming care needs. Clinic visits show comprehensive information including diagnosis and treatment. |

---

## Use Case 8: Browse Products

| Field | Description |
|-------|-------------|
| **Use Case Name** | Browse Products |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user browses shop products with category filtering, sorting options (newest, price, name), and pagination (24 products per page). |
| **Data** | Products list, category filter, sort option (newest/price/name), pagination state (page number, 24 per page), product details (name, price, image, stock status, category) |
| **Stimulus** | User navigates to shop page, selects category filter, selects sort option, or clicks pagination controls |
| **Response** | System retrieves products from database based on filters, applies sorting, paginates results (24 per page), displays product cards with images, names, prices, stock status, category badges, "Out of Stock" badges for unavailable products, and provides navigation controls |
| **Comments** | Products are displayed in responsive grid layout. Out of stock products show badges and cannot be added to cart. Sorting and filtering provide better product discovery. Pagination improves performance for large product catalogs. |

---

## Use Case 9: Add to Cart

| Field | Description |
|-------|-------------|
| **Use Case Name** | Add to Cart |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user adds a product to their shopping cart. The system uses Recoil state management to maintain cart state and prevents adding out-of-stock products. |
| **Data** | Product ID, product details (name, price, image), quantity, cart state (Recoil atom), stock quantity |
| **Stimulus** | User views product details, clicks "Add to Cart" button, optionally adjusts quantity |
| **Response** | System checks product stock availability, prevents adding if out of stock (displays error message), adds product to cart with quantity, updates Recoil cart state, updates cart item count in header, displays success message or feedback, and maintains cart state during session |
| **Comments** | Cart state is maintained using Recoil state management until logout or order completion. Out of stock products cannot be added to cart. Cart item count is displayed in header for easy access. Cart persists during session but is cleared on logout. |

---

## Use Case 10: Place Order

| Field | Description |
|-------|-------------|
| **Use Case Name** | Place Order |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user places an order through checkout process with customer information, delivery method, payment method, and address (if delivery). The system creates order with status "pending" and decreases product stock. |
| **Data** | User ID, cart items, customer name, phone number, delivery method (home delivery/pickup), payment method (cash/click), address (governorate, area, address if delivery), order total, product stock quantities |
| **Stimulus** | User navigates to checkout page (cart is pre-filled from profile if logged in), reviews order, fills in or confirms customer information, selects delivery method and payment method, enters address if delivery, and clicks "Place Order" or "Confirm Order" button |
| **Response** | System validates all required fields, validates cart has items, validates stock availability for all items, creates order record with status "pending", associates order with user, decreases product stock quantities, clears cart (Recoil state), redirects to order success page, displays order confirmation, and sends order confirmation (if implemented) |
| **Comments** | Profile information is pre-filled for logged-in users. Stock is immediately decreased when order is created. Order status is "pending" until admin updates it. Address is required only for home delivery. Payment method selection affects checkout flow. |

---

## Use Case 11: View Order History

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Order History |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user views their order history with status filtering (pending, completed, cancelled) and order details. |
| **Data** | User ID, orders list, status filter (pending/completed/cancelled), order details (items, total, status, date, delivery method, payment method) |
| **Stimulus** | User navigates to orders page or "My Orders" section, selects status filter (optional), clicks on an order to view details |
| **Response** | System retrieves user's orders from database, applies status filter if selected, displays orders list with status badges (color-coded), shows order details (items, total, date, delivery method, payment method, status), provides reorder functionality for previous orders, and displays orders in chronological order (most recent first) |
| **Comments** | Orders are filtered by user ID automatically. Status filtering helps users track order progress. Reorder functionality allows quick repurchase. Order details show comprehensive information for reference. |

---

## Use Case 12: Book Appointment

| Field | Description |
|-------|-------------|
| **Use Case Name** | Book Appointment |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user books a veterinary appointment by selecting a pet from their pets, appointment date, time, reason, and optional notes. The system creates appointment with status "upcoming". |
| **Data** | User ID, pet ID (from user's pets), appointment date, appointment time, reason, optional notes |
| **Stimulus** | User navigates to appointments page, clicks "Book Appointment" button, selects pet from dropdown (user's pets), selects appointment date and time, enters reason for visit, optionally adds notes, and clicks "Book Appointment" or "Confirm" button |
| **Response** | System validates required fields (pet, date, time, reason), creates appointment record with status "upcoming", associates appointment with user and pet, stores appointment in database, displays success message, adds appointment to user's appointments list, and refreshes appointments view |
| **Comments** | Appointments are associated with user account for easy tracking. Pet selection is limited to user's registered pets. Appointment status is "upcoming" by default. Optional notes provide additional context for the veterinarian. |

---

## Use Case 13: View Appointments

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Appointments |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user views their appointment history with filtering by status (upcoming, completed, cancelled) and appointment details. |
| **Data** | User ID, appointments list, status filter (upcoming/completed/cancelled), appointment details (date, time, pet, reason, status, notes, completion price if completed) |
| **Stimulus** | User navigates to appointments page or "My Appointments" section, selects status filter (optional) |
| **Response** | System retrieves user's appointments from database, applies status filter if selected, displays appointments list with status color coding (upcoming=blue, completed=green, cancelled=red), shows appointment details (date, time, pet name, reason, status, notes), displays completion price and payment method if completed, and displays appointments in chronological order |
| **Comments** | Appointments are filtered by user ID automatically. Status color coding provides quick visual feedback. Completed appointments show pricing information. Upcoming appointments are highlighted for easy identification. |

---

## Use Case 14: Book Hotel Room

| Field | Description |
|-------|-------------|
| **Use Case Name** | Book Hotel Room |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user books a hotel room for their pet by selecting pet, room type, check-in date, check-out date, pickup/dropoff service options, and optional notes. The system checks room availability and creates reservation with status "booked". |
| **Data** | User ID, pet ID (from user's pets), room type (DOG/CAT/BIRD), check-in date, check-out date, pickup service (boolean), dropoff service (boolean), extra services (array of service names), optional notes, available rooms list |
| **Stimulus** | User navigates to hotel booking page, selects pet from dropdown, selects room type, selects check-in and check-out dates, optionally selects pickup/dropoff services, adds extra services by name, adds optional notes, and clicks "Book Room" or "Confirm Booking" button |
| **Response** | System validates required fields (pet, room type, dates), checks room availability for selected dates, calculates booking cost breakdown (nights, room rate, subtotal, pickup fee, dropoff fee, total), displays cost breakdown, creates reservation record with status "booked", marks room as "OCCUPIED", associates reservation with user and pet, displays success message, adds reservation to user's reservations list, and refreshes reservations view |
| **Comments** | Room availability is checked before booking to prevent overlapping reservations. Cost breakdown is displayed before confirmation. Room rate is 20 JOD per night. Pickup and dropoff fees are 5 JOD each if selected. Extra services are added by name only; amounts are set by admin at checkout. |

---

## Use Case 15: View Reservations

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Reservations |
| **Actor** | Pet Owners / Registered Users (ST2) |
| **Description** | A logged-in user views their hotel reservations with filtering by status and display of pickup/dropoff options and extra services. |
| **Data** | User ID, reservations list, status filter, reservation details (pet, room type, room number, dates, pickup/dropoff options, extra services, status, cost breakdown, payment information if checked-out) |
| **Stimulus** | User navigates to reservations page or "My Reservations" section, selects status filter (optional), clicks on a reservation to view details |
| **Response** | System retrieves user's reservations from database, applies status filter if selected, displays reservations list with status information, shows reservation details (pet name, room type, room number, check-in/check-out dates, pickup/dropoff options, extra services, status), displays cost breakdown and payment information if checked-out, and displays reservations in chronological order |
| **Comments** | Reservations are filtered by user ID automatically. Status filtering helps users track reservation progress. Cost breakdown shows all fees and services. Checked-out reservations show payment information. Pickup and dropoff options are clearly displayed. |

