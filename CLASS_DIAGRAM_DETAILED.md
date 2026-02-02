# Classes and Their Responsibilities
## VetVoge & Eagle's Vet Clinic System

---

## 1. User

**Attributes:**
- `id`: Unique identifier for each user (String, primary key)
- `email`: Email address associated with the account (String, unique)
- `password`: User's password for access control (String, hashed)
- `name`: User's full name (String, optional)
- `phone`: User's phone number (String, optional)
- `role`: User role (String, default: "user", values: "user" or "admin")
- `governorate`: User's governorate in Jordan (String, optional)
- `area`: User's area within governorate (String, optional)
- `address`: User's street address (String, optional)
- `createdAt`: Account creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `signUp()`: Allows a user to create a new account with email, password, name, and phone
- `signIn()`: Logs a user into the platform using email and password
- `signOut()`: Logs a user out of the platform and clears session
- `resetPassword()`: Allows a user to reset their password via email
- `changePassword()`: Allows a user to change their password from profile settings
- `updateProfile()`: Updates user profile information (name, phone, address)
- `upgradeAccount()`: Upgrades phone-based account to full email/password account

---

## 2. Pet

**Attributes:**
- `id`: Unique identifier for each pet (String, primary key)
- `userId`: Foreign key to User who owns the pet (String)
- `petCode`: Unique pet code (String, unique, format: PET-XXXXX)
- `name`: Pet's name (String)
- `species`: Pet species (String, e.g., "Dog", "Cat", "Bird")
- `breed`: Pet breed (String, optional)
- `gender`: Pet gender (String)
- `birthDate`: Pet's birth date (DateTime, optional)
- `color`: Pet's color/markings (String, optional)
- `photo`: URL to pet's photo (String, optional)
- `allergies`: Known allergies (String, optional)
- `medications`: Current medications (String, optional)
- `medicalHistory`: General medical history (String, optional)
- `surgicalHistory`: Surgical procedures history (String, optional)
- `chronicConditions`: Chronic health conditions (String, optional)
- `createdAt`: Profile creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createPet()`: Creates a new pet profile for a user
- `updatePet()`: Updates pet profile information
- `deletePet()`: Deletes pet profile and cascade deletes related records
- `uploadPhoto()`: Uploads pet photo to Cloudinary
- `generatePetCode()`: Auto-generates unique pet code

---

## 3. Product

**Attributes:**
- `id`: Unique identifier for each product (String, primary key)
- `name`: Product name (String)
- `slug`: URL-friendly product identifier (String, unique)
- `description`: Product description (String)
- `price`: Product price in JOD (Float)
- `image`: Product image URLs (String, comma-separated)
- `stock`: Available stock quantity (Int, default: 0)
- `categoryId`: Foreign key to Category (String)
- `createdAt`: Product creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createProduct()`: Creates a new product with all details
- `updateProduct()`: Updates product information
- `deleteProduct()`: Deletes product from catalog
- `updateStock()`: Updates product stock quantity
- `decreaseStock()`: Decreases stock when order placed
- `restoreStock()`: Restores stock when order cancelled
- `generateSlug()`: Auto-generates URL-friendly slug from name
- `uploadImages()`: Uploads product images to Cloudinary

---

## 4. Category

**Attributes:**
- `id`: Unique identifier for each category (String, primary key)
- `name`: Category name (String, unique)
- `slug`: URL-friendly category identifier (String, unique)
- `image`: Category image URL (String, optional)
- `createdAt`: Category creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createCategory()`: Creates a new product category
- `updateCategory()`: Updates category information
- `deleteCategory()`: Deletes category (cascade to products)
- `getProducts()`: Retrieves all products in this category

---

## 5. Order

**Attributes:**
- `id`: Unique identifier for each order (String, primary key)
- `userId`: Foreign key to User (String, optional, null for guest orders)
- `customerName`: Customer's full name (String)
- `customerEmail`: Customer's email (String)
- `customerPhone`: Customer's phone number (String)
- `customerAddress`: Delivery address (String)
- `deliveryMethod`: Delivery method (String, values: "delivery" or "pickup")
- `paymentMethod`: Payment method (String, default: "cash", values: "cash" or "click")
- `total`: Total order amount in JOD (Float)
- `status`: Order status (String, default: "pending", values: "pending", "completed", "cancelled")
- `notes`: Additional order notes (String, optional)
- `createdAt`: Order creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createOrder()`: Creates a new order with items
- `updateStatus()`: Updates order status (pending/completed/cancelled)
- `addNotes()`: Adds notes to order
- `calculateTotal()`: Calculates total order amount
- `processOrder()`: Processes order and decreases stock
- `cancelOrder()`: Cancels order and restores stock

---

## 6. OrderItem

**Attributes:**
- `id`: Unique identifier for each order item (String, primary key)
- `orderId`: Foreign key to Order (String)
- `productId`: Foreign key to Product (String)
- `quantity`: Quantity ordered (Int)
- `price`: Unit price at time of order (Float)

**Methods:**
- `createOrderItem()`: Creates order item linking product to order
- `calculateSubtotal()`: Calculates subtotal (quantity × price)

---

## 7. Appointment

**Attributes:**
- `id`: Unique identifier for each appointment (String, primary key)
- `userId`: Foreign key to User (String, optional, null for guest appointments)
- `ownerName`: Pet owner's name (String, optional)
- `ownerPhone`: Pet owner's phone (String, optional)
- `petId`: Foreign key to Pet (String, optional)
- `petName`: Pet's name (String, optional)
- `appointmentDate`: Scheduled appointment date (DateTime)
- `appointmentTime`: Scheduled appointment time (String)
- `reason`: Reason for appointment (String)
- `status`: Appointment status (String, default: "upcoming", values: "upcoming", "completed", "cancelled", "no-show")
- `notes`: Additional notes (String, optional)
- `completionPrice`: Price charged upon completion (Float, optional)
- `completionPaymentMethod`: Payment method used (String, optional)
- `createdAt`: Appointment creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createAppointment()`: Creates a new appointment booking
- `updateAppointment()`: Updates appointment details (date, time, reason, notes)
- `completeAppointment()`: Marks appointment as completed with price and payment method
- `cancelAppointment()`: Cancels appointment
- `updateStatus()`: Updates appointment status

---

## 8. HotelRoom

**Attributes:**
- `id`: Unique identifier for each room (String, primary key)
- `roomNumber`: Room number (Int)
- `type`: Room type for pet species (String, enum: "DOG", "CAT", "BIRD")
- `status`: Room status (String, enum: "AVAILABLE", "OCCUPIED", "CLEANING", "MAINTENANCE")
- `notes`: Room notes (String, optional)
- `createdAt`: Room creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createRoom()`: Creates a new hotel room
- `updateStatus()`: Updates room status
- `checkAvailability()`: Checks if room is available for given dates
- `setOccupied()`: Marks room as occupied
- `setAvailable()`: Marks room as available

---

## 9. HotelReservation

**Attributes:**
- `id`: Unique identifier for each reservation (String, primary key)
- `roomId`: Foreign key to HotelRoom (String)
- `userId`: Foreign key to User (String, optional)
- `ownerName`: Pet owner's name (String)
- `ownerPhone`: Pet owner's phone (String)
- `petId`: Foreign key to Pet (String, optional)
- `petName`: Pet's name (String)
- `checkIn`: Check-in date and time (DateTime)
- `checkOut`: Check-out date and time (DateTime)
- `status`: Reservation status (String, default: "booked", values: "booked", "checked_in", "checked_out", "cancelled")
- `notes`: Additional notes (String, optional)
- `pickup`: Whether pickup service is requested (Boolean, default: false)
- `dropoff`: Whether dropoff service is requested (Boolean, default: false)
- `totalNights`: Total number of nights (Int, optional)
- `roomRate`: Rate per night in JOD (Float, optional, default: 20)
- `subtotal`: Base room cost (Float, optional)
- `pickupFee`: Pickup service fee (Float, optional, default: 5)
- `dropoffFee`: Dropoff service fee (Float, optional, default: 5)
- `extraServices`: Additional services (JSON, optional, format: [{reason: String, amount: Float}])
- `total`: Total reservation cost (Float, optional)
- `paymentMethod`: Payment method used (String, optional)
- `checkedOutAt`: Checkout timestamp (DateTime, optional)
- `createdAt`: Reservation creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createReservation()`: Creates a new hotel reservation
- `updateReservation()`: Updates reservation details
- `checkIn()`: Marks reservation as checked-in
- `checkout()`: Completes checkout with pricing and payment details
- `cancelReservation()`: Cancels reservation and frees room
- `calculateCost()`: Calculates total cost (nights × rate + fees + services)
- `checkAvailability()`: Checks room availability for dates
- `addExtraService()`: Adds extra service to reservation (name only, admin sets amount)

---

## 10. PetAdoption

**Attributes:**
- `id`: Unique identifier for each adoption post (String, primary key)
- `petName`: Name of pet available for adoption (String)
- `description`: Description of pet (String)
- `phoneNumber`: Contact phone number (String)
- `area`: Area location in Jordan (String)
- `images`: JSON array of image URLs (String, stored as JSON string)
- `status`: Post status (String, default: "active", values: "active", "adopted", "removed")
- `createdAt`: Post creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `createPost()`: Creates a new pet adoption post
- `updatePost()`: Updates adoption post information
- `uploadImages()`: Uploads pet images to Cloudinary
- `markAdopted()`: Marks pet as adopted
- `removePost()`: Removes post from listings

---

## 11. Vaccination

**Attributes:**
- `id`: Unique identifier for each vaccination record (String, primary key)
- `petId`: Foreign key to Pet (String)
- `name`: Vaccination name (String)
- `date`: Vaccination date (DateTime)
- `nextDue`: Next vaccination due date (DateTime, optional)
- `notes`: Additional notes (String, optional)
- `createdAt`: Record creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `addVaccination()`: Adds vaccination record to pet
- `updateVaccination()`: Updates vaccination record
- `deleteVaccination()`: Deletes vaccination record
- `getNextDue()`: Calculates next vaccination due date

---

## 12. ClinicVisit

**Attributes:**
- `id`: Unique identifier for each clinic visit (String, primary key)
- `petId`: Foreign key to Pet (String)
- `visitDate`: Date of clinic visit (DateTime)
- `reason`: Reason for visit (String)
- `diagnosis`: Diagnosis made (String, optional)
- `treatment`: Treatment provided (String, optional)
- `prescriptions`: Prescriptions given (String, optional)
- `notes`: Additional notes (String, optional)
- `nextAppointment`: Next scheduled appointment (DateTime, optional)
- `createdAt`: Record creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `addClinicVisit()`: Adds clinic visit record to pet
- `updateClinicVisit()`: Updates clinic visit record
- `deleteClinicVisit()`: Deletes clinic visit record
- `scheduleNextAppointment()`: Sets next appointment date

---

## 13. Deworming

**Attributes:**
- `id`: Unique identifier for each deworming record (String, primary key)
- `petId`: Foreign key to Pet (String)
- `name`: Deworming medication name (String)
- `date`: Deworming date (DateTime)
- `nextDue`: Next deworming due date (DateTime, optional)
- `notes`: Additional notes (String, optional)
- `createdAt`: Record creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `addDeworming()`: Adds deworming record to pet
- `updateDeworming()`: Updates deworming record
- `deleteDeworming()`: Deletes deworming record
- `getNextDue()`: Calculates next deworming due date

---

## 14. WeightRecord

**Attributes:**
- `id`: Unique identifier for each weight record (String, primary key)
- `petId`: Foreign key to Pet (String)
- `date`: Record date (DateTime)
- `weight`: Weight in kg (Float)
- `notes`: Additional notes (String, optional)
- `createdAt`: Record creation timestamp (DateTime)
- `updatedAt`: Last update timestamp (DateTime)

**Methods:**
- `addWeightRecord()`: Adds weight record to pet
- `updateWeightRecord()`: Updates weight record
- `deleteWeightRecord()`: Deletes weight record
- `getWeightHistory()`: Retrieves weight history for pet
- `getWeightTrend()`: Calculates weight trend over time

---

## 15. PageView

**Attributes:**
- `id`: Unique identifier for each page view (String, primary key)
- `page`: Page path/URL (String)
- `sessionId`: User session identifier (String)
- `createdAt`: View timestamp (DateTime)

**Methods:**
- `trackPageView()`: Records a page view for analytics
- `getPageViews()`: Retrieves page view statistics
- `getUniqueVisitors()`: Calculates unique visitor count

---

## 16. ProductView

**Attributes:**
- `id`: Unique identifier for each product view (String, primary key)
- `productId`: Foreign key to Product (String)
- `createdAt`: View timestamp (DateTime)

**Methods:**
- `trackProductView()`: Records a product view for analytics
- `getProductViews()`: Retrieves product view statistics
- `getTopProducts()`: Gets most viewed products

---

**End of Document**

