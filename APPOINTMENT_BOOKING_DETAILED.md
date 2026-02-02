# Appointment Booking System - Detailed Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Complete Booking Flow - Step by Step](#complete-booking-flow---step-by-step)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend API Implementation](#backend-api-implementation)
6. [Database Operations](#database-operations)
7. [Error Handling](#error-handling)
8. [Data Flow Diagram](#data-flow-diagram)

---

## Overview

The appointment booking system allows users to schedule veterinary appointments for their pets. The system supports both authenticated users (with user accounts) and guest bookings. Appointments can be linked to existing pet profiles or created with just a pet name.

**Key Components:**
- **Frontend:** `app/user/appointments/page.tsx` - User appointment booking interface
- **Backend API:** `app/api/appointments/route.ts` - Appointment creation and retrieval
- **Database Model:** `Appointment` table in PostgreSQL (via Prisma)
- **Database Client:** `lib/prisma.ts` - Prisma client singleton

---

## Database Schema

### Appointment Table Structure

**Location:** `prisma/schema.prisma` (lines 185-209)

```prisma
model Appointment {
  id                     String   @id @default(cuid())
  userId                 String?              // Optional: Links to User table if logged in
  ownerName              String?              // Optional: Owner name if no user account
  ownerPhone             String?              // Optional: Owner phone if no user account
  petId                  String?              // Optional: Links to Pet table if pet exists
  petName                String?              // Pet name (required if no petId)
  appointmentDate        DateTime             // Date of appointment (REQUIRED)
  appointmentTime        String               // Time of appointment (REQUIRED)
  reason                 String               // Reason for visit (REQUIRED)
  status                 String   @default("upcoming")  // Status: upcoming, completed, cancelled
  notes                  String?              // Optional notes
  completionPrice        Float?               // Set when appointment is completed
  completionPaymentMethod String?             // Payment method when completed
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
  user                   User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Database Indexes:**
- `userId` - For fast user-specific queries
- `status` - For filtering by status
- `appointmentDate` - For date-based queries
- `createdAt` - For chronological ordering
- Composite indexes for common query patterns

**Relationships:**
- **User Relationship:** Optional foreign key to `User` table (cascade delete if user is deleted)
- **Pet Relationship:** Optional reference to `Pet` table (no foreign key constraint, just ID reference)

---

## Complete Booking Flow - Step by Step

### Phase 1: Page Load and Initialization

#### Step 1.1: User Navigates to Appointments Page

**File:** `app/user/appointments/page.tsx`

**User Action:** User clicks on "Appointments" link in the user dashboard

**Code Location:** Line 143-394 (component render)

**What Happens:**
1. React component `UserAppointmentsPage` mounts
2. Component is a client component (`'use client'` directive on line 1)
3. Component sets up initial state (lines 10-25)

#### Step 1.2: Component Initialization and Authentication Check

**File:** `app/user/appointments/page.tsx` (lines 27-38)

**Code:**
```typescript
useEffect(() => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    router.push('/user');
    return;
  }

  const userData = JSON.parse(userStr);
  setUser(userData);
  fetchAppointments(userData.id);
  fetchPets(userData.id);
}, [router]);
```

**What Happens:**
1. **Line 28:** Reads user data from `localStorage.getItem('user')`
   - User data was stored during login
   - Format: JSON string containing user object with `id`, `email`, `name`, `role`, etc.
   
2. **Lines 29-32:** Authentication check
   - If no user data found, redirects to `/user` page
   - This prevents unauthorized access to appointments page
   
3. **Line 34:** Parses user data from JSON string to JavaScript object
   
4. **Line 35:** Sets user state: `setUser(userData)`
   - Updates React state variable `user` (line 10)
   
5. **Line 36:** Calls `fetchAppointments(userData.id)`
   - Fetches existing appointments for the user
   - See Step 1.3 for details
   
6. **Line 37:** Calls `fetchPets(userData.id)`
   - Fetches user's pets for the appointment form
   - See Step 1.4 for details

**Why This Matters:** This ensures only authenticated users can book appointments and populates the page with user-specific data.

---

#### Step 1.3: Fetch Existing Appointments

**File:** `app/user/appointments/page.tsx` (lines 40-50)

**Function:** `fetchAppointments(userId: string)`

**Code:**
```typescript
const fetchAppointments = async (userId: string) => {
  try {
    const response = await fetch(`/api/appointments?userId=${userId}`);
    const data = await response.json();
    setAppointments(data.appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  } finally {
    setLoading(false);
  }
};
```

**What Happens:**
1. **Line 42:** Makes HTTP GET request to `/api/appointments?userId=${userId}`
   - Uses browser's native `fetch` API
   - Query parameter: `userId` identifies which user's appointments to fetch
   - Example URL: `/api/appointments?userId=cm123abc456def`
   
2. **Line 43:** Converts response to JSON
   - Response body contains `{ appointments: [...], pagination: {...} }`
   
3. **Line 44:** Updates appointments state
   - `setAppointments(data.appointments)` updates React state (line 11)
   - This triggers re-render to display appointments
   
4. **Line 48:** Sets loading to false
   - Hides loading spinner
   - Shows appointments list

**Backend Handling:**
- Request is handled by `app/api/appointments/route.ts` GET handler (lines 4-94)
- See "Backend API - GET Appointments" section for details

---

#### Step 1.4: Fetch User's Pets

**File:** `app/user/appointments/page.tsx` (lines 52-60)

**Function:** `fetchPets(userId: string)`

**Code:**
```typescript
const fetchPets = async (userId: string) => {
  try {
    const response = await fetch(`/api/pets?userId=${userId}`);
    const data = await response.json();
    setPets(data.pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
  }
};
```

**What Happens:**
1. **Line 54:** Makes HTTP GET request to `/api/pets?userId=${userId}`
   - Fetches all pets owned by the user
   - Example URL: `/api/pets?userId=cm123abc456def`
   
2. **Line 55:** Parses JSON response
   - Response format: `{ pets: [...] }`
   
3. **Line 56:** Updates pets state
   - `setPets(data.pets)` updates React state (line 14)
   - Pets are used to populate dropdown in booking form

**Backend Handling:**
- Request handled by `app/api/pets/route.ts` GET handler (lines 5-41)
- **Database Query (lines 13-34):**
  ```typescript
  const pets = await prisma.pet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      vaccinations: { orderBy: { date: 'desc' }, take: 5 },
      dewormings: { orderBy: { date: 'desc' }, take: 5 },
      clinicVisits: { orderBy: { visitDate: 'desc' }, take: 5 },
      weightHistory: { orderBy: { date: 'desc' }, take: 5 }
    }
  });
  ```
- **Prisma Function:** `prisma.pet.findMany()`
  - **Purpose:** Retrieves multiple Pet records
  - **Where Clause:** `{ userId }` filters pets by user ID
  - **Order By:** `{ createdAt: 'desc' }` sorts by newest first
  - **Include:** Fetches related medical records (vaccinations, dewormings, etc.)
- **Returns:** Array of Pet objects with nested medical records

**Database Connection:**
- Prisma client: `lib/prisma.ts` (singleton instance)
- Database: PostgreSQL (connection via `DATABASE_URL` environment variable)
- SQL Generated: Prisma generates optimized SQL query

---

### Phase 2: User Initiates Booking

#### Step 2.1: User Clicks "Book Appointment" Button

**File:** `app/user/appointments/page.tsx` (lines 158-163)

**UI Element:**
```typescript
<button
  onClick={() => setShowAddModal(true)}
  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
>
  Book Appointment
</button>
```

**What Happens:**
1. User clicks the button
2. **`onClick` handler executes:** `setShowAddModal(true)`
   - Updates React state (line 13)
   - Changes `showAddModal` from `false` to `true`
3. **React re-renders** with modal visible
4. Booking modal appears (lines 258-390)

---

#### Step 2.2: Booking Modal Opens

**File:** `app/user/appointments/page.tsx` (lines 258-390)

**Code:**
```typescript
{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book New Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
        </form>
      </div>
    </div>
  </div>
)}
```

**What Happens:**
1. **Conditional Rendering:** Modal only renders when `showAddModal === true`
2. **Modal Structure:**
   - Overlay: Dark semi-transparent background (blocks interaction with page)
   - Modal Container: White rounded box centered on screen
   - Form: Contains all input fields for booking

**Form State:**
- Managed by `formData` state object (lines 18-25):
  ```typescript
  const [formData, setFormData] = useState({
    petId: '',              // Selected pet ID (optional)
    petName: '',            // Pet name if no pet selected (optional)
    appointmentDate: '',    // Date in YYYY-MM-DD format (REQUIRED)
    appointmentTime: '',    // Time in HH:MM format (REQUIRED)
    reason: '',             // Reason for visit (REQUIRED)
    notes: '',              // Additional notes (optional)
  });
  ```

---

#### Step 2.3: User Fills Booking Form

**File:** `app/user/appointments/page.tsx` (lines 264-368)

**Form Fields:**

**1. Pet Selection (Lines 266-283)**
```typescript
<select
  value={formData.petId}
  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
>
  <option value="">Select a pet</option>
  {pets.map((pet) => (
    <option key={pet.id} value={pet.id}>
      {pet.name} ({pet.species})
    </option>
  ))}
</select>
```

**What Happens:**
- User selects a pet from dropdown
- **`onChange` handler:** Updates `formData.petId` state
- If pet selected: Pet ID stored in state
- If no pet selected: User can enter pet name manually

**2. Pet Name Input (Lines 286-299)**
- Only shows if `!formData.petId` (no pet selected)
- User can manually enter pet name
- Updates `formData.petName` state

**3. Appointment Date (Lines 301-314)**
```typescript
<input
  type="date"
  required
  value={formData.appointmentDate}
  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
  min={new Date().toISOString().split('T')[0]}
  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
/>
```

**What Happens:**
- HTML5 date picker
- **`min` attribute:** Prevents selecting past dates
- **`required` attribute:** Browser validation requires field
- Updates `formData.appointmentDate` (format: `YYYY-MM-DD`)

**4. Appointment Time (Lines 316-339)**
```typescript
<select
  required
  value={formData.appointmentTime}
  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
>
  <option value="">Select Time</option>
  <option value="08:00">8:00 AM</option>
  <option value="09:00">9:00 AM</option>
  {/* ... more time options ... */}
  <option value="17:00">5:00 PM</option>
</select>
```

**What Happens:**
- Dropdown with predefined time slots
- Time format: `HH:MM` (24-hour format)
- Available times: 8:00 AM to 5:00 PM (hourly intervals)
- Updates `formData.appointmentTime`

**5. Reason for Visit (Lines 341-354)**
```typescript
<textarea
  required
  value={formData.reason}
  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
  rows={3}
  placeholder="e.g., Annual checkup, vaccination, emergency, grooming, etc."
  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
/>
```

**What Happens:**
- Multi-line text input
- **`required` attribute:** Must be filled
- Updates `formData.reason`

**6. Additional Notes (Lines 356-368)**
- Optional textarea
- Updates `formData.notes`

---

### Phase 3: Form Submission

#### Step 3.1: User Submits Form

**File:** `app/user/appointments/page.tsx` (lines 371-386)

**User Action:** User clicks "Book Appointment" button (type="submit")

**What Happens:**
1. Form's `onSubmit` event fires
2. **Form handler:** `handleSubmit` function called (line 264: `onSubmit={handleSubmit}`)

---

#### Step 3.2: Form Validation and Data Preparation

**File:** `app/user/appointments/page.tsx` (lines 62-103)

**Function:** `handleSubmit(e: React.FormEvent)`

**Code:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();  // Prevent default form submission

  const pet = pets.find((p) => p.id === formData.petId);
  const appointmentData = {
    userId: user.id,
    petId: formData.petId || null,
    petName: pet ? pet.name : formData.petName,
    appointmentDate: formData.appointmentDate,
    appointmentTime: formData.appointmentTime,
    reason: formData.reason,
    notes: formData.notes || null,
  };

  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });

    if (response.ok) {
      // Reset form and close modal
      setFormData({
        petId: '',
        petName: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: '',
      });
      setShowAddModal(false);
      fetchAppointments(user.id);
      alert('Appointment booked successfully!');
    } else {
      alert('Failed to book appointment');
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    alert('An error occurred. Please try again.');
  }
};
```

**Step-by-Step Breakdown:**

**Line 63:** `e.preventDefault()`
- Prevents browser's default form submission behavior
- Stops page refresh
- Allows custom async handling

**Lines 65-74:** Data Preparation
- **Line 65:** Finds selected pet object from pets array
  - Uses JavaScript `Array.find()` method
  - Searches `pets` array for pet with matching ID
  
- **Lines 66-74:** Creates `appointmentData` object
  - **`userId`:** Current user's ID (from `user` state)
  - **`petId`:** Selected pet ID or `null` if no pet selected
  - **`petName`:** 
    - If pet selected: Uses pet's name from `pet.name`
    - If no pet selected: Uses `formData.petName` (user-entered)
  - **`appointmentDate`:** Date string from form
  - **`appointmentTime`:** Time string from form
  - **`reason`:** Reason text from form
  - **`notes`:** Notes text or `null` if empty

**Example appointmentData:**
```json
{
  "userId": "cm123abc456def",
  "petId": "cm789xyz012abc",
  "petName": "Fluffy",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "10:00",
  "reason": "Annual checkup and vaccination",
  "notes": "Please bring previous vaccination records"
}
```

---

#### Step 3.3: HTTP Request to Backend

**File:** `app/user/appointments/page.tsx` (lines 76-81)

**Code:**
```typescript
const response = await fetch('/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(appointmentData),
});
```

**What Happens:**
1. **`fetch()` API Call:**
   - URL: `/api/appointments` (relative URL, resolves to current domain)
   - Method: `POST` (creates new resource)
   - Headers: `Content-Type: application/json` (tells server we're sending JSON)
   - Body: `JSON.stringify(appointmentData)` converts JavaScript object to JSON string

2. **Network Request:**
   - Browser sends HTTP POST request to server
   - Request body contains JSON string
   - Request goes to Next.js API route handler

3. **`await` Keyword:**
   - Pauses function execution until response received
   - Makes function async (handled by try-catch)

**Request Example:**
```
POST /api/appointments HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "userId": "cm123abc456def",
  "petId": "cm789xyz012abc",
  "petName": "Fluffy",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "10:00",
  "reason": "Annual checkup and vaccination",
  "notes": "Please bring previous vaccination records"
}
```

---

### Phase 4: Backend Processing

#### Step 4.1: Request Reaches API Route

**File:** `app/api/appointments/route.ts` (lines 96-153)

**Next.js Routing:**
- File path: `app/api/appointments/route.ts`
- URL pattern: `/api/appointments`
- HTTP Method: `POST`
- Handler Function: `export async function POST(request: NextRequest)`

**What Happens:**
1. Next.js receives HTTP POST request at `/api/appointments`
2. Next.js routes request to `app/api/appointments/route.ts`
3. Calls `POST` function with `request` object

---

#### Step 4.2: Parse Request Body

**File:** `app/api/appointments/route.ts` (lines 98-109)

**Code:**
```typescript
const body = await request.json();
const {
  userId,
  ownerName,
  ownerPhone,
  petId,
  petName,
  appointmentDate,
  appointmentTime,
  reason,
  notes,
} = body;
```

**What Happens:**
1. **`request.json()`:** Parses JSON request body
   - Converts JSON string to JavaScript object
   - `await` waits for parsing to complete
   
2. **Destructuring:** Extracts individual fields from body object
   - Each variable now contains the value from request
   - Example: `userId = "cm123abc456def"`, `petName = "Fluffy"`, etc.

---

#### Step 4.3: Input Validation

**File:** `app/api/appointments/route.ts` (lines 111-116)

**Code:**
```typescript
if ((!userId && !ownerName) || !appointmentDate || !appointmentTime || !reason) {
  return NextResponse.json(
    { error: 'Either userId or ownerName, appointment date, appointment time, and reason are required' },
    { status: 400 }
  );
}
```

**What Happens:**
1. **Validation Check:**
   - Checks if `userId` OR `ownerName` exists (at least one required)
   - Checks if `appointmentDate` exists (required)
   - Checks if `appointmentTime` exists (required)
   - Checks if `reason` exists (required)

2. **If Validation Fails:**
   - Returns HTTP 400 (Bad Request) error
   - Error message in response body
   - Function exits early (doesn't create appointment)

3. **If Validation Passes:**
   - Continues to database operation

**Why This Matters:** Prevents invalid data from being stored in database. Server-side validation is crucial (client-side validation can be bypassed).

---

#### Step 4.4: Database Operation - Create Appointment

**File:** `app/api/appointments/route.ts` (lines 118-143)

**Code:**
```typescript
const appointment = await prisma.appointment.create({
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
    status: 'upcoming',
  },
  ...(userId && {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  }),
});
```

**Detailed Breakdown:**

**Line 118:** `prisma.appointment.create()`
- **Prisma Function:** `create()` - Creates a new record in the database
- **Model:** `appointment` (maps to `Appointment` table)
- **Prisma Client:** `prisma` imported from `lib/prisma.ts`

**Data Object (lines 119-130):**
- **`userId`:** `userId || null`
  - Uses userId if provided, otherwise `null`
  - Links appointment to user account (optional)
  
- **`ownerName`:** `ownerName || null`
  - Name of owner if no user account
  - Usually `null` for logged-in users
  
- **`ownerPhone`:** `ownerPhone || null`
  - Phone number if no user account
  
- **`petId`:** `petId || null`
  - ID of pet if pet profile exists
  - Links to Pet table (optional reference)
  
- **`petName`:** `petName || null`
  - Pet name (required if no petId)
  - Stored as string
  
- **`appointmentDate`:** `new Date(appointmentDate)`
  - Converts date string to JavaScript Date object
  - Prisma converts to PostgreSQL `TIMESTAMP` type
  - Example: `"2024-02-15"` → `Date(2024-02-15T00:00:00.000Z)`
  
- **`appointmentTime`:** Time string as-is
  - Format: `"HH:MM"` (e.g., `"10:00"`)
  - Stored as `VARCHAR` in database
  
- **`reason`:** Reason string (required)
  - Stored as `TEXT` in database
  
- **`notes`:** `notes || null`
  - Optional notes field
  - `null` if empty string
  
- **`status`:** `'upcoming'` (default value)
  - Initial status for new appointments
  - Other statuses: `'completed'`, `'cancelled'`, `'no-show'`

**Include Clause (lines 131-142):**
- **Conditional Include:** Only includes user data if `userId` exists
- **Purpose:** Fetches related user information in the same query
- **Select:** Only selects specific user fields (id, name, email, phone)
- **Why:** Reduces data transfer (doesn't fetch password, etc.)

**Database Query Generated:**
Prisma generates SQL like this:
```sql
INSERT INTO "Appointment" (
  "id", 
  "userId", 
  "petId", 
  "petName", 
  "appointmentDate", 
  "appointmentTime", 
  "reason", 
  "notes", 
  "status", 
  "createdAt", 
  "updatedAt"
) VALUES (
  'cm987newid456',           -- Auto-generated CUID
  'cm123abc456def',          -- userId
  'cm789xyz012abc',          -- petId
  'Fluffy',                  -- petName
  '2024-02-15T00:00:00.000Z', -- appointmentDate
  '10:00',                   -- appointmentTime
  'Annual checkup and vaccination', -- reason
  'Please bring previous vaccination records', -- notes
  'upcoming',                -- status
  NOW(),                     -- createdAt (auto)
  NOW()                      -- updatedAt (auto)
) RETURNING *;
```

**Then (if userId exists):**
```sql
SELECT 
  "Appointment".*,
  "User"."id", "User"."name", "User"."email", "User"."phone"
FROM "Appointment"
LEFT JOIN "User" ON "Appointment"."userId" = "User"."id"
WHERE "Appointment"."id" = 'cm987newid456';
```

**What Happens in Database:**
1. **INSERT Statement:** Creates new row in `Appointment` table
2. **Auto-Generated Fields:**
   - `id`: CUID (Collision-resistant Unique Identifier) generated by Prisma
   - `createdAt`: Current timestamp (from `@default(now())` in schema)
   - `updatedAt`: Current timestamp (from `@default(now())` in schema)
3. **Foreign Key Check:** If `userId` provided, database verifies user exists
4. **RETURNING:** PostgreSQL returns the created row
5. **Join Query:** If include clause present, fetches related user data

**Database Connection:**
- **Prisma Client:** Singleton instance from `lib/prisma.ts`
- **Connection Pool:** Prisma manages connection pool to PostgreSQL
- **Transaction:** Single transaction (INSERT + SELECT if include present)

**Result:**
- `appointment` variable contains the created appointment object
- Includes all fields plus related user data (if userId provided)

---

#### Step 4.5: Return Response to Frontend

**File:** `app/api/appointments/route.ts` (line 145)

**Code:**
```typescript
return NextResponse.json({ appointment }, { status: 201 });
```

**What Happens:**
1. **`NextResponse.json()`:** Creates JSON HTTP response
   - First parameter: Response body (`{ appointment: {...} }`)
   - Second parameter: Options (`{ status: 201 }`)
   
2. **HTTP Status 201:** "Created" - indicates successful resource creation
   - Standard status code for POST requests that create resources

3. **Response Body:**
   ```json
   {
     "appointment": {
       "id": "cm987newid456",
       "userId": "cm123abc456def",
       "petId": "cm789xyz012abc",
       "petName": "Fluffy",
       "appointmentDate": "2024-02-15T00:00:00.000Z",
       "appointmentTime": "10:00",
       "reason": "Annual checkup and vaccination",
       "notes": "Please bring previous vaccination records",
       "status": "upcoming",
       "createdAt": "2024-01-20T10:30:00.000Z",
       "updatedAt": "2024-01-20T10:30:00.000Z",
       "user": {
         "id": "cm123abc456def",
         "name": "John Doe",
         "email": "john@example.com",
         "phone": "0791234567"
       }
     }
   }
   ```

4. **Network Response:** Sent back to browser

---

### Phase 5: Frontend Receives Response

#### Step 5.1: Response Handling

**File:** `app/user/appointments/page.tsx` (lines 83-102)

**Code:**
```typescript
if (response.ok) {
  // Reset form and close modal
  setFormData({
    petId: '',
    petName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
  });
  setShowAddModal(false);
  fetchAppointments(user.id);
  alert('Appointment booked successfully!');
} else {
  alert('Failed to book appointment');
}
```

**What Happens:**

**Line 83:** `if (response.ok)`
- `response.ok` is `true` if status code is 200-299
- In our case, status is 201, so `response.ok === true`

**Lines 85-92:** Form Reset
- **`setFormData({...})`:** Resets all form fields to empty strings
  - Clears the form for next booking
  - Prevents showing old data if modal reopened
  
- **`setShowAddModal(false)`:** Closes the booking modal
  - Updates state to hide modal
  - React re-renders without modal

**Line 93:** `fetchAppointments(user.id)`
- **Refetches appointments list**
- Makes GET request to `/api/appointments?userId=${user.id}`
- Updates appointments state with new list (includes newly created appointment)
- User sees the new appointment appear in the list

**Line 94:** `alert('Appointment booked successfully!')`
- Shows browser alert to confirm success
- User feedback that booking completed

**If `response.ok === false` (lines 96-98):**
- Shows error alert
- Form remains open (user can retry)
- No data changes

---

#### Step 5.2: Error Handling

**File:** `app/user/appointments/page.tsx` (lines 99-102)

**Code:**
```typescript
} catch (error) {
  console.error('Error booking appointment:', error);
  alert('An error occurred. Please try again.');
}
```

**What Happens:**
- **`catch` block:** Executes if any error occurs in `try` block
- **Network Errors:** Fetch fails (network down, server error, etc.)
- **Parse Errors:** Response not valid JSON
- **Other Errors:** Unexpected errors

**Error Handling:**
1. **`console.error()`:** Logs error to browser console (for debugging)
2. **`alert()`:** Shows user-friendly error message
3. **Form State:** Remains unchanged (user can retry)

---

### Phase 6: Appointments List Update

#### Step 6.1: Refetch Appointments

**File:** `app/user/appointments/page.tsx` (line 93)

When `fetchAppointments(user.id)` is called after successful booking:

**Backend Request:**
- **URL:** `GET /api/appointments?userId=cm123abc456def`
- **Handler:** `app/api/appointments/route.ts` GET function (lines 4-94)

**Backend Processing:**

**Lines 6-14:** Extract Query Parameters
```typescript
const { searchParams } = new URL(request.url);
const userId = searchParams.get('userId');
const status = searchParams.get('status');
const startDate = searchParams.get('startDate');
const endDate = searchParams.get('endDate');
const search = searchParams.get('search');
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '50');
const skip = (page - 1) * limit;
```

**Lines 16-47:** Build Where Clause
```typescript
const where: any = {};

if (userId) {
  where.userId = userId;  // Filter by user ID
}

if (status && status !== 'all') {
  where.status = status;
}

// Date filtering
if (startDate || endDate) {
  where.appointmentDate = {};
  if (startDate) {
    where.appointmentDate.gte = new Date(startDate);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    where.appointmentDate.lte = end;
  }
}
```

**Lines 49-70:** Database Query
```typescript
const [appointments, total] = await Promise.all([
  prisma.appointment.findMany({
    where,
    take: limit,
    skip,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: [
      { appointmentDate: 'desc' },
      { appointmentTime: 'desc' },
    ],
  }),
  prisma.appointment.count({ where }),
]);
```

**Database Operations:**

**1. `prisma.appointment.findMany()`:**
- **Prisma Function:** `findMany()` - Retrieves multiple records
- **Where Clause:** `{ userId: "cm123abc456def" }` - Filters by user ID
- **Take:** `limit` (50) - Maximum records to return
- **Skip:** `skip` (0 for page 1) - Records to skip (pagination)
- **Include:** Fetches related user data
- **Order By:** Sorts by date (newest first), then time (latest first)

**SQL Generated:**
```sql
SELECT 
  "Appointment".*,
  "User"."id" as "user_id",
  "User"."name" as "user_name",
  "User"."email" as "user_email",
  "User"."phone" as "user_phone"
FROM "Appointment"
LEFT JOIN "User" ON "Appointment"."userId" = "User"."id"
WHERE "Appointment"."userId" = 'cm123abc456def'
ORDER BY "Appointment"."appointmentDate" DESC, "Appointment"."appointmentTime" DESC
LIMIT 50 OFFSET 0;
```

**2. `prisma.appointment.count()`:**
- **Prisma Function:** `count()` - Counts matching records
- **Purpose:** Total count for pagination
- **Where Clause:** Same as findMany

**SQL Generated:**
```sql
SELECT COUNT(*) as "count"
FROM "Appointment"
WHERE "Appointment"."userId" = 'cm123abc456def';
```

**3. `Promise.all()`:**
- **Purpose:** Executes both queries in parallel (not sequentially)
- **Performance:** Faster than running queries one after another

**Lines 72-76:** Transform Data
```typescript
const appointmentsWithOwnerName = appointments.map(appointment => ({
  ...appointment,
  ownerName: appointment.ownerName || appointment.user?.name || 'Unknown',
}));
```

**What Happens:**
- Maps over appointments array
- Adds `ownerName` field (for consistency)
- Uses `ownerName` if exists, otherwise uses `user.name`, otherwise 'Unknown'

**Lines 78-86:** Return Response
```typescript
return NextResponse.json({ 
  appointments: appointmentsWithOwnerName,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  }
});
```

**Response Format:**
```json
{
  "appointments": [
    {
      "id": "cm987newid456",
      "userId": "cm123abc456def",
      "petName": "Fluffy",
      "appointmentDate": "2024-02-15T00:00:00.000Z",
      "appointmentTime": "10:00",
      "reason": "Annual checkup and vaccination",
      "status": "upcoming",
      "ownerName": "John Doe",
      "user": {
        "id": "cm123abc456def",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "0791234567"
      }
    },
    // ... more appointments
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "pages": 1
  }
}
```

---

#### Step 6.2: Update UI

**File:** `app/user/appointments/page.tsx` (line 44)

**Code:**
```typescript
setAppointments(data.appointments);
```

**What Happens:**
1. **State Update:** `setAppointments()` updates React state
2. **React Re-render:** Component re-renders with new appointments list
3. **UI Updates:** Appointments list displays with new appointment included

**Lines 132-133:** Filter Appointments
```typescript
const upcomingAppointments = appointments.filter((apt) => apt.status === 'upcoming');
const pastAppointments = appointments.filter((apt) => apt.status !== 'upcoming');
```

**What Happens:**
- Splits appointments into two groups:
  - **Upcoming:** Status is 'upcoming' (displayed first)
  - **Past:** Status is 'completed', 'cancelled', or 'no-show' (displayed below)

**Lines 186-211:** Render Upcoming Appointments
```typescript
{upcomingAppointments.map((appointment) => (
  <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {appointment.petName || 'General Visit'}
        </h3>
        <p className="text-sm text-gray-600">
          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} at {appointment.appointmentTime}
        </p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
        {appointment.status}
      </span>
    </div>
    <div className="space-y-2 text-sm">
      <p><span className="font-semibold">Reason:</span> {appointment.reason}</p>
      {appointment.notes && (
        <p><span className="font-semibold">Notes:</span> {appointment.notes}</p>
      )}
    </div>
  </div>
))}
```

**What Happens:**
- Maps over upcoming appointments array
- Renders appointment card for each appointment
- Displays: pet name, date/time, status badge, reason, notes
- New appointment appears in the list immediately

---

## Frontend Implementation

### Component Structure

**File:** `app/user/appointments/page.tsx`

**Component Type:** Client Component (`'use client'` directive)

**State Variables:**
```typescript
const [user, setUser] = useState<any>(null);              // Current user data
const [appointments, setAppointments] = useState<any[]>([]); // Appointments list
const [loading, setLoading] = useState(true);             // Loading state
const [showAddModal, setShowAddModal] = useState(false);  // Modal visibility
const [pets, setPets] = useState<any[]>([]);              // User's pets
const [formData, setFormData] = useState({...});          // Form state
```

**Key Functions:**
- `fetchAppointments(userId)` - Fetches appointments from API
- `fetchPets(userId)` - Fetches pets from API
- `handleSubmit(e)` - Handles form submission
- `handleCancel()` - Closes modal and resets form
- `getStatusColor(status)` - Returns CSS classes for status badge

---

## Backend API Implementation

### POST /api/appointments - Create Appointment

**File:** `app/api/appointments/route.ts` (lines 96-153)

**Function Signature:**
```typescript
export async function POST(request: NextRequest)
```

**Parameters:**
- `request: NextRequest` - Next.js request object containing headers, body, etc.

**Process:**
1. Parse request body (JSON)
2. Extract fields from body
3. Validate required fields
4. Create appointment in database
5. Return created appointment

**Database Function Used:**
- `prisma.appointment.create()` - Prisma ORM function

**Return:**
- HTTP 201 (Created) with appointment object
- HTTP 400 (Bad Request) if validation fails
- HTTP 500 (Internal Server Error) if database error

---

### GET /api/appointments - Fetch Appointments

**File:** `app/api/appointments/route.ts` (lines 4-94)

**Function Signature:**
```typescript
export async function GET(request: NextRequest)
```

**Query Parameters:**
- `userId` - Filter by user ID
- `status` - Filter by status (upcoming, completed, cancelled)
- `startDate` - Filter from date
- `endDate` - Filter to date
- `search` - Search by pet name, owner name, or phone
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Database Functions Used:**
- `prisma.appointment.findMany()` - Fetch multiple appointments
- `prisma.appointment.count()` - Count matching appointments

**Return:**
- HTTP 200 with appointments array and pagination info
- HTTP 500 if database error

---

## Database Operations

### Prisma Client

**File:** `lib/prisma.ts` (lines 1-13)

**Purpose:** Singleton Prisma client instance

**Code:**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Why Singleton:**
- Prevents multiple Prisma client instances in development
- Reuses connection pool for better performance
- Required for Next.js hot reload

**Connection:**
- Uses `DATABASE_URL` environment variable
- Connects to PostgreSQL database
- Manages connection pool automatically

---

### Database Functions Used

#### 1. `prisma.appointment.create()`

**Purpose:** Insert new appointment record

**Location:** `app/api/appointments/route.ts:118`

**Syntax:**
```typescript
await prisma.appointment.create({
  data: {
    // Appointment fields
  },
  include: {
    // Related data to fetch
  }
})
```

**What It Does:**
- Generates SQL INSERT statement
- Creates new row in `Appointment` table
- Returns created record
- Can include related data (user) in same query

**Generated SQL:**
```sql
INSERT INTO "Appointment" (...) VALUES (...) RETURNING *;
```

---

#### 2. `prisma.appointment.findMany()`

**Purpose:** Fetch multiple appointment records

**Location:** `app/api/appointments/route.ts:50`

**Syntax:**
```typescript
await prisma.appointment.findMany({
  where: {
    // Filter conditions
  },
  take: limit,        // Maximum records
  skip: skip,         // Records to skip (pagination)
  include: {
    // Related data
  },
  orderBy: [
    // Sort order
  ]
})
```

**What It Does:**
- Generates SQL SELECT statement
- Filters by where clause
- Applies pagination (LIMIT/OFFSET)
- Joins related tables if include specified
- Sorts by orderBy clause
- Returns array of appointment objects

**Generated SQL:**
```sql
SELECT ... FROM "Appointment" 
LEFT JOIN "User" ON ... 
WHERE ... 
ORDER BY ... 
LIMIT ... OFFSET ...;
```

---

#### 3. `prisma.appointment.count()`

**Purpose:** Count matching appointment records

**Location:** `app/api/appointments/route.ts:69`

**Syntax:**
```typescript
await prisma.appointment.count({
  where: {
    // Filter conditions (same as findMany)
  }
})
```

**What It Does:**
- Generates SQL COUNT statement
- Counts rows matching where clause
- Returns number (integer)

**Generated SQL:**
```sql
SELECT COUNT(*) FROM "Appointment" WHERE ...;
```

---

### Database Schema - Appointment Table

**Location:** `prisma/schema.prisma` (lines 185-209)

**Table Name:** `Appointment` (PostgreSQL: `"Appointment"`)

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | String (CUID) | No | Auto-generated | Primary key |
| userId | String | Yes | null | Foreign key to User |
| ownerName | String | Yes | null | Owner name (guest bookings) |
| ownerPhone | String | Yes | null | Owner phone (guest bookings) |
| petId | String | Yes | null | Pet ID reference |
| petName | String | Yes | null | Pet name |
| appointmentDate | DateTime | No | - | Appointment date |
| appointmentTime | String | No | - | Appointment time (HH:MM) |
| reason | String | No | - | Reason for visit |
| status | String | No | 'upcoming' | Appointment status |
| notes | String | Yes | null | Additional notes |
| completionPrice | Float | Yes | null | Price when completed |
| completionPaymentMethod | String | Yes | null | Payment method |
| createdAt | DateTime | No | now() | Record creation time |
| updatedAt | DateTime | No | Auto-updated | Last update time |

**Indexes:**
- Primary key on `id`
- Index on `userId` (for fast user queries)
- Index on `status` (for filtering)
- Index on `appointmentDate` (for date queries)
- Index on `createdAt` (for chronological ordering)
- Composite indexes for common query patterns

**Foreign Keys:**
- `userId` → `User.id` (CASCADE DELETE)

---

## Error Handling

### Frontend Error Handling

**File:** `app/user/appointments/page.tsx` (lines 99-102)

**Types of Errors:**
1. **Network Errors:** Fetch fails (server down, network issue)
2. **HTTP Errors:** Response status not 200-299
3. **Parse Errors:** Response not valid JSON
4. **Validation Errors:** Server returns 400 with error message

**Handling:**
```typescript
try {
  const response = await fetch('/api/appointments', {...});
  
  if (response.ok) {
    // Success handling
  } else {
    // HTTP error (400, 500, etc.)
    alert('Failed to book appointment');
  }
} catch (error) {
  // Network or other errors
  console.error('Error booking appointment:', error);
  alert('An error occurred. Please try again.');
}
```

---

### Backend Error Handling

**File:** `app/api/appointments/route.ts` (lines 146-152)

**Types of Errors:**
1. **Validation Errors:** Missing required fields (returns 400)
2. **Database Errors:** Connection issues, constraint violations (returns 500)
3. **Parse Errors:** Invalid JSON body (returns 400/500)

**Handling:**
```typescript
try {
  // ... validation and database operations ...
  return NextResponse.json({ appointment }, { status: 201 });
} catch (error) {
  console.error('Error creating appointment:', error);
  return NextResponse.json(
    { error: 'Failed to create appointment' },
    { status: 500 }
  );
}
```

**Common Database Errors:**
- **Foreign Key Violation:** userId doesn't exist → Prisma throws error
- **Constraint Violation:** Invalid data type → Prisma throws error
- **Connection Error:** Database unavailable → Prisma throws error

---

## Data Flow Diagram

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         │ 1. User fills form and clicks "Book Appointment"
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: handleSubmit()           │
│  - Prevents default form submission │
│  - Prepares appointmentData object  │
│  - Calls fetch('/api/appointments') │
└────────┬────────────────────────────┘
         │
         │ 2. HTTP POST /api/appointments
         │    Body: JSON appointmentData
         │
         ▼
┌─────────────────────────────────────┐
│  Next.js API Route Handler          │
│  app/api/appointments/route.ts      │
│  POST function                      │
└────────┬────────────────────────────┘
         │
         │ 3. Parse request body
         │
         ▼
┌─────────────────────────────────────┐
│  Validation                         │
│  - Check required fields            │
│  - Return 400 if invalid            │
└────────┬────────────────────────────┘
         │
         │ 4. Validation passed
         │
         ▼
┌─────────────────────────────────────┐
│  Prisma Client                      │
│  lib/prisma.ts                      │
│  (Singleton instance)               │
└────────┬────────────────────────────┘
         │
         │ 5. prisma.appointment.create()
         │
         ▼
┌─────────────────────────────────────┐
│  PostgreSQL Database                │
│  - INSERT INTO Appointment          │
│  - Generate CUID for id             │
│  - Set createdAt, updatedAt         │
│  - Return created record            │
└────────┬────────────────────────────┘
         │
         │ 6. Appointment record created
         │
         ▼
┌─────────────────────────────────────┐
│  API Response                       │
│  - Status: 201 Created              │
│  - Body: { appointment: {...} }     │
└────────┬────────────────────────────┘
         │
         │ 7. HTTP Response
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: handleSubmit()           │
│  - Receives response                │
│  - Checks response.ok               │
│  - Resets form                      │
│  - Closes modal                     │
│  - Calls fetchAppointments()        │
└────────┬────────────────────────────┘
         │
         │ 8. HTTP GET /api/appointments?userId=...
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: GET handler               │
│  - prisma.appointment.findMany()    │
│  - Filters by userId                │
│  - Returns appointments list        │
└────────┬────────────────────────────┘
         │
         │ 9. Updated appointments list
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend: setAppointments()        │
│  - Updates React state              │
│  - Triggers re-render               │
│  - Displays new appointment         │
└─────────────────────────────────────┘
```

---

## Summary

The appointment booking system follows this complete flow:

1. **User Authentication:** Checks localStorage for user session
2. **Data Loading:** Fetches existing appointments and pets
3. **Form Interaction:** User fills booking form
4. **Form Submission:** Frontend validates and sends POST request
5. **Backend Validation:** Server validates required fields
6. **Database Insert:** Prisma creates new Appointment record
7. **Response:** Backend returns created appointment
8. **UI Update:** Frontend refreshes appointments list
9. **Display:** New appointment appears in user's appointments

**Key Technologies:**
- **Frontend:** React, Next.js Client Components, Fetch API
- **Backend:** Next.js API Routes, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **State Management:** React useState hooks
- **Session:** localStorage (user authentication)

**Database Operations:**
- **Create:** `prisma.appointment.create()` - Inserts new record
- **Read:** `prisma.appointment.findMany()` - Fetches records with filters
- **Count:** `prisma.appointment.count()` - Counts matching records

All database operations go through Prisma ORM, which generates optimized SQL queries and handles connection pooling automatically.



