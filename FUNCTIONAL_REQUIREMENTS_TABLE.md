# Functional Requirements Table
## VetVoge & Eagle's Vet Clinic System

---

## Functional Requirements

| FR ID | Description | ST | PRIORITY | INCREMENT |
|-------|-------------|----|----------|-----------|
| **FR1** | The system shall display a welcome page at the root URL (`/`) that serves as the entry point to the VetVoge marketplace, featuring navigation to clinics, pet adoption, and shop sections. | ST3, ST2 | High | VetVoge Core |
| **FR2** | The system shall display clinic cards showing clinic name, location, specialties, description, and a link to the clinic's landing page. | ST3, ST2 | High | VetVoge Core |
| **FR3** | The system shall allow users to browse Eagle's Vet Clinic landing page with Hero section, Services, Staff, and Contact information. | ST3, ST2 | High | VetVoge Core |
| **FR4** | The system shall provide smooth scrolling navigation for anchor links within the VetVoge and clinic pages. | ST3, ST2 | Medium | VetVoge Core |
| **FR5** | The system shall display context-aware headers: VetVoge header on root page (`/`) only, and Eagle's Vet Clinic header on all other pages. | ST3, ST2, ST1 | High | VetVoge Core |
| **FR6** | The system shall allow guest users to post pets for adoption without requiring authentication, including pet name, description, phone number, area, and multiple photos. | ST4 | High | Pet Adoption |
| **FR7** | The system shall display pet adoption listings with image carousel, clickable phone numbers, and full-size image modal for viewing all photos. | ST4, ST3 | High | Pet Adoption |
| **FR8** | The system shall upload adoption pet images to Cloudinary and store image URLs as JSON array in the database. | ST4 | High | Pet Adoption |
| **FR9** | The system shall filter adoption listings by status (active, adopted, removed) with a default of active posts only. | ST4, ST3 | Medium | Pet Adoption |
| **FR10** | The system shall limit adoption listings display to the 50 most recent posts. | ST4, ST3 | Low | Pet Adoption |
| **FR11** | The system shall allow users to browse shop products with category filtering, sorting options (newest, price, name), and pagination (24 products per page). | ST3, ST2 | High | E-Commerce |
| **FR12** | The system shall display product details including name, description, price, multiple images in a gallery, stock status, and category information. | ST3, ST2 | High | E-Commerce |
| **FR13** | The system shall allow users to add products to a shopping cart, update quantities, and remove items from the cart using Recoil state management. | ST3, ST2 | High | E-Commerce |
| **FR14** | The system shall display cart item count in the header navigation for easy access. | ST3, ST2 | Medium | E-Commerce |
| **FR15** | The system shall provide a checkout process requiring customer name, phone, delivery method (home delivery or pickup), payment method (cash or click for delivery), and address information (if delivery). | ST3, ST2 | High | E-Commerce |
| **FR16** | The system shall support Jordanian governorate and area selection for delivery addresses. | ST3, ST2 | High | E-Commerce |
| **FR17** | The system shall pre-fill checkout forms with logged-in user's profile information (name, phone, address). | ST2 | Medium | E-Commerce |
| **FR18** | The system shall create orders with status "pending" and immediately decrease product stock quantities. | ST2, ST1 | High | E-Commerce |
| **FR19** | The system shall restore product stock if an order is cancelled and decrease stock again if a cancelled order is reactivated. | ST1 | High | E-Commerce |
| **FR20** | The system shall prevent adding out-of-stock products to cart and display "Out of Stock" badges on product listings. | ST3, ST2 | High | E-Commerce |
| **FR21** | The system shall allow registered users to view their order history with status filtering (pending, completed, cancelled). | ST2 | High | E-Commerce |
| **FR22** | The system shall provide reorder functionality allowing users to quickly reorder previous purchases. | ST2 | Medium | E-Commerce |
| **FR23** | The system shall allow guest users to place orders without creating an account. | ST3 | High | E-Commerce |
| **FR24** | The system shall allow users to register accounts with name, email, password, and phone number, with validation for email format and password strength (min 8 chars, uppercase, lowercase, number). | ST2 | High | User Management |
| **FR25** | The system shall allow users to login with email and password, with rate limiting (5 attempts per 15 minutes per IP) and protection against user enumeration. | ST2 | High | User Management |
| **FR26** | The system shall store user session in localStorage and redirect users based on their role (user/admin). | ST2, ST1 | High | User Management |
| **FR27** | The system shall provide logout functionality that clears localStorage and redirects to appropriate page. | ST2, ST1 | High | User Management |
| **FR28** | **The system shall allow users to reset their password via email with a secure reset link that expires after 24 hours. (NEW)** | ST2 | High | User Management |
| **FR29** | **The system shall allow users to change their password from their profile settings, requiring current password verification. (NEW)** | ST2 | High | User Management |
| **FR30** | The system shall support account upgrade from phone-based accounts (admin-created) to full email/password accounts, preserving all existing data. | ST2 | High | User Management |
| **FR31** | The system shall prevent admin users from logging in through the regular user login page and redirect them to admin login. | ST1 | Medium | User Management |
| **FR32** | The system shall allow users to update their profile information including name, phone, governorate, area, and address. | ST2 | High | User Management |
| **FR33** | **The system shall send email notifications for order confirmations, appointment reminders, and important account changes. (NEW)** | ST2, ST1 | Medium | User Management |
| **FR34** | **The system shall allow users to delete their account with confirmation and option to retain order history. (NEW)** | ST2 | Medium | User Management |
| **FR35** | The system shall allow registered users to create pet profiles with name, species, gender, and optional fields (breed, birth date, color, photo, medical information). | ST2 | High | Pet Management |
| **FR36** | The system shall auto-generate unique pet codes (PET-XXXXX format) for each registered pet. | ST2, ST1 | High | Pet Management |
| **FR37** | The system shall allow users to upload pet photos to Cloudinary and store URLs in the database. | ST2 | High | Pet Management |
| **FR38** | The system shall display pet profiles with basic information and medical records (vaccinations, dewormings, clinic visits, weight history). | ST2, ST5 | High | Pet Management |
| **FR39** | The system shall allow users and admins to add vaccination records including name, date, next due date, and notes. | ST2, ST1, ST5 | High | Pet Management |
| **FR40** | The system shall allow users and admins to add deworming records including name, date, next due date, and notes. | ST2, ST1, ST5 | High | Pet Management |
| **FR41** | The system shall allow users and admins to add clinic visit records including visit date, reason, diagnosis, treatment, prescriptions, notes, and next appointment date. | ST2, ST1, ST5 | High | Pet Management |
| **FR42** | The system shall allow users and admins to add weight records including date, weight value, and notes. | ST2, ST1, ST5 | High | Pet Management |
| **FR43** | The system shall display medical records chronologically with the most recent records first, limited to 5-10 most recent per type. | ST2, ST1, ST5 | Medium | Pet Management |
| **FR44** | The system shall allow users to edit and delete their pet profiles with cascade deletion of related medical records. | ST2 | High | Pet Management |
| **FR45** | The system shall allow admins to manage any pet profile, including editing information and adding medical records. | ST1, ST5 | High | Pet Management |
| **FR46** | The system shall allow registered users to book veterinary appointments by selecting a pet, appointment date, time, reason, and optional notes. | ST2 | High | Appointments |
| **FR47** | The system shall allow guest users to book appointments with owner name, phone, pet name, appointment date, time, and reason. | ST3 | High | Appointments |
| **FR48** | The system shall create appointments with status "upcoming" and associate them with user accounts if logged in. | ST2, ST1 | High | Appointments |
| **FR49** | The system shall allow users to view their appointment history with filtering by status (upcoming, completed, cancelled). | ST2 | High | Appointments |
| **FR50** | The system shall allow admins to view all appointments with pagination (50 per page), filtering by status and date range, and searching by customer name, phone, or pet name. | ST1, ST5 | High | Appointments |
| **FR51** | The system shall allow admins to update appointment details including date, time, reason, and notes. | ST1, ST5 | High | Appointments |
| **FR52** | The system shall allow admins to complete appointments by setting completion price, payment method, and updating status to "completed". | ST1, ST5 | High | Appointments |
| **FR53** | The system shall allow admins to cancel appointments and update status to "cancelled". | ST1, ST5 | Medium | Appointments |
| **FR54** | The system shall display appointment status with appropriate color coding (upcoming=blue, completed=green, cancelled=red). | ST2, ST1 | Low | Appointments |
| **FR55** | **The system shall send appointment reminder notifications 24 hours before scheduled appointments via email or SMS. (NEW)** | ST2 | Medium | Appointments |
| **FR56** | The system shall display available hotel rooms by type (DOG, CAT, BIRD) with room status (AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE) and room numbers. | ST2, ST1 | High | Hotel |
| **FR57** | The system shall check room availability for selected dates before allowing hotel bookings to prevent overlapping reservations. | ST2, ST1 | High | Hotel |
| **FR58** | The system shall allow registered users to book hotel rooms by selecting pet, room type, check-in date, check-out date, pickup service option, dropoff service option, and optional notes. | ST2 | High | Hotel |
| **FR59** | The system shall allow users to add extra services by name only (e.g., "bath"), with amounts to be set by admin at checkout. | ST2 | High | Hotel |
| **FR60** | The system shall calculate and display booking cost breakdown showing nights, room rate (20 JOD/night), subtotal, pickup fee (5 JOD if selected), dropoff fee (5 JOD if selected), and total. | ST2 | High | Hotel |
| **FR61** | The system shall create hotel reservations with status "booked" and immediately mark the room as "OCCUPIED". | ST2, ST1 | High | Hotel |
| **FR62** | The system shall allow users to view their hotel reservations with filtering by status and display of pickup/dropoff options and extra services. | ST2 | High | Hotel |
| **FR63** | The system shall allow admins to view hotel rooms by type on separate pages (dogs, cats, birds) with all reservations displayed for each room. | ST1, ST5 | High | Hotel |
| **FR64** | The system shall allow admins to create new hotel rooms with room number and type (DOG, CAT, BIRD). | ST1 | Medium | Hotel |
| **FR65** | The system shall allow admins to update room status (AVAILABLE, OCCUPIED, CLEANING, MAINTENANCE). | ST1, ST5 | High | Hotel |
| **FR66** | The system shall allow admins to create reservations for any customer with owner name, phone, pet name, dates, and service options. | ST1, ST5 | High | Hotel |
| **FR67** | The system shall allow admins to update reservation details including dates, pickup/dropoff options, extra services, and notes. | ST1, ST5 | High | Hotel |
| **FR68** | The system shall allow admins to check-in reservations by updating status to "checked_in" and keeping room as "OCCUPIED". | ST1, ST5 | Medium | Hotel |
| **FR69** | The system shall allow admins to checkout reservations by calculating total nights, setting room rate, subtotal, pickup fee, dropoff fee, setting extra service amounts, calculating total, selecting payment method, updating status to "checked_out", and marking room as "AVAILABLE". | ST1, ST5 | High | Hotel |
| **FR70** | The system shall display reservation details in a modal showing all booking information, cost breakdown, and payment information. | ST2, ST1 | High | Hotel |
| **FR71** | The system shall allow admins to cancel reservations by updating status to "cancelled" and marking room as "AVAILABLE". | ST1, ST5 | Medium | Hotel |
| **FR72** | The system shall provide an admin dashboard with tabbed interface (Products, Orders, Analytics, Owners, Appointments, Hotel) with tab persistence in localStorage. | ST1 | High | Admin Dashboard |
| **FR73** | The system shall allow admins to create products with name, description, price, images, stock quantity, and category assignment, with auto-generation of product slugs. | ST1 | High | Admin Dashboard |
| **FR74** | The system shall allow admins to view products list with pagination, sorting, and category filtering. | ST1 | High | Admin Dashboard |
| **FR75** | The system shall allow admins to update products including all fields except ID, with slug regeneration if name changes. | ST1 | High | Admin Dashboard |
| **FR76** | The system shall allow admins to delete products with confirmation. | ST1 | Medium | Admin Dashboard |
| **FR77** | The system shall allow admins to upload multiple product images to Cloudinary and store URLs as comma-separated string. | ST1 | High | Admin Dashboard |
| **FR78** | The system shall allow admins to view all orders with pagination (50 per page), filtering by status and date range. | ST1 | High | Admin Dashboard |
| **FR79** | The system shall allow admins to update order status and add notes to orders. | ST1 | High | Admin Dashboard |
| **FR80** | The system shall allow admins to view order details in a modal showing customer information, order items, delivery method, payment method, and order timeline. | ST1 | High | Admin Dashboard |
| **FR81** | The system shall allow admins to view all users (regular users only, not admins) with search functionality. | ST1 | High | Admin Dashboard |
| **FR82** | The system shall allow admins to create new user accounts with name, email, phone, password, governorate, area, and address. | ST1 | High | Admin Dashboard |
| **FR83** | The system shall allow admins to view user details including profile, pets, orders, and appointments in a modal. | ST1 | High | Admin Dashboard |
| **FR84** | The system shall allow admins to update user information including name, phone, governorate, area, and address. | ST1 | High | Admin Dashboard |
| **FR85** | The system shall allow admins to delete users with cascade deletion of related data (pets, orders, appointments). | ST1 | Medium | Admin Dashboard |
| **FR86** | The system shall allow admins to view all appointments with pagination, filtering, and search functionality, accessible via analytics card modal. | ST1 | High | Admin Dashboard |
| **FR87** | The system shall allow admins to view all hotel reservations with filtering by type and status, accessible via analytics card modal. | ST1 | High | Admin Dashboard |
| **FR88** | The system shall display analytics cards for Orders, Appointments, and Hotel Reservations with clickable modals showing full lists instead of tab navigation. | ST1 | High | Admin Dashboard |
| **FR89** | The system shall track page views with session IDs for analytics, excluding admin pages from tracking. | ST3, ST2 | Medium | Analytics |
| **FR90** | The system shall track product views when users view product detail pages for analytics. | ST3, ST2 | Medium | Analytics |
| **FR91** | The system shall generate unique session IDs and store them in localStorage for user session tracking. | ST3, ST2 | Medium | Analytics |
| **FR92** | The system shall calculate revenue analytics including order revenue (only completed orders), appointment revenue (only completed with price), and hotel revenue (only checked-out with total). | ST1 | High | Analytics |
| **FR93** | The system shall exclude pending orders from revenue calculations to ensure accurate financial reporting. | ST1 | High | Analytics |
| **FR94** | The system shall display revenue timeline showing all revenue items (orders, appointments, hotel) with detailed breakdown in a modal. | ST1 | High | Analytics |
| **FR95** | The system shall display payment breakdown for hotel reservations showing nights, room rate, subtotal, pickup fee, dropoff fee, extra services with amounts, and total. | ST1 | High | Analytics |
| **FR96** | The system shall provide analytics statistics for orders (total, pending, completed, cancelled), appointments (total, upcoming, completed, cancelled), and hotel reservations (total, booked, checked-in, checked-out, cancelled). | ST1 | High | Analytics |
| **FR97** | The system shall display top products by view count with product details and view statistics. | ST1 | Medium | Analytics |
| **FR98** | The system shall calculate unique visitors count based on distinct session IDs. | ST1 | Medium | Analytics |
| **FR99** | The system shall allow filtering analytics by time period (today, week, month, 3 months, year). | ST1 | High | Analytics |
| **FR100** | The system shall display page view counts for selected time periods. | ST1 | Medium | Analytics |
| **FR101** | The system shall provide product view counts for selected time periods. | ST1 | Medium | Analytics |
| **FR102** | The system shall validate user inputs using Zod schemas for authentication, signup, and orders. | ST2, ST1 | High | Security |
| **FR103** | The system shall hash passwords using bcrypt with 12 rounds of salting for secure password storage. | ST2, ST1 | High | Security |
| **FR104** | The system shall implement rate limiting on login attempts (5 attempts per 15 minutes per IP) to prevent brute force attacks. | ST2 | High | Security |
| **FR105** | The system shall implement rate limiting on signup attempts (3 attempts per 10 minutes per IP) to prevent abuse. | ST2 | Medium | Security |
| **FR106** | The system shall prevent user enumeration by returning the same error message for invalid email and invalid password. | ST2 | High | Security |
| **FR107** | The system shall sanitize user inputs to prevent XSS attacks by removing dangerous HTML tags and scripts. | ST2, ST3 | High | Security |
| **FR108** | The system shall check for SQL injection patterns in user inputs and reject suspicious queries. | ST2, ST3 | High | Security |
| **FR109** | The system shall set security headers including X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, and Permissions-Policy. | ST2, ST3, ST1 | Medium | Security |
| **FR110** | The system shall implement basic CSRF protection through origin checking for state-changing operations (POST, PUT, DELETE). | ST2, ST3, ST1 | Medium | Security |
| **FR111** | **The system shall require strong passwords with minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number, with visual password strength indicator. (ENHANCED)** | ST2 | High | Security |
| **FR112** | **The system shall allow users to enable two-factor authentication (2FA) for additional account security. (NEW)** | ST2 | Low | Security |
| **FR113** | The system shall upload images to Cloudinary with validation for file type (JPEG, JPG, PNG, WebP, GIF only) and file size (max 5MB). | ST2, ST1, ST4 | High | Image Management |
| **FR114** | The system shall optimize images using Next.js Image component with AVIF and WebP format support. | ST2, ST3, ST1 | Medium | Image Management |
| **FR115** | The system shall store product images as comma-separated URLs in the database and display them in a gallery. | ST2, ST3, ST1 | High | Image Management |
| **FR116** | The system shall display adoption pet images in a carousel with navigation arrows, indicators, and full-size modal viewing. | ST4, ST3 | High | Image Management |
| **FR117** | The system shall implement responsive design for mobile, tablet, and desktop devices with mobile-first approach. | ST2, ST3, ST1 | High | UI/UX |
| **FR118** | The system shall provide clear loading states and user feedback for all asynchronous operations. | ST2, ST3, ST1 | Medium | UI/UX |
| **FR119** | The system shall display user-friendly error messages with appropriate styling (red for errors, green for success). | ST2, ST3, ST1 | Medium | UI/UX |
| **FR120** | The system shall provide confirmation dialogs for destructive actions like deleting pets, users, or orders. | ST2, ST1 | Medium | UI/UX |
| **FR121** | The system shall maintain cart state during session using Recoil state management until logout or order completion. | ST2, ST3 | High | UI/UX |
| **FR122** | The system shall persist admin dashboard tab selection in localStorage to maintain user preference across page refreshes. | ST1 | Medium | UI/UX |
| **FR123** | The system shall limit database queries with appropriate take limits (5-20 records) for nested relationships to optimize performance. | ST1, ST2 | High | Performance |
| **FR124** | The system shall use select queries to fetch only necessary fields from database instead of full objects. | ST1, ST2 | High | Performance |
| **FR125** | The system shall implement database indexing on frequently queried fields (userId, status, createdAt, etc.) for improved query performance. | ST1 | High | Performance |
| **FR126** | The system shall provide API response caching with appropriate Cache-Control headers for static and semi-static content. | ST1, ST2, ST3 | Medium | Performance |
| **FR127** | The system shall remove product polling intervals and rely on page refresh for stock updates to reduce server load. | ST2, ST3 | Medium | Performance |
| **FR128** | **The system shall provide a search functionality for products by name, description, or category across the entire shop. (NEW)** | ST2, ST3 | High | E-Commerce |
| **FR129** | **The system shall allow users to save products to a wishlist/favorites list for future reference. (NEW)** | ST2 | Medium | E-Commerce |
| **FR130** | **The system shall display product reviews and ratings submitted by customers who have purchased the product. (NEW)** | ST2, ST3 | Low | E-Commerce |
| **FR131** | **The system shall send order status update notifications (pending to completed, etc.) to users via email. (NEW)** | ST2 | Medium | E-Commerce |
| **FR132** | **The system shall allow users to track their order delivery status with real-time updates. (NEW)** | ST2 | Low | E-Commerce |
| **FR133** | **The system shall provide a contact form on the clinic landing page for users to send inquiries or messages. (NEW)** | ST2, ST3 | Medium | VetVoge Core |
| **FR134** | **The system shall display clinic business hours and availability on the clinic landing page. (NEW)** | ST2, ST3 | Medium | VetVoge Core |
| **FR135** | **The system shall allow users to rate and review clinic services and staff after completing appointments. (NEW)** | ST2 | Low | Appointments |
| **FR136** | **The system shall provide a calendar view for appointment booking showing available time slots. (NEW)** | ST2 | Medium | Appointments |
| **FR137** | **The system shall allow admins to set recurring appointments for pets with vaccination schedules. (NEW)** | ST1, ST5 | Low | Pet Management |
| **FR138** | **The system shall generate PDF reports for pet medical records that can be downloaded or emailed. (NEW)** | ST2, ST1 | Low | Pet Management |
| **FR139** | **The system shall provide automated reminders for upcoming vaccinations and deworming schedules based on pet records. (NEW)** | ST2 | Low | Pet Management |
| **FR140** | **The system shall allow users to upload documents (vaccination certificates, medical reports) to pet profiles. (NEW)** | ST2 | Low | Pet Management |
| **FR141** | **The system shall display a dashboard for users showing upcoming appointments, active reservations, and recent orders summary. (ENHANCED)** | ST2 | High | User Management |
| **FR142** | **The system shall allow users to set notification preferences for email, SMS, or in-app notifications. (NEW)** | ST2 | Medium | User Management |
| **FR143** | **The system shall provide a help/FAQ section with common questions and answers. (NEW)** | ST2, ST3 | Medium | VetVoge Core |
| **FR144** | **The system shall support multiple language localization starting with English and Arabic. (NEW)** | ST2, ST3 | Low | VetVoge Core |
| **FR145** | **The system shall allow admins to manage pet adoption posts, approve/reject submissions, and mark pets as adopted. (NEW)** | ST1 | Medium | Pet Adoption |
| **FR146** | **The system shall display adoption post statistics showing number of views and inquiries. (NEW)** | ST1, ST4 | Low | Pet Adoption |
| **FR147** | **The system shall provide export functionality for analytics reports in PDF or Excel format. (NEW)** | ST1 | Low | Analytics |
| **FR148** | **The system shall allow admins to set low stock alerts for products when inventory falls below a threshold. (NEW)** | ST1 | Medium | Admin Dashboard |
| **FR149** | **The system shall provide bulk operations for product management (bulk price update, bulk stock update, bulk delete). (NEW)** | ST1 | Low | Admin Dashboard |
| **FR150** | **The system shall implement a backup and restore functionality for database data with scheduled automatic backups. (NEW)** | ST1 | Low | System |

---

## Legend

- **ST1**: Clinic Administrator
- **ST2**: Pet Owners (Registered Users)
- **ST3**: Guest Users
- **ST4**: Pet Adoption Community
- **ST5**: Veterinary Staff

**Priority Levels:**
- **High**: Critical functionality required for core system operation
- **Medium**: Important functionality that enhances user experience
- **Low**: Nice-to-have features for future enhancement

**Note:** Functional requirements marked with **(NEW)** are new features not currently implemented but are easy to add. Requirements marked with **(ENHANCED)** are existing features that can be improved.

---

**Total Functional Requirements: 150**

