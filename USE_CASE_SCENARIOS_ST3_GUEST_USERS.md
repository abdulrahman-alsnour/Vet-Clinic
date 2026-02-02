# Use Case Scenarios - Guest Users (ST3)

## Use Case 1: Browse VetVoge

| Field | Description |
|-------|-------------|
| **Use Case Name** | Browse VetVoge |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user accesses the VetVoge marketplace welcome page at the root URL (/) which serves as the entry point, featuring navigation to clinics, pet adoption, and shop sections. |
| **Data** | Page content, navigation links, session ID for analytics, page view tracking data |
| **Stimulus** | Guest user navigates to root URL (/) or clicks on VetVoge logo/branding |
| **Response** | System displays VetVoge welcome page with header navigation (Clinics, Pet Adoption, Shop), shows hero section, displays clinic cards section, displays pet adoption section, displays shop selection section, tracks page view with session ID for analytics, and provides smooth scrolling navigation to sections via anchor links |
| **Comments** | VetVoge page serves as marketplace entry point. Header shows "VetVoge" branding (not clinic branding). Smooth scrolling enables easy navigation between sections. Page views are tracked for analytics but admin pages are excluded. Session ID is generated and stored in localStorage. |

---

## Use Case 2: View Clinic Cards

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Clinic Cards |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user views clinic cards on the VetVoge marketplace showing clinic name, location, specialties, description, and a link to the clinic's landing page. |
| **Data** | Clinic information (name, location, specialties, description), clinic cards data, clinic landing page URL |
| **Stimulus** | Guest user scrolls to clinics section on VetVoge page or clicks on "Clinics" navigation link |
| **Response** | System displays clinic cards with clinic name, location information, specialties list, description text, and link to clinic landing page. Cards are displayed in responsive grid layout with hover effects |
| **Comments** | Clinic cards provide overview of available veterinary clinics in the marketplace. Each card links to the specific clinic's landing page (e.g., /clinic/eagles for Eagle's Vet Clinic). Cards are visually appealing with hover effects for better UX. |

---

## Use Case 3: View Clinic Landing Page

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Clinic Landing Page |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user browses a clinic's landing page (e.g., Eagle's Vet Clinic) with Hero section, Services, Staff, and Contact information. The header displays clinic branding. |
| **Data** | Clinic landing page content (hero section, services, staff, contact information), clinic branding, header context |
| **Stimulus** | Guest user clicks on a clinic card from VetVoge marketplace or navigates directly to clinic URL (e.g., /clinic/eagles) |
| **Response** | System displays clinic landing page with clinic-specific header (e.g., "Eagle's Vet Clinic"), shows hero section with clinic introduction, displays services section, shows staff section, displays contact information section, provides navigation links, and shows clinic-specific footer |
| **Comments** | Header changes from "VetVoge" to clinic branding (e.g., "Eagle's Vet Clinic") when on clinic pages. Landing page provides comprehensive information about the clinic. Services, staff, and contact sections help users learn about the clinic. |

---

## Use Case 4: View Pet Adoption Listings

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Pet Adoption Listings |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user views pet adoption listings on the VetVoge marketplace with image carousel, clickable phone numbers, and full-size image modal for viewing all photos. Listings are filtered to show active posts only (default). |
| **Data** | Adoption listings data (pet name, description, phone number, area, images), status filter (active by default), image URLs, session ID for analytics |
| **Stimulus** | Guest user scrolls to pet adoption section on VetVoge page, clicks on "Pet Adoption" navigation link, or navigates to adoption section via anchor link (#adoption) |
| **Response** | System retrieves adoption listings from database (status='active', limit 50 most recent), displays adoption cards in responsive grid layout, shows image carousel with navigation arrows and indicators, displays pet name, description, area, and clickable phone number (tel: link), provides full-size image modal on image click, tracks page view for analytics, and allows browsing between images in carousel |
| **Comments** | Only active adoption posts are displayed by default. Listings are limited to 50 most recent posts. Image carousel allows easy browsing of multiple photos. Clickable phone numbers enable direct contact. Full-size modal provides detailed image viewing. Phone numbers are prominently displayed without "Contact Owner" button. |

---

## Use Case 5: Post Pet for Adoption

| Field | Description |
|-------|-------------|
| **Use Case Name** | Post Pet for Adoption |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user posts a pet for adoption without requiring authentication. The post includes pet name, description, phone number, area, and multiple photos. No sign-in is required. |
| **Data** | Pet name, description, phone number, area, image files (multiple), image URLs (after upload to Cloudinary), adoption post status (default: 'active') |
| **Stimulus** | Guest user scrolls to pet adoption section, clicks "Post Pet for Adoption" button or form trigger, fills in adoption form (pet name, description, phone number, area), uploads one or more pet images, and clicks "Submit" or "Post" button |
| **Response** | System validates required fields (pet name, description, phone number, area), validates at least one image is uploaded, uploads images to Cloudinary, stores image URLs as JSON array in database, creates adoption post record with status 'active', displays success message, resets form, refreshes adoption listings, and shows new post in listings |
| **Comments** | No authentication required - anyone can post pets for adoption. Images are uploaded to Cloudinary with validation (file type: JPEG, JPG, PNG, WebP, GIF; max size: 5MB). Images are stored as JSON array of URLs. Post status is 'active' by default. Form validation ensures all required fields are provided. |

---

## Use Case 6: Upload Pet Images

| Field | Description |
|-------|-------------|
| **Use Case Name** | Upload Pet Images |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user uploads one or more pet images when posting a pet for adoption. Images are uploaded to Cloudinary and stored as JSON array of URLs in the database. |
| **Data** | Image files (JPEG, JPG, PNG, WebP, GIF), file size (max 5MB), Cloudinary upload response (URLs), image URLs array (JSON string in database) |
| **Stimulus** | Guest user fills in adoption post form, clicks "Upload Images" or file input, selects one or more image files from device, confirms file selection |
| **Response** | System validates file type (JPEG, JPG, PNG, WebP, GIF only), validates file size (max 5MB per file), uploads each image to Cloudinary, receives image URLs from Cloudinary, stores URLs in form state, displays image previews, allows removing images before submission, stores image URLs as JSON array when form is submitted, and saves JSON array string in database |
| **Comments** | File type and size validation prevents invalid uploads. Multiple images can be uploaded per post. Images are uploaded to Cloudinary for reliable storage and delivery. URLs are stored as JSON array string in database for easy retrieval and parsing. Image previews help users verify uploaded images before submission. |

---

## Use Case 7: Browse Products

| Field | Description |
|-------|-------------|
| **Use Case Name** | Browse Products |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user browses shop products with category filtering, sorting options (newest, price, name), and pagination (24 products per page). Products are displayed with stock status and "Out of Stock" badges. |
| **Data** | Products list, category filter, sort option (newest/price/name), pagination state (page number, 24 per page), product details (name, price, image, stock status, category), session ID for analytics |
| **Stimulus** | Guest user navigates to shop page from VetVoge marketplace or clinic landing page, selects category filter, selects sort option, or clicks pagination controls |
| **Response** | System retrieves products from database based on filters, applies sorting, paginates results (24 per page), displays product cards with images, names, prices, stock status, category badges, "Out of Stock" badges for unavailable products, tracks product views for analytics, and provides navigation controls |
| **Comments** | Products are displayed in responsive grid layout. Out of stock products show badges and cannot be added to cart. Sorting and filtering provide better product discovery. Pagination improves performance for large product catalogs. Product views are tracked for analytics. Shop page header shows clinic branding (e.g., "Eagle's Vet Clinic") when accessed from clinic context. |

---

## Use Case 8: View Product Details

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Product Details |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user views detailed product information including name, description, price, multiple images in a gallery, stock status, and category information. |
| **Data** | Product ID, product details (name, description, price, images, stock quantity, category), product slug, image URLs (comma-separated), session ID for analytics |
| **Stimulus** | Guest user clicks on a product card from shop page or product listing, navigates to product detail page |
| **Response** | System retrieves product details from database using product slug, displays product name and description, shows product price, displays image gallery with multiple images (if available), shows stock status and "Out of Stock" badge if unavailable, displays category information, tracks product view for analytics, provides "Add to Cart" button (disabled if out of stock), and displays product in user-friendly layout |
| **Comments** | Product images are displayed in gallery format for multiple images. Stock status is clearly displayed. Out of stock products cannot be added to cart. Product views are tracked for analytics to identify popular products. Product detail page header shows clinic branding when accessed from clinic shop context. |

---

## Use Case 9: Add to Cart

| Field | Description |
|-------|-------------|
| **Use Case Name** | Add to Cart |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user adds a product to their shopping cart. The system uses Recoil state management to maintain cart state and prevents adding out-of-stock products. Cart item count is displayed in header. |
| **Data** | Product ID, product details (name, price, image), quantity, cart state (Recoil atom), stock quantity, session information |
| **Stimulus** | Guest user views product details, clicks "Add to Cart" button, optionally adjusts quantity |
| **Response** | System checks product stock availability, prevents adding if out of stock (displays error message), adds product to cart with quantity, updates Recoil cart state, updates cart item count in header, displays success message or feedback, maintains cart state during session, and persists cart until logout or order completion |
| **Comments** | Cart state is maintained using Recoil state management during session. Out of stock products cannot be added to cart. Cart item count is displayed in header for easy access. Cart persists during session but is cleared on logout or order completion. Guest users can add items to cart without authentication. |

---

## Use Case 10: Checkout as Guest

| Field | Description |
|-------|-------------|
| **Use Case Name** | Checkout as Guest |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user proceeds to checkout without creating an account. The checkout process requires customer name, phone, delivery method (home delivery or pickup), payment method (cash or click), and address information (if delivery). |
| **Data** | Cart items, customer name, phone number, delivery method (home delivery/pickup), payment method (cash/click), address information (governorate, area, address if delivery), Jordanian governorates and areas list, order total |
| **Stimulus** | Guest user clicks "Checkout" or "Proceed to Checkout" button from cart, fills in customer information form, selects delivery method, selects payment method, enters address if delivery selected, and clicks "Place Order" or "Confirm Order" button |
| **Response** | System validates all required fields, validates cart has items, validates stock availability for all items, displays delivery address fields if home delivery selected, hides address fields if pickup selected, supports Jordanian governorate and area selection for addresses, validates address format if delivery, displays order summary and total, creates order record with status "pending", associates order with guest (no user ID), decreases product stock quantities, clears cart (Recoil state), redirects to order success page, and displays order confirmation |
| **Comments** | Guest checkout allows ordering without account creation. Address is required only for home delivery, not for pickup. Jordanian governorates and areas are supported for address selection. Order is created without user association (user ID is null). Stock is immediately decreased when order is created. Payment method selection affects checkout flow. |

---

## Use Case 11: Place Order

| Field | Description |
|-------|-------------|
| **Use Case Name** | Place Order |
| **Actor** | Guest Users (ST3) |
| **Description** | A guest user completes the order placement process. The system creates an order with status "pending", decreases product stock quantities, and provides order confirmation. |
| **Data** | Order details (items, customer information, delivery method, payment method, address), product stock quantities, order status (pending), order ID |
| **Stimulus** | Guest user completes checkout form with all required information, reviews order summary, and clicks "Place Order" or "Confirm Order" button |
| **Response** | System performs final validation of all fields, validates stock availability for all cart items, creates order record in database with status "pending", stores customer information (name, phone, address if delivery), records delivery method and payment method, associates order items with product IDs and quantities, calculates order total, decreases product stock quantities immediately, clears cart (Recoil state), generates order confirmation, redirects to order success page, displays order confirmation with order details, and stores order in database for admin management |
| **Comments** | Order is created with "pending" status and will be managed by admin. Stock is immediately decreased to prevent overselling. Order confirmation provides reference for customer. Guest orders are stored without user ID association. Order success page shows confirmation and next steps. |

