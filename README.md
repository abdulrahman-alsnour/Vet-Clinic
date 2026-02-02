# First Pet Veterinary Clinic & Grooming

A comprehensive full-stack web application for a veterinary clinic featuring an online store, appointment booking, pet hotel reservations, pet management, and administrative dashboard.

## 🏥 Project Overview

This is a modern veterinary clinic management system built with Next.js 14, providing a complete solution for:
- **E-commerce**: Online pet product store with shopping cart and order management
- **Appointment Booking**: Schedule and manage veterinary appointments
- **Pet Hotel**: Room reservations for dogs, cats, and birds
- **Pet Management**: Comprehensive pet health records, vaccinations, and medical history
- **Pet Adoption**: Platform for pet adoption listings
- **Analytics**: Track page views, product views, orders, and revenue
- **Admin Dashboard**: Complete administrative interface for managing all aspects of the clinic

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Recoil** - State management for cart and global state
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Relational database (Neon)
- **bcryptjs** - Password hashing
- **Cloudinary** - Image upload and management

### Security & Performance
- **Rate Limiting** - Login attempt protection
- **Input Validation** - XSS and SQL injection prevention
- **Security Headers** - CSRF protection, XSS protection
- **Image Optimization** - Next.js Image component with Cloudinary
- **Caching** - API response caching for performance

## ✨ Key Features

### 🛍️ E-Commerce
- Product catalog with categories
- Shopping cart with persistent state
- Order management (pending, completed, cancelled)
- Stock management
- Product search and filtering
- Product view analytics

### 📅 Appointment System
- Book appointments (logged-in users or guests)
- Appointment status tracking (upcoming, completed, cancelled)
- Search and filter appointments
- Appointment completion with pricing
- Date and time slot management

### 🏨 Pet Hotel
- Room management (Dogs, Cats, Birds)
- Room status tracking (Available, Occupied, Cleaning, Maintenance)
- Reservation system with check-in/check-out
- Pickup and dropoff services
- Extra services support
- Automatic room availability checking

### 🐾 Pet Management
- Pet profiles with unique codes
- Medical history tracking
- Vaccination records with due dates
- Deworming records
- Clinic visit history
- Weight tracking
- Chronic conditions and allergies
- Medication tracking

### 🏠 Pet Adoption
- Adoption listings
- Image galleries
- Contact information
- Status management (active, adopted, removed)

### 📊 Analytics Dashboard
- Page view tracking
- Product view analytics
- Order statistics and revenue
- Appointment statistics
- Hotel reservation statistics
- Top products by views
- Unique visitor tracking

### 👤 User Management
- User registration and authentication
- Role-based access (user, admin)
- User profiles with address management
- Order history
- Pet ownership tracking

### 🔐 Admin Dashboard
- Product management (CRUD)
- Order management and status updates
- User management
- Appointment management
- Hotel room management
- Analytics overview
- Category management

## 📁 Project Structure

```
eaglesVet/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── admin/                # Admin endpoints
│   │   │   ├── orders/          # Order management
│   │   │   ├── products/        # Product management
│   │   │   └── users/           # User management
│   │   ├── adoptions/           # Pet adoption API
│   │   ├── analytics/           # Analytics tracking
│   │   ├── appointments/         # Appointment booking
│   │   ├── auth/                # Authentication
│   │   ├── categories/          # Product categories
│   │   ├── hotel/               # Hotel reservations
│   │   ├── orders/              # Order processing
│   │   ├── pets/                # Pet management
│   │   ├── products/            # Product catalog
│   │   ├── upload/              # Image upload
│   │   └── users/               # User management
│   ├── admin/                   # Admin dashboard pages
│   │   ├── dashboard/          # Admin overview
│   │   ├── hotel/              # Hotel management
│   │   ├── orders/             # Order management
│   │   └── products/           # Product management
│   ├── user/                    # User dashboard pages
│   │   ├── appointments/       # User appointments
│   │   ├── dashboard/          # User overview
│   │   ├── hotel/              # Hotel bookings
│   │   ├── orders/             # Order history
│   │   ├── pets/               # Pet management
│   │   └── profile/            # User profile
│   ├── shop/                    # E-commerce pages
│   ├── cart/                    # Shopping cart
│   ├── about/                   # About page
│   ├── clinic/                  # Clinic information
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Footer
│   ├── Hero.tsx                # Hero section
│   ├── Services.tsx            # Services showcase
│   ├── Staff.tsx               # Team carousel
│   ├── Contact.tsx             # Contact section
│   ├── ShopProducts.tsx        # Product listings
│   ├── ProductDetail.tsx       # Product details
│   ├── CartContent.tsx         # Shopping cart
│   └── Analytics.tsx           # Analytics component
├── lib/                         # Utility libraries
│   ├── prisma.ts               # Prisma client
│   ├── session.ts              # Session management
│   ├── security.ts             # Security utilities
│   ├── utils.ts                # Helper functions
│   └── atoms/                  # Recoil state atoms
│       └── cart.ts             # Cart state
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeding
│   └── migrations/             # Database migrations
├── public/                      # Static assets
│   ├── images/                 # Images
│   └── videos/                 # Videos
├── middleware.ts                # Next.js middleware
└── package.json                 # Dependencies
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts with roles (user/admin)
- **Product**: E-commerce products with categories
- **Category**: Product categories
- **Order**: Customer orders with items
- **OrderItem**: Individual order line items
- **Appointment**: Veterinary appointments
- **Pet**: Pet profiles with medical records
- **Vaccination**: Pet vaccination records
- **Deworming**: Deworming records
- **ClinicVisit**: Veterinary visit history
- **WeightRecord**: Pet weight tracking
- **HotelRoom**: Hotel rooms (Dog/Cat/Bird)
- **HotelReservation**: Room reservations
- **PetAdoption**: Adoption listings
- **PageView**: Analytics tracking
- **ProductView**: Product view tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon, Supabase, or local)
- Cloudinary account (for image uploads) - Optional
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eaglesVet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   
   # Authentication (optional - for NextAuth)
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Cloudinary (optional - for image uploads)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get products (with filtering, sorting, pagination)
- `GET /api/products/[id]` - Get product details
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/[id]` - Update product (admin)
- `DELETE /api/admin/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get orders (with filtering)
- `POST /api/orders` - Create order
- `GET /api/admin/orders/[id]` - Get order details (admin)
- `PUT /api/admin/orders/[id]` - Update order status (admin)

### Appointments
- `GET /api/appointments` - Get appointments (with filtering)
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/[id]` - Get appointment details
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Cancel appointment

### Pets
- `GET /api/pets?userId=xxx` - Get user's pets
- `POST /api/pets` - Create pet profile
- `GET /api/pets/[id]` - Get pet details
- `PUT /api/pets/[id]` - Update pet
- `DELETE /api/pets/[id]` - Delete pet
- `GET /api/pets/[id]/medical` - Get pet medical records

### Hotel
- `GET /api/hotel/rooms` - Get hotel rooms
- `GET /api/hotel/reservations` - Get reservations
- `POST /api/hotel/reservations` - Create reservation
- `GET /api/hotel/reservations/[id]` - Get reservation details
- `PUT /api/hotel/reservations/[id]` - Update reservation
- `POST /api/hotel/reservations/[id]/checkout` - Checkout reservation

### Pet Adoption
- `GET /api/adoptions` - Get adoption listings
- `POST /api/adoptions` - Create adoption listing

### Analytics
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics/pageview` - Track page view
- `POST /api/analytics/productview` - Track product view

### Upload
- `POST /api/upload` - Upload image to Cloudinary

### Categories
- `GET /api/categories` - Get all categories

### Users
- `GET /api/users` - Get users (admin)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Login attempt protection (5 attempts per 15 minutes)
- **Input Validation**: Zod schemas for all inputs
- **XSS Protection**: Input sanitization
- **SQL Injection Prevention**: Prisma parameterized queries
- **CSRF Protection**: Origin validation in middleware
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Session Management**: LocalStorage-based sessions

## 🎨 Features in Detail

### Shopping Cart
- Persistent cart using Recoil state management
- Add/remove items
- Quantity updates
- Real-time cart count in header

### Appointment Booking
- Support for both logged-in users and guests
- Date and time selection
- Pet selection for registered users
- Appointment status tracking
- Completion with pricing

### Pet Hotel
- Room types: Dog, Cat, Bird
- Room status: Available, Occupied, Cleaning, Maintenance
- Date range availability checking
- Pickup and dropoff services
- Extra services support
- Checkout process with pricing

### Pet Medical Records
- Vaccination tracking with due dates
- Deworming records
- Clinic visit history
- Weight tracking over time
- Medical history, allergies, medications
- Surgical history

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma generate  # Generate Prisma Client
npx prisma migrate   # Run migrations
npx prisma studio    # Open Prisma Studio (database GUI)
npm run seed         # Seed the database

# Linting
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="https://your-domain.com"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🧪 Testing

The application includes:
- Input validation on all forms
- Error handling in API routes
- Type safety with TypeScript
- Security middleware

## 📄 License

All rights reserved - First Pet Veterinary Clinic & Grooming

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.

## 📞 Support

For support, please contact the clinic administration or development team.

---

**Built with ❤️ for First Pet Veterinary Clinic & Grooming**
