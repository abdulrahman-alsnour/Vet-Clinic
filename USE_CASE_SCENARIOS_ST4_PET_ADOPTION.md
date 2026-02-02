# Use Case Scenarios - Pet Adoption Community (ST4)

## Use Case 1: Post Pet for Adoption

| Field | Description |
|-------|-------------|
| **Use Case Name** | Post Pet for Adoption |
| **Actor** | Pet Adoption Community (ST4) |
| **Description** | A member of the pet adoption community posts a pet for adoption on the VetVoge marketplace without requiring authentication. The post includes pet name, description, phone number, area, and multiple photos. No sign-in is required. |
| **Data** | Pet name, description, phone number, area, image files (multiple), image URLs (after upload to Cloudinary), adoption post status (default: 'active'), adoption post creation timestamp |
| **Stimulus** | Community member navigates to VetVoge marketplace, scrolls to pet adoption section, clicks "Post Pet for Adoption" button or form trigger, fills in adoption form with pet name, description, phone number, area, uploads one or more pet images, and clicks "Submit" or "Post" button |
| **Response** | System validates required fields (pet name, description, phone number, area), validates at least one image is uploaded, uploads images to Cloudinary, stores image URLs as JSON array in database, creates adoption post record with status 'active', records creation timestamp, displays success message, resets form, refreshes adoption listings, and shows new post in listings (up to 50 most recent posts) |
| **Comments** | No authentication required - anyone in the adoption community can post pets for adoption. Images are uploaded to Cloudinary with validation (file type: JPEG, JPG, PNG, WebP, GIF; max size: 5MB). Images are stored as JSON array of URLs. Post status is 'active' by default. Form validation ensures all required fields are provided. Posts are limited to 50 most recent in listings display. |

---

## Use Case 2: Upload Pet Images

| Field | Description |
|-------|-------------|
| **Use Case Name** | Upload Pet Images |
| **Actor** | Pet Adoption Community (ST4) |
| **Description** | A member of the pet adoption community uploads one or more pet images when posting a pet for adoption. Images are uploaded to Cloudinary and stored as JSON array of URLs in the database. |
| **Data** | Image files (JPEG, JPG, PNG, WebP, GIF), file size (max 5MB per file), Cloudinary upload response (URLs), image URLs array (JSON string in database), image preview data |
| **Stimulus** | Community member fills in adoption post form, clicks "Upload Images" or file input button, selects one or more image files from device, confirms file selection, optionally removes images before submission |
| **Response** | System validates file type (JPEG, JPG, PNG, WebP, GIF only), validates file size (max 5MB per file), uploads each image to Cloudinary with folder specification, receives image URLs from Cloudinary, stores URLs in form state, displays image previews with remove option, allows removing images before submission, stores image URLs as JSON array when form is submitted, and saves JSON array string in database adoption record |
| **Comments** | File type and size validation prevents invalid uploads and ensures quality. Multiple images can be uploaded per post to showcase the pet from different angles. Images are uploaded to Cloudinary for reliable storage and delivery with optimized formats. URLs are stored as JSON array string in database for easy retrieval and parsing. Image previews help users verify uploaded images before submission. Users can remove incorrectly selected images before posting. |

---

## Use Case 3: Enter Pet Information

| Field | Description |
|-------|-------------|
| **Use Case Name** | Enter Pet Information |
| **Actor** | Pet Adoption Community (ST4) |
| **Description** | A member of the pet adoption community enters pet information including pet name, description, phone number for contact, and area/location when posting a pet for adoption. |
| **Data** | Pet name (text), description (text), phone number (string), area (text), form validation state, field values |
| **Stimulus** | Community member accesses adoption post form, enters pet name in name field, enters description in description field (textarea), enters phone number in phone field, enters area/location in area field, reviews entered information |
| **Response** | System displays form fields with labels, validates required fields (all fields required), validates phone number format (basic validation), validates text length constraints, provides real-time validation feedback, displays error messages for invalid fields, enables submit button when all fields are valid, and stores form data in state until submission |
| **Comments** | All fields are required for posting adoption listings. Description field is typically a textarea to allow longer descriptions about the pet. Phone number is used for direct contact (displayed as clickable tel: link in listings). Area helps potential adopters know the pet's location. Form validation ensures data quality before submission. |

---

## Use Case 4: View Adoption Listings

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Adoption Listings |
| **Actor** | Pet Adoption Community (ST4) |
| **Description** | A member of the pet adoption community views pet adoption listings on the VetVoge marketplace. Listings are displayed with image carousel, pet information, clickable phone numbers, and are filtered to show active posts only (default). |
| **Data** | Adoption listings data (pet name, description, phone number, area, images), status filter (active by default), image URLs array, listing creation dates, session ID for analytics |
| **Stimulus** | Community member navigates to VetVoge marketplace, scrolls to pet adoption section, clicks on "Pet Adoption" navigation link, or navigates to adoption section via anchor link (#adoption) |
| **Response** | System retrieves adoption listings from database (status='active', limit 50 most recent, ordered by creation date descending), displays adoption cards in responsive grid layout, shows pet name, description, area, and clickable phone number (tel: link) prominently, displays image carousel with navigation controls, provides full-size image modal on image click, tracks page view for analytics, allows browsing between images in carousel, and displays listings in user-friendly card format |
| **Comments** | Only active adoption posts are displayed by default. Listings are limited to 50 most recent posts to maintain performance and relevance. Image carousel allows easy browsing of multiple photos per pet. Clickable phone numbers enable direct contact without additional buttons. Full-size modal provides detailed image viewing. Phone numbers are prominently displayed and directly clickable. Listings are ordered by most recent first. |

---

## Use Case 5: Browse Pet Images

| Field | Description |
|-------|-------------|
| **Use Case Name** | Browse Pet Images |
| **Actor** | Pet Adoption Community (ST4) |
| **Description** | A member of the pet adoption community browses between multiple pet images in the adoption card carousel, using navigation arrows, indicators, and image counter to view all available photos. |
| **Data** | Image URLs array (from adoption listing), current image index, total image count, carousel state, image navigation controls state |
| **Stimulus** | Community member views an adoption listing card, clicks "Next" arrow button, clicks "Previous" arrow button, clicks on image indicator/dot, or swipes on mobile device |
| **Response** | System displays image carousel with current image, shows navigation arrows (previous/next), displays image indicators/dots showing total count and current position, shows image counter (e.g., "1 of 3"), updates carousel to show selected image, provides smooth transition between images, allows navigation in circular manner (wraps around), and maintains carousel state during browsing |
| **Comments** | Image carousel provides intuitive navigation between multiple pet photos. Navigation arrows allow sequential browsing. Indicators/dots provide visual feedback of current position and total images. Image counter shows precise position. Smooth transitions enhance user experience. Circular navigation allows continuous browsing. Carousel state is maintained during user interaction. |

---

## Use Case 6: View Full Size Images

| Field | Description |
|-------|-------------|
| **Use Case Name** | View Full Size Images |
| **Actor** | Pet Adoption Community (ST4) |
| **Description** | A member of the pet adoption community clicks on an image in the adoption card carousel to open a full-size image modal that displays the selected image and allows browsing through all available images with thumbnail navigation. |
| **Data** | Image URLs array (from adoption listing), current image index in modal, modal state (open/closed), thumbnail navigation data |
| **Stimulus** | Community member clicks on an image in the adoption card carousel, clicks thumbnail in modal, clicks "Next" or "Previous" button in modal, or clicks close button/outside modal area |
| **Response** | System opens full-size image modal, displays selected image in large format, shows navigation controls (previous/next arrows), displays thumbnail navigation bar with all images, highlights current image thumbnail, allows clicking thumbnails to jump to specific image, provides close button and click-outside-to-close functionality, maintains image quality in full-size view, and provides smooth transitions between images |
| **Comments** | Full-size modal provides detailed view of pet images. Large format allows better inspection of pet photos. Thumbnail navigation enables quick jumping between images. Navigation arrows allow sequential browsing in modal. Close functionality provides easy exit. Click-outside-to-close is intuitive UX pattern. Modal maintains image quality for better viewing experience. |

---

## Use Case 7: Contact Owner by Phone

| Field | Description |
|-------|-------------|
| **Use Case Name** | Contact Owner by Phone |
| **Actor** | Pet Adoption Community (ST4) |
| **Description** | A member of the pet adoption community contacts the pet owner by clicking on the phone number displayed in the adoption listing. The phone number is displayed prominently and is directly clickable as a tel: link. |
| **Data** | Phone number (from adoption listing), tel: link format, phone number display text |
| **Stimulus** | Community member views an adoption listing, clicks on the phone number displayed in the adoption card |
| **Response** | System displays phone number prominently in adoption card, formats phone number as clickable tel: link, triggers device phone dialer when clicked (on mobile devices), displays phone number in user-friendly format, provides visual indication that number is clickable (link styling), enables direct calling functionality, and maintains phone number visibility throughout card interaction |
| **Comments** | Phone number is displayed prominently without requiring a separate "Contact Owner" button. Tel: link format enables direct calling on mobile devices and phone applications on desktop. Phone number is always visible and accessible. Clicking phone number immediately initiates contact attempt. No additional steps required for contacting owner. Visual styling indicates clickability (typically underlined or colored link). Phone number is a primary contact method for adoption inquiries. |

