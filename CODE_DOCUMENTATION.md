# Eagles Vet Clinic - Complete Code Documentation

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Backend API Endpoints](#backend-api-endpoints)
5. [Frontend-Backend Connection](#frontend-backend-connection)
6. [State Management](#state-management)
7. [Security Implementation](#security-implementation)
8. [File Structure](#file-structure)
9. [Data Flow Examples](#data-flow-examples)

---

## System Architecture Overview

The Eagles Vet Clinic system is built using **Next.js 14** with the **App Router** architecture. It follows a full-stack approach where:

- **Frontend**: React components in `app/` directory (Server and Client Components)
- **Backend**: API routes in `app/api/` directory (Next.js Route Handlers)
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Recoil for client-side state (cart)
- **Session Management**: localStorage for user sessions
- **File Storage**: Cloudinary for image uploads

### Architecture Flow
```
User Browser → Next.js Frontend (React) → API Routes → Prisma ORM → PostgreSQL Database
                                      ↓
                                 Cloudinary (Images)
```

**Key Files:**
- `app/layout.tsx` - Root layout with providers
- `middleware.ts` - Security middleware (lines 1-46)
- `lib/prisma.ts` - Database client singleton (lines 1-13)

---

## Technology Stack

| Technology | Version/Purpose | Location |
|------------|----------------|----------|
| Next.js | 14 (App Router) | Framework |
| React | 18+ | UI Library |
| TypeScript | Latest | Type Safety |
| Prisma | ORM | `prisma/schema.prisma` |
| PostgreSQL | Database | `DATABASE_URL` env |
| Recoil | State Management | `lib/atoms/cart.ts` |
| Tailwind CSS | Styling | `tailwind.config.ts` |
| Cloudinary | Image Storage | `app/api/upload/route.ts` |
| Zod | Validation | `lib/security.ts` |
| bcrypt | Password Hashing | Used in auth routes |

---

## Database Schema

### Schema File Location
**File:** `prisma/schema.prisma` (lines 1-292)

### Database Tables

#### 1. User Table
**Location:** `prisma/schema.prisma` (lines 10-26)

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  password     String
  role         String        @default("user")
  name         String?
  phone        String?
  address      String?
  area         String?
  governorate  String?
  // Relations
  appointments Appointment[]
  orders       Order[]
  pets         Pet[]
  hotelReservations HotelReservation[]
}
```

**Key Queries:**
- **Find by email:** `prisma.user.findUnique({ where: { email } })` - Used in `app/api/auth/login/route.ts:51`
- **Create user:** `prisma.user.create({ data: {...} })` - Used in `app/api/auth/signup/route.ts`
- **Update user:** `prisma.user.update({ where: { id }, data: {...} })` - Used in `app/api/users/[id]/route.ts`

#### 2. Product Table
**Location:** `prisma/schema.prisma` (lines 38-59)

```prisma
model Product {
  id           String        @id @default(cuid())
  name         String
  slug         String        @unique
  description  String
  price        Float
  image        String
  stock        Int           @default(0)
  categoryId   String
  // Relations
  orderItems   OrderItem[]
  category     Category      @relation(...)
  productViews ProductView[]
}
```

**Key Queries:**
- **Get all products with pagination:** `prisma.product.findMany({ where, take, skip, include: { category } })` - Used in `app/api/products/route.ts:33`
- **Create product:** `prisma.product.create({ data: {...} })` - Used in `app/api/admin/products/route.ts:34`
- **Update stock:** `prisma.product.update({ where: { id }, data: { stock: { decrement: quantity } } })` - Used in `app/api/orders/route.ts:56`
- **Delete product:** `prisma.product.delete({ where: { id } })` - Used in `app/api/admin/products/[id]/route.ts`

#### 3. Order Table
**Location:** `prisma/schema.prisma` (lines 61-83)

```prisma
model Order {
  id              String      @id @default(cuid())
  customerName    String
  customerEmail   String
  customerPhone   String
  customerAddress String
  deliveryMethod  String
  total           Float
  status          String      @default("pending")
  paymentMethod   String      @default("cash")
  userId          String?
  // Relations
  user            User?       @relation(...)
  orderItems      OrderItem[]
}
```

**Key Queries:**
- **Create order with items:** `prisma.order.create({ data: { ..., orderItems: { create: [...] } } })` - Used in `app/api/orders/route.ts:24`
- **Get orders with filters:** `prisma.order.findMany({ where, include: { orderItems: { include: { product } } } })` - Used in `app/api/orders/route.ts:114`

#### 4. Pet Table
**Location:** `prisma/schema.prisma` (lines 109-133)

```prisma
model Pet {
  id                String         @id @default(cuid())
  userId            String
  petCode           String         @unique
  name              String
  species           String
  breed             String?
  gender            String
  birthDate         DateTime?
  photo             String?
  // Medical fields
  allergies         String?
  chronicConditions String?
  medicalHistory    String?
  medications       String?
  surgicalHistory   String?
  // Relations
  vaccinations      Vaccination[]
  dewormings        Deworming[]
  clinicVisits      ClinicVisit[]
  weightHistory     WeightRecord[]
  hotelReservations HotelReservation[]
}
```

**Key Queries:**
- **Get user's pets with medical records:** `prisma.pet.findMany({ where: { userId }, include: { vaccinations, dewormings, clinicVisits, weightHistory } })` - Used in `app/api/pets/route.ts:13`
- **Create pet:** `prisma.pet.create({ data: { petCode: 'PET-XXXXX', ... } })` - Used in `app/api/pets/route.ts:61`

#### 5. Appointment Table
**Location:** `prisma/schema.prisma` (lines 185-210)

```prisma
model Appointment {
  id                     String   @id @default(cuid())
  userId                 String?
  ownerName              String?
  ownerPhone             String?
  petId                  String?
  petName                String?
  appointmentDate        DateTime
  appointmentTime        String
  reason                 String
  status                 String   @default("upcoming")
  completionPrice        Float?
  completionPaymentMethod String?
  // Relations
  user                   User?    @relation(...)
}
```

**Key Queries:**
- **Create appointment:** `prisma.appointment.create({ data: {...} })` - Used in `app/api/appointments/route.ts:118`
- **Get appointments with filters:** `prisma.appointment.findMany({ where, include: { user } })` - Used in `app/api/appointments/route.ts:49`

#### 6. HotelReservation Table
**Location:** `prisma/schema.prisma` (lines 240-275)

```prisma
model HotelReservation {
  id                  String    @id @default(cuid())
  roomId              String
  userId              String?
  ownerName           String
  ownerPhone          String
  petId               String?
  petName             String
  checkIn             DateTime
  checkOut            DateTime
  status              String    @default("booked")
  pickup              Boolean   @default(false)
  dropoff             Boolean   @default(false)
  totalNights         Int?
  roomRate            Float?
  subtotal            Float?
  pickupFee           Float?
  dropoffFee          Float?
  extraServices       Json?
  total               Float?
  paymentMethod       String?
  // Relations
  room                HotelRoom @relation(...)
  user                User?     @relation(...)
  pet                 Pet?      @relation(...)
}
```

**Key Queries:**
- **Check room availability:** `prisma.hotelReservation.count({ where: { roomId, status: { in: ['booked', 'checked_in'] }, OR: [...] } })` - Used in `app/api/hotel/reservations/route.ts:46`
- **Create reservation:** `prisma.hotelReservation.create({ data: {...} })` - Used in `app/api/hotel/reservations/route.ts:83`

#### 7. Other Tables
- **Category** - Product categories (`prisma/schema.prisma:28-36`)
- **OrderItem** - Order line items (`prisma/schema.prisma:85-93`)
- **Vaccination** - Pet vaccination records (`prisma/schema.prisma:135-145`)
- **Deworming** - Pet deworming records (`prisma/schema.prisma:147-157`)
- **ClinicVisit** - Pet clinic visit records (`prisma/schema.prisma:159-172`)
- **WeightRecord** - Pet weight history (`prisma/schema.prisma:174-183`)
- **HotelRoom** - Hotel room definitions (`prisma/schema.prisma:226-238`)
- **PetAdoption** - Pet adoption listings (`prisma/schema.prisma:277-291`)
- **PageView** - Analytics page views (`prisma/schema.prisma:95-100`)
- **ProductView** - Analytics product views (`prisma/schema.prisma:102-107`)

---

## Backend API Endpoints

All API routes are located in the `app/api/` directory. Next.js automatically creates REST endpoints based on the file structure.

### Authentication Endpoints

#### 1. POST /api/auth/login
**File:** `app/api/auth/login/route.ts` (lines 26-97)

**Purpose:** Authenticate user and return user data

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:** Uses `loginSchema` from `lib/security.ts:5-8`

**Database Query:**
- Line 51: `prisma.user.findUnique({ where: { email: email.toLowerCase() } })`
- Line 64: `bcrypt.compare(password, user.password)` - Password verification

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "role": "user"
  }
}
```

**Rate Limiting:** 5 attempts per 15 minutes per IP (lines 9-24)

#### 2. POST /api/auth/signup
**File:** `app/api/auth/signup/route.ts`

**Purpose:** Create new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "Password123",
  "phone": "0791234567"
}
```

**Validation:** Uses `signupSchema` from `lib/security.ts:10-18`

**Database Query:**
- `prisma.user.create({ data: { email, password: hashedPassword, ... } })`

**Password Hashing:** `bcrypt.hash(password, 12)` - 12 rounds of salting

#### 3. POST /api/auth/logout
**File:** `app/api/auth/logout/route.ts`

**Purpose:** Logout endpoint (mainly for clearing server-side sessions if needed)

---

### Product Endpoints

#### 1. GET /api/products
**File:** `app/api/products/route.ts` (lines 4-65)

**Purpose:** Get products with filtering, sorting, and pagination

**Query Parameters:**
- `category` - Filter by category slug
- `sort` - Sort by: 'newest', 'price-low', 'price-high', 'name'
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 24)

**Database Query (lines 32-43):**
```typescript
prisma.product.findMany({
  where: category ? { category: { slug: category } } : {},
  take: limit,
  skip: (page - 1) * limit,
  include: { category: true },
  orderBy: { price: 'asc' } // or 'desc', 'name', 'createdAt'
})
```

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 100,
    "pages": 5
  }
}
```

#### 2. GET /api/products/[slug]
**File:** `app/shop/[slug]/page.tsx` (fetches via component)

**Purpose:** Get single product by slug

**Frontend Fetch:** Component fetches product data directly

---

### Order Endpoints

#### 1. POST /api/orders
**File:** `app/api/orders/route.ts` (lines 4-74)

**Purpose:** Create a new order

**Request Body:**
```json
{
  "userId": "optional-user-id",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "0791234567",
  "customerAddress": "Amman, Jubeiha, Street 123",
  "deliveryMethod": "delivery",
  "paymentMethod": "cash",
  "orderItems": [
    {
      "productId": "product-id",
      "quantity": 2,
      "price": 25.50
    }
  ],
  "total": 51.00
}
```

**Database Operations:**
1. **Line 24:** Create order with nested orderItems
   ```typescript
   prisma.order.create({
     data: {
       userId: userId || null,
       customerName,
       ...,
       orderItems: {
         create: orderItems.map(item => ({
           productId: item.productId,
           quantity: item.quantity,
           price: item.price
         }))
       }
     }
   })
   ```

2. **Lines 55-64:** Decrease product stock immediately
   ```typescript
   for (const item of orderItems) {
     await prisma.product.update({
       where: { id: item.productId },
       data: { stock: { decrement: item.quantity } }
     })
   }
   ```

**Response:** Created order with orderItems (status: 201)

#### 2. GET /api/orders
**File:** `app/api/orders/route.ts` (lines 76-149)

**Purpose:** Get orders with filtering and pagination

**Query Parameters:**
- `status` - Filter by status (pending, completed, cancelled)
- `startDate` - Filter from date
- `endDate` - Filter to date
- `userId` - Filter by user ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Database Query (lines 113-131):**
```typescript
prisma.order.findMany({
  where: {
    status: status || undefined,
    userId: userId || undefined,
    createdAt: {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined
    }
  },
  take: limit,
  skip: (page - 1) * limit,
  include: {
    orderItems: {
      include: { product: true }
    }
  },
  orderBy: [{ createdAt: 'desc' }, { status: 'asc' }]
})
```

---

### Pet Endpoints

#### 1. GET /api/pets
**File:** `app/api/pets/route.ts` (lines 5-41)

**Purpose:** Get all pets for a user

**Query Parameters:**
- `userId` - Required user ID

**Database Query (lines 13-34):**
```typescript
prisma.pet.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
  include: {
    vaccinations: { orderBy: { date: 'desc' }, take: 5 },
    dewormings: { orderBy: { date: 'desc' }, take: 5 },
    clinicVisits: { orderBy: { visitDate: 'desc' }, take: 5 },
    weightHistory: { orderBy: { date: 'desc' }, take: 5 }
  }
})
```

#### 2. POST /api/pets
**File:** `app/api/pets/route.ts` (lines 43-85)

**Purpose:** Create a new pet profile

**Request Body:**
```json
{
  "userId": "user-id",
  "name": "Fluffy",
  "species": "Cat",
  "breed": "Persian",
  "gender": "Female",
  "birthDate": "2020-01-15",
  "color": "White",
  "photo": "cloudinary-url",
  "allergies": "None",
  "medications": "Flea treatment",
  "medicalHistory": "...",
  "surgicalHistory": "...",
  "chronicConditions": "..."
}
```

**Database Operations:**
1. **Line 58:** Generate unique pet code
   ```typescript
   const existingPets = await prisma.pet.count();
   const petCode = `PET-${String(existingPets + 1).padStart(5, '0')}`;
   ```

2. **Line 61:** Create pet
   ```typescript
   prisma.pet.create({
     data: {
       userId,
       petCode,
       name,
       species,
       ...
     }
   })
   ```

#### 3. GET /api/pets/[id]
**File:** `app/api/pets/[id]/route.ts`

**Purpose:** Get single pet with all medical records

#### 4. PUT /api/pets/[id]
**File:** `app/api/pets/[id]/route.ts`

**Purpose:** Update pet information

#### 5. DELETE /api/pets/[id]
**File:** `app/api/pets/[id]/route.ts`

**Purpose:** Delete pet (cascades to medical records)

#### 6. POST /api/pets/[id]/medical
**File:** `app/api/pets/[id]/medical/route.ts`

**Purpose:** Add medical records (vaccination, deworming, clinic visit, weight)

**Request Body:**
```json
{
  "type": "vaccination", // or "deworming", "clinicVisit", "weight"
  "data": {
    "name": "Rabies",
    "date": "2024-01-15",
    "nextDue": "2025-01-15",
    "notes": "..."
  }
}
```

---

### Appointment Endpoints

#### 1. GET /api/appointments
**File:** `app/api/appointments/route.ts` (lines 4-94)

**Purpose:** Get appointments with filtering

**Query Parameters:**
- `userId` - Filter by user ID
- `status` - Filter by status (upcoming, completed, cancelled)
- `startDate` - Filter from date
- `endDate` - Filter to date
- `search` - Search by pet name, owner name, or phone
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Database Query (lines 49-70):**
```typescript
prisma.appointment.findMany({
  where: {
    userId: userId || undefined,
    status: status || undefined,
    OR: search ? [
      { petName: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { phone: { contains: search, mode: 'insensitive' } } }
    ] : undefined,
    appointmentDate: {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined
    }
  },
  include: { user: { select: { id, name, email, phone } } },
  orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'desc' }]
})
```

#### 2. POST /api/appointments
**File:** `app/api/appointments/route.ts` (lines 96-153)

**Purpose:** Create a new appointment

**Request Body:**
```json
{
  "userId": "optional-user-id",
  "ownerName": "John Doe",
  "ownerPhone": "0791234567",
  "petId": "optional-pet-id",
  "petName": "Fluffy",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "10:00",
  "reason": "Annual checkup",
  "notes": "Optional notes"
}
```

**Database Query (line 118):**
```typescript
prisma.appointment.create({
  data: {
    userId: userId || null,
    ownerName: ownerName || null,
    ownerPhone: ownerPhone || null,
    petId: petId || null,
    petName: petName || null,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    reason,
    notes: notes || null,
    status: 'upcoming'
  }
})
```

#### 3. PUT /api/appointments/[id]
**File:** `app/api/appointments/[id]/route.ts`

**Purpose:** Update appointment details

#### 4. PUT /api/appointments/[id] (Complete)
**File:** `app/api/appointments/[id]/route.ts`

**Purpose:** Complete appointment with price and payment method

---

### Hotel Endpoints

#### 1. GET /api/hotel/rooms
**File:** `app/api/hotel/rooms/route.ts`

**Purpose:** Get all hotel rooms, optionally filtered by type

**Query Parameters:**
- `type` - Filter by room type (DOG, CAT, BIRD)

#### 2. GET /api/hotel/reservations
**File:** `app/api/hotel/reservations/route.ts` (lines 5-25)

**Purpose:** Get hotel reservations

**Query Parameters:**
- `status` - Filter by status (booked, checked_in, checked_out, cancelled)

**Database Query (lines 10-18):**
```typescript
prisma.hotelReservation.findMany({
  where: { status },
  include: {
    room: true,
    user: { select: { id: true, name: true, phone: true } },
    pet: { select: { id: true, name: true, species: true } }
  },
  orderBy: { checkIn: 'desc' }
})
```

#### 3. POST /api/hotel/reservations
**File:** `app/api/hotel/reservations/route.ts` (lines 27-110)

**Purpose:** Create a new hotel reservation

**Request Body:**
```json
{
  "roomId": "room-id",
  "userId": "optional-user-id",
  "ownerName": "John Doe",
  "ownerPhone": "0791234567",
  "petId": "optional-pet-id",
  "petName": "Fluffy",
  "checkIn": "2024-02-15",
  "checkOut": "2024-02-20",
  "pickup": true,
  "dropoff": false,
  "extraServices": ["bath", "grooming"],
  "notes": "Optional notes"
}
```

**Database Operations:**
1. **Lines 46-54:** Check room availability (overlap detection)
   ```typescript
   const overlaps = await prisma.hotelReservation.count({
     where: {
       roomId,
       status: { in: ['booked', 'checked_in'] },
       OR: [{
         AND: [
           { checkIn: { lt: checkOutDate } },
           { checkOut: { gt: checkInDate } }
         ]
       }]
     }
   })
   ```

2. **Lines 83-100:** Create reservation
   ```typescript
   prisma.hotelReservation.create({
     data: {
       roomId,
       userId: resolvedUserId,
       ownerName,
       ownerPhone,
       petId: petId || null,
       petName,
       checkIn: checkInDate,
       checkOut: checkOutDate,
       status: 'booked',
       pickup: !!pickup,
       dropoff: !!dropoff,
       extraServices: extraServices || null
     }
   })
   ```

3. **Line 103:** Mark room as OCCUPIED
   ```typescript
   await prisma.hotelRoom.update({
     where: { id: roomId },
     data: { status: 'OCCUPIED' }
   })
   ```

#### 4. PUT /api/hotel/reservations/[id]
**File:** `app/api/hotel/reservations/[id]/route.ts`

**Purpose:** Update reservation details

#### 5. POST /api/hotel/reservations/[id]/checkout
**File:** `app/api/hotel/reservations/[id]/checkout/route.ts`

**Purpose:** Checkout reservation (calculate total, set payment method, mark room available)

---

### Admin Endpoints

#### 1. GET /api/admin/products
**File:** `app/api/admin/products/route.ts` (lines 4-21)

**Purpose:** Get all products for admin dashboard

**Database Query (lines 6-11):**
```typescript
prisma.product.findMany({
  include: { category: true },
  orderBy: { createdAt: 'desc' }
})
```

#### 2. POST /api/admin/products
**File:** `app/api/admin/products/route.ts` (lines 23-57)

**Purpose:** Create new product

**Request Body:**
```json
{
  "name": "Dog Food",
  "description": "Premium dog food",
  "price": 25.50,
  "image": "cloudinary-url",
  "stock": 100,
  "categoryId": "category-id"
}
```

**Database Operations:**
1. **Lines 27-32:** Generate slug from name
2. **Lines 34-47:** Create product

#### 3. PUT /api/admin/products/[id]
**File:** `app/api/admin/products/[id]/route.ts`

**Purpose:** Update product

#### 4. DELETE /api/admin/products/[id]
**File:** `app/api/admin/products/[id]/route.ts`

**Purpose:** Delete product (with validation)

**Database Operations:**
1. Check if product is in orders (prevents deletion)
2. Delete ProductView records
3. Delete product

**Code (lines in route file):**
```typescript
// Check if product is referenced in orders
const orderItemsCount = await prisma.orderItem.count({
  where: { productId: params.id }
})

if (orderItemsCount > 0) {
  return NextResponse.json(
    { error: 'Cannot delete product. It is referenced in existing orders.' },
    { status: 409 }
  )
}

// Delete related ProductView records
await prisma.productView.deleteMany({
  where: { productId: params.id }
})

// Delete product
await prisma.product.delete({
  where: { id: params.id }
})
```

#### 5. GET /api/admin/orders
**File:** `app/api/admin/orders/[id]/route.ts` (similar to GET /api/orders)

**Purpose:** Get orders for admin (with admin-specific filters)

#### 6. PUT /api/admin/orders/[id]
**File:** `app/api/admin/orders/[id]/route.ts`

**Purpose:** Update order status and notes

**Database Query:**
```typescript
prisma.order.update({
  where: { id: params.id },
  data: {
    status: newStatus,
    notes: notes || undefined
  }
})
```

**Stock Restoration (if cancelled):**
```typescript
if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
  // Restore stock for each order item
  for (const item of order.orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } }
    })
  }
}
```

#### 7. GET /api/admin/users
**File:** `app/api/admin/users/route.ts`

**Purpose:** Get all users (regular users only, not admins)

**Database Query:**
```typescript
prisma.user.findMany({
  where: { role: { not: 'admin' } },
  orderBy: { createdAt: 'desc' }
})
```

#### 8. POST /api/admin/users
**File:** `app/api/admin/users/route.ts`

**Purpose:** Create user account (admin-created)

#### 9. GET /api/admin/users/[id]
**File:** `app/api/admin/users/[id]/route.ts`

**Purpose:** Get user details with pets, orders, appointments

#### 10. PUT /api/admin/users/[id]
**File:** `app/api/admin/users/[id]/route.ts`

**Purpose:** Update user information

#### 11. DELETE /api/admin/users/[id]
**File:** `app/api/admin/users/[id]/route.ts`

**Purpose:** Delete user (cascades to pets, orders, appointments)

---

### Other Endpoints

#### 1. GET /api/categories
**File:** `app/api/categories/route.ts`

**Purpose:** Get all product categories

**Database Query:**
```typescript
prisma.category.findMany({
  orderBy: { name: 'asc' }
})
```

#### 2. POST /api/upload
**File:** `app/api/upload/route.ts` (lines 11-85)

**Purpose:** Upload image to Cloudinary

**Request:** FormData with 'file' field

**Validation:**
- File type: images only (lines 33-39)
- File size: max 5MB (lines 42-48)

**Cloudinary Upload (lines 55-72):**
```typescript
cloudinary.uploader.upload_stream(
  {
    folder: 'eagles-vet',
    resource_type: 'image'
  },
  (error, result) => { ... }
).end(buffer)
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/.../image.jpg",
  "public_id": "eagles-vet/..."
}
```

#### 3. GET /api/analytics
**File:** `app/api/analytics/route.ts`

**Purpose:** Get analytics data (revenue, statistics, top products)

#### 4. POST /api/analytics/pageview
**File:** `app/api/analytics/pageview/route.ts`

**Purpose:** Track page view

**Database Query:**
```typescript
prisma.pageView.create({
  data: {
    page: pagePath,
    sessionId: sessionId || 'unknown'
  }
})
```

#### 5. POST /api/analytics/productview
**File:** `app/api/analytics/productview/route.ts`

**Purpose:** Track product view

**Database Query:**
```typescript
prisma.productView.create({
  data: {
    productId: productId
  }
})
```

#### 6. GET /api/adoptions
**File:** `app/api/adoptions/route.ts`

**Purpose:** Get pet adoption listings

**Database Query:**
```typescript
prisma.petAdoption.findMany({
  where: { status: 'active' },
  orderBy: { createdAt: 'desc' }
})
```

#### 7. POST /api/adoptions
**File:** `app/api/adoptions/route.ts`

**Purpose:** Create pet adoption post

**Request Body:**
```json
{
  "petName": "Buddy",
  "description": "Friendly dog looking for a home",
  "phoneNumber": "0791234567",
  "area": "Amman",
  "images": ["url1", "url2"]
}
```

**Database Query:**
```typescript
prisma.petAdoption.create({
  data: {
    petName,
    description,
    phoneNumber,
    area,
    images: JSON.stringify(images),
    status: 'active'
  }
})
```

---

## Frontend-Backend Connection

### Connection Pattern

The frontend connects to the backend using standard **fetch API** calls to Next.js API routes. All API calls are made from client components using `'use client'` directive.

### Session Management

**Location:** `lib/session.ts` (lines 1-21)

**Storage:** localStorage (client-side only)

**Functions:**
- `getSessionId()` - Get or create session ID for analytics
- `clearSessionId()` - Clear session ID

**User Session Storage:**
- User data stored in `localStorage.getItem('user')` after login
- Used throughout the app to check authentication status
- Example: `components/Header.tsx:19-27`

### Authentication Flow

1. **Login Page:** `app/admin/login/page.tsx` or user login page
2. **API Call:** `POST /api/auth/login`
   - File: `app/api/auth/login/route.ts:26`
   - Validates credentials
   - Returns user data
3. **Store in localStorage:**
   ```typescript
   localStorage.setItem('user', JSON.stringify(userData))
   ```
4. **Redirect:** Based on user role (admin → `/admin/dashboard`, user → `/user/dashboard`)

### Product Browsing Flow

1. **Shop Page:** `app/shop/page.tsx`
2. **Component:** `components/ShopProducts.tsx`
3. **API Call:** `GET /api/products?category=...&sort=...&page=...`
   - File: `app/api/products/route.ts:4`
4. **Display:** Products rendered in grid with filters

### Cart Management

**State Management:** Recoil
**File:** `lib/atoms/cart.ts` (lines 1-14)

**Cart State:**
```typescript
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const cartState = atom<CartItem[]>({
  key: 'cartState',
  default: []
})
```

**Usage:**
- Add to cart: Updates Recoil state (persists in memory)
- Cart page: `app/cart/page.tsx` uses `CartContent` component
- Checkout: `components/CartContent.tsx:81-150` submits order to `/api/orders`

### Order Creation Flow

1. **Cart Page:** `app/cart/page.tsx`
2. **Form Submission:** `components/CartContent.tsx:81`
3. **API Call:** `POST /api/orders`
   - File: `app/api/orders/route.ts:4`
   - Creates order and orderItems
   - Decreases product stock
4. **Redirect:** To `/order-success` page

### Pet Management Flow

1. **User Dashboard:** `app/user/pets/page.tsx`
2. **Fetch Pets:** `GET /api/pets?userId=...`
   - File: `app/api/pets/route.ts:5`
3. **Create Pet:** `POST /api/pets`
   - File: `app/api/pets/route.ts:43`
4. **Add Medical Records:** `POST /api/pets/[id]/medical`
   - File: `app/api/pets/[id]/medical/route.ts`

### Appointment Booking Flow

1. **User Dashboard:** `app/user/appointments/page.tsx`
2. **Fetch Pets:** Get user's pets for selection
3. **Create Appointment:** `POST /api/appointments`
   - File: `app/api/appointments/route.ts:96`
4. **View Appointments:** `GET /api/appointments?userId=...&status=...`
   - File: `app/api/appointments/route.ts:4`

### Hotel Reservation Flow

1. **Hotel Page:** `app/user/hotel/page.tsx`
2. **Fetch Rooms:** `GET /api/hotel/rooms?type=DOG`
3. **Check Availability:** Done server-side when creating reservation
4. **Create Reservation:** `POST /api/hotel/reservations`
   - File: `app/api/hotel/reservations/route.ts:27`
   - Checks for overlaps
   - Marks room as OCCUPIED
5. **Checkout:** `POST /api/hotel/reservations/[id]/checkout`
   - Calculates total
   - Sets payment method
   - Marks room as AVAILABLE

### Image Upload Flow

1. **Component:** Any component with image upload (e.g., pet profile, product creation)
2. **Upload:** `POST /api/upload` with FormData
   - File: `app/api/upload/route.ts:11`
   - Validates file type and size
   - Uploads to Cloudinary
3. **Response:** Returns Cloudinary URL
4. **Store:** URL stored in database (Product.image, Pet.photo, PetAdoption.images)

---

## State Management

### Recoil (Cart State)

**File:** `lib/atoms/cart.ts` (lines 1-14)

**Purpose:** Manage shopping cart state across the application

**Usage:**
```typescript
import { useRecoilState } from 'recoil';
import { cartState } from '@/lib/atoms/cart';

const [cart, setCart] = useRecoilState(cartState);
```

**Components Using Cart:**
- `components/Header.tsx:14` - Display cart count
- `components/CartContent.tsx:11` - Manage cart items
- `components/ShopProducts.tsx` - Add items to cart
- `components/ProductDetail.tsx` - Add item to cart

### localStorage (User Session)

**Purpose:** Store user authentication data

**Storage:**
- Key: `'user'`
- Value: JSON stringified user object
- Location: Browser localStorage

**Usage:**
```typescript
// Store user after login
localStorage.setItem('user', JSON.stringify(userData));

// Retrieve user
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

// Clear on logout
localStorage.removeItem('user');
```

**Files Using localStorage:**
- `components/Header.tsx:19-27` - Check user login status
- `components/CartContent.tsx:27-45` - Pre-fill checkout form
- `app/admin/dashboard/page.tsx` - Check admin authentication
- `app/user/dashboard/page.tsx` - Check user authentication

### localStorage (Admin Tab Persistence)

**File:** `app/admin/dashboard/page.tsx`

**Purpose:** Persist active tab in admin dashboard

**Storage:**
- Key: `'adminActiveTab'`
- Value: Tab name (e.g., 'products', 'orders', 'analytics')

---

## Security Implementation

### Middleware

**File:** `middleware.ts` (lines 1-46)

**Purpose:** Add security headers and basic CSRF protection

**Security Headers (lines 8-16):**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**CSRF Protection (lines 18-28):**
- Basic origin checking for POST/PUT/DELETE requests
- Validates origin header matches host

### Input Validation

**File:** `lib/security.ts` (lines 1-91)

**Zod Schemas:**
- `loginSchema` (lines 5-8) - Email and password validation
- `signupSchema` (lines 10-18) - Name, email, password, phone validation
- `orderSchema` (lines 20-33) - Order data validation

**Sanitization Functions:**
- `sanitizeInput()` (lines 36-42) - Remove dangerous HTML/scripts
- `containsSQLInjection()` (lines 45-57) - Check for SQL injection patterns
- `validateEmail()` (lines 60-63) - Email format validation
- `checkPasswordStrength()` (lines 66-89) - Password strength checker

### Password Hashing

**Library:** bcrypt
**Rounds:** 12 (high security)

**Usage:**
```typescript
import bcrypt from 'bcryptjs';

// Hash password
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Files:**
- `app/api/auth/signup/route.ts` - Hash on signup
- `app/api/auth/login/route.ts:64` - Verify on login

### Rate Limiting

**File:** `app/api/auth/login/route.ts` (lines 6-24)

**Implementation:** In-memory Map (upgrade to Redis in production)

**Login Rate Limit:**
- 5 attempts per 15 minutes per IP
- Blocks further attempts after limit

**Code:**
```typescript
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  
  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }
  
  if (attempts.count >= 5) {
    return false; // Block after 5 attempts
  }
  
  attempts.count++;
  return true;
}
```

### User Enumeration Prevention

**File:** `app/api/auth/login/route.ts` (lines 55-71)

**Implementation:** Always return same error message for invalid email or password

```typescript
// Always return same error for security (prevent user enumeration)
if (!user) {
  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}

// Check password with timing attack protection
const isValid = await bcrypt.compare(password, user.password);

if (!isValid) {
  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
```

---

## File Structure

```
eaglesVet/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── admin/                # Admin endpoints
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── users/
│   │   ├── adoptions/            # Pet adoption endpoints
│   │   ├── analytics/            # Analytics endpoints
│   │   ├── appointments/        # Appointment endpoints
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── signup/
│   │   ├── categories/           # Category endpoints
│   │   ├── hotel/                # Hotel endpoints
│   │   │   ├── reservations/
│   │   │   └── rooms/
│   │   ├── orders/               # Order endpoints
│   │   ├── pets/                 # Pet endpoints
│   │   ├── products/             # Product endpoints
│   │   ├── upload/               # Image upload endpoint
│   │   └── users/                # User endpoints
│   ├── admin/                    # Admin pages
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── hotel/                # Hotel management
│   │   ├── login/                # Admin login
│   │   ├── orders/               # Order management
│   │   └── products/             # Product management
│   ├── cart/                     # Shopping cart page
│   ├── clinic/                   # Clinic pages
│   ├── shop/                     # Shop pages
│   ├── user/                     # User pages
│   │   ├── appointments/        # User appointments
│   │   ├── dashboard/            # User dashboard
│   │   ├── hotel/                # Hotel reservations
│   │   ├── orders/               # User orders
│   │   ├── pets/                 # Pet management
│   │   └── profile/              # User profile
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── Analytics.tsx
│   ├── CartContent.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductDetail.tsx
│   └── ShopProducts.tsx
├── lib/                          # Utility libraries
│   ├── atoms/                    # Recoil atoms
│   │   └── cart.ts               # Cart state
│   ├── prisma.ts                 # Prisma client
│   ├── security.ts               # Security utilities
│   ├── session.ts                # Session utilities
│   └── utils.ts                  # General utilities
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── middleware.ts                 # Next.js middleware
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

---

## Data Flow Examples

### Example 1: User Places an Order

1. **User adds products to cart**
   - Component: `components/ShopProducts.tsx`
   - Action: Updates Recoil `cartState`
   - Storage: In-memory (Recoil)

2. **User goes to cart page**
   - Page: `app/cart/page.tsx`
   - Component: `components/CartContent.tsx`
   - Reads: Recoil `cartState`

3. **User fills checkout form**
   - Component: `components/CartContent.tsx:18-24`
   - Pre-fills: From `localStorage.getItem('user')` if logged in (lines 27-45)

4. **User submits order**
   - Component: `components/CartContent.tsx:81`
   - API Call: `POST /api/orders`
   - File: `app/api/orders/route.ts:4`

5. **Backend processes order**
   - Line 24: Creates order with nested orderItems
   - Lines 55-64: Decreases product stock for each item
   - Returns: Created order object

6. **Frontend receives response**
   - Component: `components/CartContent.tsx:100-150`
   - Clears: Recoil cart state
   - Redirects: To `/order-success` page

### Example 2: Admin Creates a Product

1. **Admin navigates to product creation**
   - Page: `app/admin/products/new/page.tsx`

2. **Admin fills product form**
   - Fields: name, description, price, image, stock, category

3. **Admin uploads image**
   - API Call: `POST /api/upload`
   - File: `app/api/upload/route.ts:11`
   - Process:
     - Validates file type and size (lines 33-48)
     - Converts to Buffer (lines 51-52)
     - Uploads to Cloudinary (lines 55-72)
   - Returns: Cloudinary URL

4. **Admin submits product**
   - API Call: `POST /api/admin/products`
   - File: `app/api/admin/products/route.ts:23`
   - Process:
     - Generates slug from name (lines 27-32)
     - Creates product in database (lines 34-47)
   - Returns: Created product

5. **Product appears in admin dashboard**
   - Page: `app/admin/dashboard/page.tsx`
   - Fetches: `GET /api/admin/products`
   - Displays: Product in products list

### Example 3: User Books an Appointment

1. **User navigates to appointments page**
   - Page: `app/user/appointments/page.tsx`

2. **User selects pet**
   - Fetches: `GET /api/pets?userId=...`
   - File: `app/api/pets/route.ts:5`
   - Returns: User's pets list

3. **User fills appointment form**
   - Fields: pet, date, time, reason, notes

4. **User submits appointment**
   - API Call: `POST /api/appointments`
   - File: `app/api/appointments/route.ts:96`
   - Process:
     - Validates required fields (lines 111-116)
     - Creates appointment (lines 118-143)
   - Returns: Created appointment

5. **Appointment appears in user's appointments list**
   - Fetches: `GET /api/appointments?userId=...&status=upcoming`
   - Displays: Appointment card with status

### Example 4: User Books Hotel Room

1. **User navigates to hotel page**
   - Page: `app/user/hotel/page.tsx`

2. **User selects room type**
   - Fetches: `GET /api/hotel/rooms?type=DOG`
   - Returns: Available rooms of selected type

3. **User selects dates and services**
   - Fields: check-in, check-out, pickup, dropoff, extra services

4. **User submits reservation**
   - API Call: `POST /api/hotel/reservations`
   - File: `app/api/hotel/reservations/route.ts:27`
   - Process:
     - Validates dates (lines 39-43)
     - Checks room availability (overlap detection) (lines 46-57)
     - Resolves or creates user if needed (lines 60-81)
     - Creates reservation (lines 83-100)
     - Marks room as OCCUPIED (line 103)
   - Returns: Created reservation

5. **Reservation appears in user's reservations**
   - Fetches: `GET /api/hotel/reservations?status=booked`
   - Displays: Reservation card with details

### Example 5: Admin Completes Appointment

1. **Admin views appointments**
   - Page: `app/admin/dashboard/page.tsx`
   - Tab: Appointments
   - Fetches: `GET /api/appointments?status=upcoming`

2. **Admin clicks on appointment**
   - Opens: Appointment details modal

3. **Admin completes appointment**
   - API Call: `PUT /api/appointments/[id]`
   - File: `app/api/appointments/[id]/route.ts`
   - Process:
     - Updates status to 'completed'
     - Sets completionPrice
     - Sets completionPaymentMethod
   - Returns: Updated appointment

4. **Appointment status updates**
   - Status changes from 'upcoming' to 'completed'
   - Color coding updates (green for completed)

---

## Key Implementation Details

### Prisma Client Singleton

**File:** `lib/prisma.ts` (lines 1-13)

**Purpose:** Prevent multiple Prisma client instances in development

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Error Handling Pattern

All API routes follow this pattern:

```typescript
export async function GET(request: NextRequest) {
  try {
    // ... database operations ...
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error message' },
      { status: 500 }
    );
  }
}
```

### Pagination Pattern

Most list endpoints support pagination:

```typescript
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '50');
const skip = (page - 1) * limit;

const [items, total] = await Promise.all([
  prisma.model.findMany({
    where: { ... },
    take: limit,
    skip,
    orderBy: { createdAt: 'desc' }
  }),
  prisma.model.count({ where: { ... } })
]);

return NextResponse.json({
  items,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  }
});
```

### Image Upload Pattern

1. Frontend creates FormData
2. Sends to `/api/upload`
3. Backend validates and uploads to Cloudinary
4. Returns URL
5. Frontend stores URL in database via product/pet creation

---

## Environment Variables

Required environment variables (`.env` file):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/eaglesvet"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## Database Connection

**File:** `lib/prisma.ts`

**Connection:** Prisma connects to PostgreSQL using `DATABASE_URL` from environment variables.

**Usage:** Import `prisma` in API routes:
```typescript
import { prisma } from '@/lib/prisma';
```

**Query Example:**
```typescript
const users = await prisma.user.findMany({
  where: { role: 'user' },
  include: { pets: true }
});
```

---

## Summary

This documentation covers:

1. **System Architecture** - Next.js 14 App Router with API routes
2. **Database Schema** - 16 tables with relationships
3. **API Endpoints** - 40+ endpoints with file locations and line numbers
4. **Frontend-Backend Connection** - Fetch API patterns and state management
5. **Security** - Authentication, validation, rate limiting, password hashing
6. **Data Flow** - 5 complete examples from user action to database

All file paths and line numbers are referenced for easy navigation and understanding of the codebase.

