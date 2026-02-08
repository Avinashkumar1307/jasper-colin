# ProductHub — Full Stack CRUD Application

A full-stack product management application with user authentication, built as part of the **Jasper Colin Full Stack Developer** assessment.

Built with **Next.js**, **Express.js**, **MongoDB**, and **TypeScript**.

---

## Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | Next.js 16, React 19, TailwindCSS, TypeScript |
| Backend  | Express.js 5, TypeScript, Mongoose            |
| Database | MongoDB Atlas                                 |
| Auth     | JWT + bcryptjs                                |

---

## Prerequisites

- **Node.js** (v18 or higher)
- **npm**
- **MongoDB Atlas** account (or a local MongoDB instance)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd jasper-colin
```

### 2. Install dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

cd ..
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
```

Replace:
- `<username>` and `<password>` with your MongoDB Atlas credentials
- `<cluster>` with your cluster address
- `<dbname>` with your database name
- `JWT_SECRET` with a strong random string for production

### 4. Run the application

```bash
# Run both client and server simultaneously
npm run dev
```

This starts:
- **Frontend** at `http://localhost:3000`
- **Backend** at `http://localhost:5000`

You can also run them separately:

```bash
npm run server    # Server only
npm run client    # Client only
```

---

## Project Structure

```
jasper-colin/
├── client/                          # Next.js frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── Navbar.tsx               # Navigation bar with auth state
│   │   │   ├── ProductCard.tsx          # Product display card with edit/delete
│   │   │   ├── ProductForm.tsx          # Reusable form for create & edit
│   │   │   └── ToastProvider.tsx        # Toast notification wrapper
│   │   ├── login/
│   │   │   └── page.tsx                 # Login page
│   │   ├── register/
│   │   │   └── page.tsx                 # Registration page
│   │   ├── products/
│   │   │   ├── page.tsx                 # Products listing page
│   │   │   ├── new/
│   │   │   │   └── page.tsx             # Create new product
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx         # Edit existing product
│   │   ├── layout.tsx                   # Root layout with providers
│   │   ├── page.tsx                     # Home (redirects to /products)
│   │   └── globals.css                  # Global styles (TailwindCSS)
│   ├── context/
│   │   └── AuthContext.tsx              # Auth state management via React Context
│   ├── lib/
│   │   └── api.ts                       # Axios instance with JWT interceptor
│   ├── middleware.ts                    # Auth Guard — protects frontend routes
│   ├── package.json
│   └── tsconfig.json
│
├── server/                          # Express.js backend
│   ├── config/
│   │   └── db.ts                        # MongoDB/Mongoose connection
│   ├── models/
│   │   ├── User.ts                      # User schema (username, hashed password)
│   │   └── Product.ts                   # Product schema (name, description, price, category)
│   ├── routes/
│   │   ├── auth.ts                      # POST /register & POST /login
│   │   └── products.ts                  # Product CRUD endpoints
│   ├── middleware/
│   │   ├── auth.ts                      # JWT verification middleware
│   │   └── rateLimiter.ts               # API & Auth rate limiters
│   ├── app.ts                           # Express app config (CORS, routes, middleware)
│   ├── server.ts                        # Entry point — Node.js Clustering
│   ├── .env                             # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                     # Root scripts (runs client + server)
└── .gitignore
```

---

## Task Completion Details

### Task 1: Setting Up the Environment

| Requirement | Implementation |
|---|---|
| Next.js project | `client/` — Next.js 16 with TypeScript and TailwindCSS |
| Node.js server with Express.js | `server/` — Express.js 5 with TypeScript |
| MongoDB connection via Mongoose | `server/config/db.ts` — connects using `MONGO_URI` from `.env` |

---

### Task 2: Basic CRUD Application

#### Backend — API Routes

| Method | Endpoint | Description | File |
|---|---|---|---|
| POST | `/api/products` | Create a new product (name, description, price, category) | `server/routes/products.ts` |
| GET | `/api/products` | Retrieve all products | `server/routes/products.ts` |
| GET | `/api/products/:id` | Retrieve a single product by ID | `server/routes/products.ts` |
| PUT | `/api/products/:id` | Update a product by ID | `server/routes/products.ts` |
| DELETE | `/api/products/:id` | Delete a product by ID | `server/routes/products.ts` |

#### Rate Limiting (`server/middleware/rateLimiter.ts`)

| Limiter | Limit | Applied To |
|---|---|---|
| `apiLimiter` | 100 requests per 15 minutes per IP | All `/api` routes |
| `authLimiter` | 20 requests per 15 minutes per IP | `/api/auth` routes (prevents brute-force) |

#### Frontend — Product Pages

| Feature | Route | File |
|---|---|---|
| Display product list | `/products` | `client/app/products/page.tsx` |
| Add new product form | `/products/new` | `client/app/products/new/page.tsx` |
| Edit product form | `/products/[id]/edit` | `client/app/products/[id]/edit/page.tsx` |
| Delete product | (button on each ProductCard) | `client/app/components/ProductCard.tsx` |

---

### Task 3: Authentication & Authorization

#### Backend — Node Clustering (`server/server.ts`)

The server uses the Node.js `cluster` module to fork worker processes based on available CPU cores. The primary process manages workers and automatically restarts any worker that exits unexpectedly.

#### Backend — JWT Authentication

| Method | Endpoint | Description | File |
|---|---|---|---|
| POST | `/api/auth/register` | Register with username & password | `server/routes/auth.ts` |
| POST | `/api/auth/login` | Login and receive a JWT token | `server/routes/auth.ts` |

- Passwords are hashed using **bcryptjs** (10 salt rounds) before storing in the database.
- JWT tokens are signed with `JWT_SECRET` and expire after **7 days**.

#### Backend — Protected Route Middleware (`server/middleware/auth.ts`)

The `protect` middleware verifies the JWT from the `Authorization: Bearer <token>` header. Only authenticated users can access:

- `POST /api/products` (create)
- `PUT /api/products/:id` (update)
- `DELETE /api/products/:id` (delete)

Public routes (no auth required):

- `GET /api/products` (list all)
- `GET /api/products/:id` (view one)

#### Frontend — Login & Registration

| Page | Route | Features |
|---|---|---|
| Login | `/login` | Username/password form, error handling, redirect on success |
| Register | `/register` | Username/password with confirm password, validation (min 3 chars username, min 6 chars password) |

#### Frontend — JWT Storage (`client/context/AuthContext.tsx` & `client/lib/api.ts`)

- JWT token is stored securely in **browser cookies** using `js-cookie` (7-day expiry).
- `AuthContext` provides `login`, `register`, and `logout` functions across the app.
- `lib/api.ts` uses an Axios **request interceptor** to automatically attach the JWT token to every API request.
- A **response interceptor** handles `401` errors by clearing cookies and redirecting to `/login`.

#### Frontend — Auth Guard (`client/middleware.ts`)

Next.js middleware protects frontend routes so only authenticated users can access:

- `/products/new` (create product page)
- `/products/[id]/edit` (edit product page)

Unauthenticated users are redirected to `/login`. Already-authenticated users are redirected away from `/login` and `/register` to `/products`.

---

## Database Models

### User

| Field | Type | Constraints |
|---|---|---|
| username | String | Required, unique, min 3 characters |
| password | String | Required, hashed with bcrypt, min 6 characters |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Product

| Field | Type | Constraints |
|---|---|---|
| name | String | Required |
| description | String | Optional |
| price | Number | Required, min 0 |
| category | String | Optional, defaults to "Uncategorized" |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

---

## Security Features

- Passwords hashed with **bcryptjs** (10 salt rounds)
- JWT tokens expire after **7 days**
- CORS restricted to `http://localhost:3000`
- Rate limiting on all API and auth routes
- Protected routes on both client (Auth Guard) and server (JWT middleware)
- Automatic token cleanup on `401` responses
