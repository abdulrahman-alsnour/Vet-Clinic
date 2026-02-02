# Functional Requirements Document
## VetVoge & Eagle's Vet Clinic System

**Version:** 1.0  
**Date:** 2024  
**Project:** VetVoge Marketplace & Eagle's Vet Clinic Management System

---

## Table of Contents

1. [System Overview](#system-overview)
2. [User Types & Roles](#user-types--roles)
3. [VetVoge Marketplace Requirements](#vetvoge-marketplace-requirements)
4. [Eagle's Vet Clinic Landing Page Requirements](#eagles-vet-clinic-landing-page-requirements)
5. [E-Commerce Requirements](#e-commerce-requirements)
6. [User Authentication & Profile Management](#user-authentication--profile-management)
7. [Pet Management Requirements](#pet-management-requirements)
8. [Appointment Booking Requirements](#appointment-booking-requirements)
9. [Hotel Booking Requirements](#hotel-booking-requirements)
10. [Admin Dashboard Requirements](#admin-dashboard-requirements)
11. [Analytics & Reporting Requirements](#analytics--reporting-requirements)
12. [Pet Adoption Requirements](#pet-adoption-requirements)
13. [System Integration Requirements](#system-integration-requirements)
14. [Business Rules](#business-rules)
15. [Data Requirements](#data-requirements)

---

## System Overview

VetVoge is a marketplace platform that connects users with veterinary clinics. The system consists of:

1. **VetVoge Marketplace** - A welcome page where users browse different vet clinics
2. **Eagle's Vet Clinic** - A specific veterinary clinic within the marketplace
3. **E-Commerce Platform** - Online shop for pet products
4. **Appointment System** - Booking and management of veterinary appointments
5. **Hotel Booking System** - Pet boarding reservations
6. **Pet Management System** - Comprehensive pet profiles and medical records
7. **Admin Dashboard** - Complete clinic management interface

---

## User Types & Roles

### 1. Guest Users
- **Capabilities:**
  - Browse VetVoge marketplace
  - View clinic listings
  - Browse shop products
  - Post pets for adoption
  - View pet adoption listings
  - Add products to cart (stored locally)
  - Place orders (without account)

### 2. Registered Users
- **Capabilities:**
  - All guest user capabilities
  - Create and manage account
  - Book appointments
  - Book hotel rooms
  - Manage pet profiles
  - Track orders
  - View appointment history
  - Manage personal profile

### 3. Admin Users
- **Capabilities:**
  - All registered user capabilities
  - Manage products (CRUD)
  - Manage orders (view, update status, add notes)
  - Manage users/owners (CRUD)
  - Manage appointments (create, update, complete)
  - Manage hotel reservations (create, update, checkout)
  - View analytics and reports
  - Manage pet medical records
  - Access admin dashboard

---

## VetVoge Marketplace Requirements

### FR-MKT-001: Marketplace Landing Page
- **Description:** Display a welcome page for VetVoge marketplace
- **Requirements:**
  - Show VetVoge branding and navigation
  - Display clinic cards with basic information
  - Link to individual clinic pages
  - Display pet adoption section
  - Display shop selection section
  - Smooth scrolling navigation
  - Mobile responsive design

### FR-MKT-002: Clinic Browsing
- **Description:** Allow users to browse available veterinary clinics
- **Requirements:**
  - Display clinic name, location, specialties
  - Show clinic description and tagline
  - Link to clinic-specific landing page
  - Display clinic icon/logo
  - Support future expansion for multiple clinics

### FR-MKT-003: Pet Adoption Section
- **Description:** Public platform for posting and viewing pets for adoption
- **Requirements:**
  - Allow posting without authentication
  - Require: pet name, description, phone number, area, photos
  - Upload multiple images to Cloudinary
  - Display adoption cards with image carousel
  - Clickable phone numbers for contact
  - Filter by status (active/adopted/removed)
  - Image modal for full-size viewing
  - Limit to 50 most recent posts

### FR-MKT-004: Shop Selection
- **Description:** Allow users to choose a shop to browse products
- **Requirements:**
  - Display available shops
  - Link to shop page with shop context
  - Support multiple shops in future
  - Default to Eagle's Vet Clinic shop

### FR-MKT-005: Header Navigation
- **Description:** Context-aware header navigation
- **Requirements:**
  - Show VetVoge header only on root page (/)
  - Show Eagle's Vet Clinic header on all other pages
  - Include clinic navigation when on clinic pages
  - Include shop navigation
  - Mobile responsive menu

---

## Eagle's Vet Clinic Landing Page Requirements

### FR-CLINIC-001: Landing Page Display
- **Description:** Display Eagle's Vet Clinic landing page
- **Requirements:**
  - Hero section with clinic information
  - Services showcase
  - Staff/team section
  - Contact information
  - Footer with links
  - Smooth scrolling for anchor links

### FR-CLINIC-002: Services Section
- **Description:** Display available clinic services
- **Requirements:**
  - List veterinary services
  - Display service descriptions
  - Visual service cards

### FR-CLINIC-003: Staff Section
- **Description:** Display clinic staff members
- **Requirements:**
  - Show staff photos and names
  - Display staff roles/specialties
  - Carousel/slider interface

### FR-CLINIC-004: Contact Section
- **Description:** Display contact information and online services
- **Requirements:**
  - Contact details (address, phone, email)
  - Social media links (WhatsApp, Instagram)
  - Online services information
  - Link to login/signup

---

## E-Commerce Requirements

### FR-ECOMM-001: Product Browsing
- **Description:** Allow users to browse products
- **Requirements:**
  - Display products in grid layout
  - Filter by category
  - Sort by: newest, price (low-high), price (high-low), name (A-Z)
  - Pagination support (24 products per page)
  - Show product name, price, image, stock status
  - Display category information
  - Support main categories: Dogs, Cats, Birds, Fish & Aquatic, Small Animals, Reptiles, General
  - Subcategory navigation

### FR-ECOMM-002: Product Details
- **Description:** Display detailed product information
- **Requirements:**
  - Show product name, description, price
  - Display multiple product images with gallery
  - Show stock availability
  - Show category
  - Add to cart functionality
  - Track product views for analytics
  - Display stock count

### FR-ECOMM-003: Shopping Cart
- **Description:** Manage shopping cart items
- **Requirements:**
  - Add products to cart (stored in Recoil state)
  - Update quantities
  - Remove items
  - Display cart item count in header
  - Persist cart during session
  - Show subtotal, delivery fee, total
  - Support guest checkout

### FR-ECOMM-004: Checkout Process
- **Description:** Complete purchase order
- **Requirements:**
  - Require: customer name, phone, address (if delivery)
  - Delivery method: home delivery or pickup
  - Payment method: cash (pickup) or cash/click (delivery)
  - Governorate and area selection (Jordanian locations)
  - Validate required fields
  - Create order with status "pending"
  - Decrease product stock immediately
  - Associate order with user if logged in
  - Redirect to order success page

### FR-ECOMM-005: Order Management (User)
- **Description:** Users can view and track their orders
- **Requirements:**
  - Display order history
  - Show order status (pending/completed/cancelled)
  - Display order items with quantities
  - Show order total and date
  - Display delivery method
  - Filter orders by status
  - Reorder functionality

### FR-ECOMM-006: Product Stock Management
- **Description:** Track and manage product inventory
- **Requirements:**
  - Decrease stock when order placed
  - Restore stock if order cancelled
  - Display "Out of Stock" when stock is 0
  - Prevent adding out-of-stock items to cart
  - Show stock count on product pages

---

## User Authentication & Profile Management

### FR-AUTH-001: User Registration
- **Description:** Allow new users to create accounts
- **Requirements:**
  - Require: name, email, password, phone
  - Validate email format
  - Validate password: min 8 chars, uppercase, lowercase, number
  - Check for existing email
  - Hash password with bcrypt (12 rounds)
  - Support account upgrade for phone-based accounts
  - Rate limiting: 3 attempts per 10 minutes per IP
  - Auto-login after successful signup (if upgrade)

### FR-AUTH-002: User Login
- **Description:** Authenticate existing users
- **Requirements:**
  - Require: email, password
  - Validate credentials
  - Prevent user enumeration (same error message)
  - Rate limiting: 5 attempts per 15 minutes per IP
  - Store user data in localStorage
  - Redirect based on role (user/admin)
  - Block admin login from user login page

### FR-AUTH-003: User Logout
- **Description:** End user session
- **Requirements:**
  - Clear localStorage (user/adminUser)
  - Call logout API endpoint
  - Redirect to appropriate page
  - Clear cart state

### FR-AUTH-004: Profile Management
- **Description:** Users can manage their profile information
- **Requirements:**
  - Update: name, phone, governorate, area, address
  - Display profile information
  - Pre-fill checkout forms with profile data
  - Validate input data

### FR-AUTH-005: Account Upgrade
- **Description:** Upgrade phone-based accounts to full accounts
- **Requirements:**
  - Detect existing phone number
  - Check for auto-generated email (@vetclinic.local)
  - Allow upgrade with email and password
  - Preserve existing data (orders, pets, appointments)
  - Auto-login after upgrade

---

## Pet Management Requirements

### FR-PET-001: Pet Registration
- **Description:** Users can register their pets
- **Requirements:**
  - Require: name, species, gender
  - Optional: breed, birth date, color, photo
  - Optional medical: allergies, medications, medical history, surgical history, chronic conditions
  - Auto-generate unique pet code (PET-XXXXX)
  - Upload pet photo to Cloudinary
  - Associate pet with user account

### FR-PET-002: Pet Profile Viewing
- **Description:** Display pet information and medical records
- **Requirements:**
  - Show basic pet information
  - Display vaccination records
  - Display deworming records
  - Display clinic visit history
  - Display weight history
  - Show medical history, allergies, medications
  - Limit displayed records (5-10 most recent)

### FR-PET-003: Pet Profile Editing
- **Description:** Update pet information
- **Requirements:**
  - Edit all pet fields
  - Update pet photo
  - Update medical information
  - Preserve historical records

### FR-PET-004: Medical Records Management
- **Description:** Track and manage pet medical records
- **Requirements:**
  - Add vaccinations (name, date, next due, notes)
  - Add dewormings (name, date, next due, notes)
  - Add clinic visits (date, reason, diagnosis, treatment, prescriptions, notes, next appointment)
  - Add weight records (date, weight, notes)
  - Display records chronologically
  - Admin can add records for any pet
  - Users can view their pet's records

### FR-PET-005: Pet Deletion
- **Description:** Remove pet from system
- **Requirements:**
  - Allow pet deletion (cascade to related records)
  - Confirm deletion action
  - Remove associated appointments and reservations

---

## Appointment Booking Requirements

### FR-APT-001: Appointment Booking (User)
- **Description:** Users can book veterinary appointments
- **Requirements:**
  - Select pet (from user's pets or enter pet name)
  - Select appointment date and time
  - Provide reason for visit
  - Add optional notes
  - Create appointment with status "upcoming"
  - Associate with user account if logged in
  - Support guest bookings with owner name/phone

### FR-APT-002: Appointment Viewing (User)
- **Description:** Users can view their appointments
- **Requirements:**
  - Display upcoming appointments
  - Display past appointments
  - Show appointment status
  - Display appointment details (date, time, reason, pet, notes)
  - Filter by status
  - Display completion price (if completed)

### FR-APT-003: Appointment Management (Admin)
- **Description:** Admin can manage all appointments
- **Requirements:**
  - View all appointments (paginated, 50 per page)
  - Filter by status (upcoming/completed/cancelled)
  - Filter by date range
  - Search by customer name, phone, or pet name
  - Update appointment details (date, time, reason, notes)
  - Update appointment status
  - Complete appointment with price and payment method
  - Delete appointments
  - Create appointments for any user

### FR-APT-004: Appointment Status Management
- **Description:** Track appointment lifecycle
- **Requirements:**
  - Status: upcoming, completed, cancelled, no-show
  - Completion requires: price, payment method
  - Status changes logged with timestamps

---

## Hotel Booking Requirements

### FR-HOTEL-001: Room Availability Display
- **Description:** Show available hotel rooms
- **Requirements:**
  - Display rooms by type (DOG, CAT, BIRD)
  - Show room status (AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE)
  - Display room numbers
  - Filter rooms by type
  - Show room reservations

### FR-HOTEL-002: Hotel Booking (User)
- **Description:** Users can book hotel rooms for pets
- **Requirements:**
  - Select pet from user's pets
  - Select room type (DOG, CAT, BIRD)
  - Select check-in and check-out dates
  - System checks room availability for selected dates
  - Option for pickup service
  - Option for dropoff service
  - Add extra services (name only, admin sets amount)
  - Add optional notes
  - Display cost breakdown (nights × rate + fees)
  - Create reservation with status "booked"
  - Mark room as OCCUPIED after booking

### FR-HOTEL-003: Hotel Booking Display (User)
- **Description:** Users can view their hotel reservations
- **Requirements:**
  - Display upcoming reservations
  - Display past reservations
  - Show reservation details (dates, room, pet, status)
  - Display pickup/dropoff status
  - Display extra services
  - Filter by status

### FR-HOTEL-004: Hotel Management (Admin)
- **Description:** Admin manages hotel operations
- **Requirements:**
  - View all rooms by type (separate pages for DOG, CAT, BIRD)
  - Create new rooms
  - Update room status
  - View all reservations
  - Filter reservations by room type
  - Create reservations for any customer
  - Update reservation details
  - Check-in reservations
  - Checkout reservations with detailed pricing

### FR-HOTEL-005: Hotel Checkout Process
- **Description:** Admin completes hotel reservations
- **Requirements:**
  - Calculate total nights
  - Set room rate (default: 20 JOD per night)
  - Calculate subtotal (nights × rate)
  - Add pickup fee (if applicable, default: 5 JOD)
  - Add dropoff fee (if applicable, default: 5 JOD)
  - Set amounts for extra services
  - Calculate total
  - Select payment method
  - Update reservation status to "checked_out"
  - Mark room as AVAILABLE
  - Record checkout timestamp

### FR-HOTEL-006: Room Availability Check
- **Description:** Ensure no overlapping reservations
- **Requirements:**
  - Check for date overlaps before booking
  - Only allow booking if room is available for dates
  - Exclude cancelled and checked-out reservations
  - Prevent double-booking

### FR-HOTEL-007: Extra Services Management
- **Description:** Handle additional hotel services
- **Requirements:**
  - User adds service name only
  - Admin sets service amount at checkout
  - Store services as JSON array
  - Display services in reservation details
  - Include in total calculation

---

## Admin Dashboard Requirements

### FR-ADMIN-001: Dashboard Overview
- **Description:** Main admin interface
- **Requirements:**
  - Tabbed interface: Products, Orders, Analytics, Owners, Appointments, Hotel
  - Persist active tab in localStorage
  - Maintain tab state on page refresh
  - Display key metrics cards
  - Quick access to all management functions

### FR-ADMIN-002: Product Management
- **Description:** Complete product CRUD operations
- **Requirements:**
  - Create products (name, description, price, image, stock, category)
  - Read products list (paginated, sortable)
  - Update products (all fields except ID)
  - Delete products
  - Auto-generate product slug from name
  - Upload product images to Cloudinary
  - Support multiple images (comma-separated)
  - Manage stock quantities
  - Filter by category

### FR-ADMIN-003: Order Management
- **Description:** Manage customer orders
- **Requirements:**
  - View all orders (paginated, 50 per page)
  - Filter by status (pending/completed/cancelled)
  - Filter by date range
  - View order details (items, customer, address, payment)
  - Update order status
  - Add order notes
  - Manage stock on status change (restore if cancelled, decrement if reactivated)
  - View order timeline in revenue modal

### FR-ADMIN-004: User/Owner Management
- **Description:** Manage customer accounts
- **Requirements:**
  - View all users (regular users only, not admins)
  - Filter by search criteria
  - View user details (profile, pets, orders, appointments)
  - Create new user accounts
  - Update user information
  - Delete users (cascade to related data)
  - View user's pets and medical records
  - Manage pets for users

### FR-ADMIN-005: Pet Management (Admin)
- **Description:** Admin can manage any pet
- **Requirements:**
  - View pet details
  - Edit pet information
  - Add medical records (vaccinations, dewormings, visits, weight)
  - Delete pets
  - View complete medical history

### FR-ADMIN-006: Appointment Management
- **Description:** Admin manages all appointments
- **Requirements:**
  - View all appointments (paginated, filterable, searchable)
  - Create appointments
  - Update appointment details
  - Complete appointments with pricing
  - Cancel appointments
  - Delete appointments
  - View appointment details modal
  - Search by customer name, phone, pet name

### FR-ADMIN-007: Hotel Management
- **Description:** Complete hotel operations management
- **Requirements:**
  - Manage rooms by type (separate pages for each type)
  - Create and update rooms
  - View reservations by room
  - Check-in/checkout reservations
  - Calculate and set pricing
  - View reservation details modal
  - Manage extra services

### FR-ADMIN-008: Analytics & Reports
- **Description:** View business analytics
- **Requirements:**
  - Revenue analytics (orders, appointments, hotel)
  - Revenue timeline with details modal
  - Order statistics (total, pending, completed, cancelled)
  - Appointment statistics (total, upcoming, completed, cancelled)
  - Hotel statistics (total, booked, checked-in, checked-out, cancelled)
  - Page views tracking
  - Product views tracking
  - Top products by views
  - Unique visitors count
  - Filter by time period (today, week, month, 3 months, year)
  - Detailed payment breakdown for hotel reservations

### FR-ADMIN-009: Revenue Details Modal
- **Description:** Detailed revenue breakdown
- **Requirements:**
  - Display revenue items from orders, appointments, hotel
  - Show total revenue
  - Show revenue by source
  - Display payment breakdown for hotel (nights, rate, fees, services)
  - Timeline view of revenue items
  - Clickable items for full details

### FR-ADMIN-010: Analytics Card Details Modals
- **Description:** View full lists for analytics cards
- **Requirements:**
  - Orders modal (all orders with filters)
  - Appointments modal (all appointments with filters)
  - Hotel reservations modal (all reservations with filters)
  - Display as modal popups (not page navigation)
  - Maintain filters and pagination

---

## Analytics & Reporting Requirements

### FR-ANALYTICS-001: Page View Tracking
- **Description:** Track page visits for analytics
- **Requirements:**
  - Track page views with session ID
  - Store in PageView model
  - Exclude admin pages from tracking
  - Generate unique session IDs
  - Store session ID in localStorage

### FR-ANALYTICS-002: Product View Tracking
- **Description:** Track product page visits
- **Requirements:**
  - Track when user views product detail page
  - Store in ProductView model
  - Associate with product ID
  - Used for top products analytics

### FR-ANALYTICS-003: Revenue Calculation
- **Description:** Calculate total revenue accurately
- **Requirements:**
  - Only include completed orders in revenue
  - Only include completed appointments with price
  - Only include checked-out hotel reservations with total
  - Exclude pending orders from revenue
  - Support date range filtering
  - Calculate separately: order revenue, appointment revenue, hotel revenue
  - Display total combined revenue

### FR-ANALYTICS-004: Statistics Reporting
- **Description:** Generate business statistics
- **Requirements:**
  - Order counts by status
  - Appointment counts by status
  - Hotel reservation counts by status
  - Unique visitor counts
  - Page view counts
  - Product view counts
  - Top products by views
  - Support time period filtering

---

## Pet Adoption Requirements

### FR-ADOPT-001: Post Pet for Adoption
- **Description:** Public posting of pets for adoption
- **Requirements:**
  - No authentication required
  - Require: pet name, description, phone number, area
  - Require at least one image
  - Upload multiple images to Cloudinary
  - Store images as JSON array in database
  - Status: active (default), adopted, removed
  - Limit to 50 most recent posts

### FR-ADOPT-002: View Adoption Listings
- **Description:** Browse pets available for adoption
- **Requirements:**
  - Display adoption cards with images
  - Image carousel with navigation
  - Clickable phone numbers (tel: links)
  - Display pet name, description, area
  - Full-size image modal
  - Filter by status (default: active)
  - Responsive grid layout

### FR-ADOPT-003: Adoption Card Interaction
- **Description:** Enhanced user experience for adoption cards
- **Requirements:**
  - Image carousel with prev/next buttons
  - Image indicators/dots
  - Image counter display
  - Click to open full-size modal
  - Thumbnail navigation in modal
  - Remove "Contact Owner" button (use clickable phone number)

---

## System Integration Requirements

### FR-INT-001: Cloudinary Integration
- **Description:** Image upload and storage
- **Requirements:**
  - Upload images via API endpoint
  - Support product images
  - Support pet photos
  - Support adoption images
  - Validate file type (images only)
  - Validate file size (max 5MB)
  - Store URLs in database
  - Organize in folders (eagles-vet, eagles-vet/pets)

### FR-INT-002: Database Integration
- **Description:** PostgreSQL database via Prisma ORM
- **Requirements:**
  - All data models properly defined
  - Relationships established
  - Indexes for performance
  - Cascade deletes configured
  - Migration support

### FR-INT-003: State Management
- **Description:** Client-side state management
- **Requirements:**
  - Recoil for cart state
  - localStorage for user session
  - Persist cart during session
  - Clear state on logout

### FR-INT-004: Header Context Management
- **Description:** Context-aware header display
- **Requirements:**
  - VetVoge header on root page only (/)
  - Eagle's Vet Clinic header on all other pages
  - Shop context support
  - Mobile responsive navigation
  - Smooth scrolling for anchor links

---

## Business Rules

### BR-001: Revenue Calculation
- Only completed orders count toward revenue
- Only completed appointments with price count toward revenue
- Only checked-out hotel reservations with total count toward revenue
- Pending orders are excluded from revenue calculations

### BR-002: Stock Management
- Stock decreases immediately when order is placed
- Stock restores if order is cancelled
- Stock decreases again if cancelled order is reactivated
- Out-of-stock products cannot be added to cart

### BR-003: Hotel Room Availability
- Room must be AVAILABLE or not reserved for selected dates
- Check for overlapping reservations
- Mark room as OCCUPIED after booking
- Mark room as AVAILABLE after checkout

### BR-004: Hotel Pricing
- Default room rate: 20 JOD per night (all types)
- Pickup fee: 5 JOD (if selected)
- Dropoff fee: 5 JOD (if selected)
- Extra services: Amount set by admin at checkout
- Calculate nights: check-out date minus check-in date

### BR-005: User Account Types
- Regular user: email + password (full account)
- Admin-created user: phone + auto-generated email (upgradeable)
- Upgrade: phone-based account can add email/password

### BR-006: Authentication Rules
- Admin users must login from admin login page
- Regular users cannot login from admin login page
- Rate limiting applies to prevent brute force
- Session stored in localStorage (client-side)

### BR-007: Pet Code Generation
- Format: PET-XXXXX (5-digit number)
- Auto-increment based on total pet count
- Unique per pet

### BR-008: Appointment Status Flow
- Created: status "upcoming"
- Completed: status "completed" + price + payment method
- Cancelled: status "cancelled"
- No-show: status "no-show"

### BR-009: Hotel Reservation Status Flow
- Created: status "booked", room "OCCUPIED"
- Check-in: status "checked_in", room "OCCUPIED"
- Checkout: status "checked_out", room "AVAILABLE"
- Cancelled: status "cancelled", room "AVAILABLE"

### BR-010: Image Upload Rules
- Maximum file size: 5MB
- Allowed types: JPEG, JPG, PNG, WebP, GIF
- Images uploaded to Cloudinary
- URLs stored in database

---

## Data Requirements

### DR-001: User Data
- Required: email (unique), password (hashed), role
- Optional: name, phone, governorate, area, address
- Relationships: orders, pets, appointments, hotel reservations

### DR-002: Product Data
- Required: name, slug (unique), description, price, stock, categoryId, image
- Relationships: category, order items, product views

### DR-003: Order Data
- Required: customerName, customerEmail, customerPhone, customerAddress, deliveryMethod, total, status
- Optional: userId, notes, paymentMethod
- Relationships: user, order items
- Status: pending, completed, cancelled

### DR-004: Pet Data
- Required: userId, petCode (unique), name, species, gender
- Optional: breed, birthDate, color, photo, allergies, medications, medicalHistory, surgicalHistory, chronicConditions
- Relationships: user, vaccinations, dewormings, clinic visits, weight records, appointments, hotel reservations

### DR-005: Appointment Data
- Required: appointmentDate, appointmentTime, reason, status
- Optional: userId, ownerName, ownerPhone, petId, petName, notes, completionPrice, completionPaymentMethod
- Relationships: user
- Status: upcoming, completed, cancelled, no-show

### DR-006: Hotel Room Data
- Required: roomNumber, type (DOG/CAT/BIRD), status
- Optional: notes
- Relationships: reservations
- Status: AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE

### DR-007: Hotel Reservation Data
- Required: roomId, ownerName, ownerPhone, petName, checkIn, checkOut, status
- Optional: userId, petId, notes, pickup (boolean), dropoff (boolean), totalNights, roomRate, subtotal, pickupFee, dropoffFee, extraServices (JSON), total, paymentMethod, checkedOutAt
- Relationships: room, user, pet
- Status: booked, checked_in, checked_out, cancelled

### DR-008: Pet Adoption Data
- Required: petName, description, phoneNumber, area, images (JSON string), status
- Status: active, adopted, removed
- Images stored as JSON array of URLs

### DR-009: Analytics Data
- PageView: page (string), sessionId (string), createdAt
- ProductView: productId, createdAt

---

## Performance Requirements

### PR-001: Database Query Optimization
- Limit nested queries (take: 5-20 records)
- Use select to fetch only needed fields
- Implement proper indexing
- Paginate large result sets

### PR-002: Image Optimization
- Use Next.js Image component
- Support AVIF and WebP formats
- Optimize image sizes
- Lazy load images

### PR-003: Caching
- Cache API responses where appropriate
- Cache-Control headers for static content
- Session-based caching for user data

### PR-004: Code Splitting
- Lazy load components where possible
- Optimize package imports
- Minimize bundle size

---

## Security Requirements

### SEC-001: Authentication Security
- Password hashing with bcrypt (12 rounds)
- Rate limiting on login/signup
- Prevent user enumeration
- Input validation with Zod schemas

### SEC-002: Input Validation
- Validate all user inputs
- Sanitize inputs to prevent XSS
- Check for SQL injection patterns
- Email format validation
- Phone number format validation

### SEC-003: Authorization
- Admin-only routes protected
- User data access restricted
- Role-based access control

### SEC-004: Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy
- Permissions-Policy

### SEC-005: CSRF Protection
- Basic origin check for state-changing operations
- Recommended: Implement CSRF tokens (future enhancement)

---

## User Interface Requirements

### UI-001: Responsive Design
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly interface
- Accessible navigation

### UI-002: Visual Design
- Consistent color scheme
- Clear typography
- Intuitive icons
- Smooth transitions and animations

### UI-003: Error Handling
- User-friendly error messages
- Loading states
- Validation feedback
- Success confirmations

### UI-004: Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

---

## Documentation Requirements

### DOC-001: Code Documentation
- Clear function comments
- Type definitions
- API endpoint documentation
- Database schema documentation

### DOC-002: User Documentation
- Help text in UI
- Form validation messages
- Onboarding guidance

---

## Future Enhancements (Out of Scope)

- Email notifications
- SMS notifications
- Payment gateway integration
- Advanced search functionality
- Product reviews and ratings
- Wishlist functionality
- Multi-language support
- Mobile app
- Advanced analytics dashboard
- Export reports to PDF/Excel
- Appointment reminders
- Automated inventory alerts

---

**End of Document**

