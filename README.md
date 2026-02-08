# ProductHub

A full-stack CRUD application for managing products with user authentication built using **Next.js**, **Express.js**, **MongoDB**, and **TypeScript**.

---

## Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | Next.js 16, React 19, TailwindCSS, TypeScript |
| Backend  | Express.js 5, TypeScript, Mongoose            |
| Database | MongoDB Atlas                                 |
| Auth     | JWT + bcryptjs                                |

---

## Project Structure

```
jasper-colin/
├── client/                     # Next.js frontend
│   ├── app/
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Navigation bar with auth state
│   │   │   ├── ProductCard.tsx     # Product display card
│   │   │   ├── ProductForm.tsx     # Reusable create/edit form
│   │   │   └── ToastProvider.tsx   # Toast notification wrapper
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   ├── register/
│   │   │   └── page.tsx            # Registration page
│   │   ├── products/
│   │   │   ├── page.tsx            # Products listing page
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Create new product
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit existing product
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home (redirects to /products)
│   │   └── globals.css             # Global styles
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication context provider
│   ├── lib/
│   │   └── api.ts                  # Axios instance with JWT interceptor
│   ├── middleware.ts               # Route protection middleware
│   ├── package.json
│   └── tsconfig.json
│
├── server/                     # Express.js backend
│   ├── config/
│   │   └── db.ts                   # MongoDB connection setup
│   ├── models/
│   │   ├── User.ts                 # User model (username, hashed password)
│   │   └── Product.ts              # Product model (name, description, price, category)
│   ├── routes/
│   │   ├── auth.ts                 # POST /register, POST /login
│   │   └── products.ts            # CRUD endpoints for products
│   ├── middleware/
│   │   ├── auth.ts                 # JWT verification middleware
│   │   └── rateLimiter.ts          # Rate limiting (100 req/15min API, 20 req/15min auth)
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Entry point with Node.js cluster support
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Root scripts (runs both client & server)
└── .gitignore
```

---

## How It Works

### Authentication Flow

1. User registers or logs in via the frontend forms.
2. Server validates credentials, hashes passwords with **bcryptjs**, and returns a **JWT** token.
3. The token is stored in a browser cookie via `js-cookie`.
4. `AuthContext` manages the logged-in user state across the app.
5. `lib/api.ts` attaches the JWT to every outgoing API request via an Axios interceptor.
6. Server middleware (`middleware/auth.ts`) verifies the token on protected routes.
7. Client middleware (`middleware.ts`) redirects unauthenticated users away from protected pages.

### Product CRUD

| Action | Frontend Route        | API Endpoint           | Auth Required |
| ------ | --------------------- | ---------------------- | ------------- |
| List   | `/products`           | `GET /api/products`    | No            |
| View   | `/products`           | `GET /api/products/:id`| No            |
| Create | `/products/new`       | `POST /api/products`   | Yes           |
| Edit   | `/products/[id]/edit` | `PUT /api/products/:id`| Yes           |
| Delete | (from product card)   | `DELETE /api/products/:id` | Yes       |

### Rate Limiting

- **API routes**: 100 requests per 15 minutes per IP
- **Auth routes**: 20 requests per 15 minutes per IP (prevents brute-force)

---

## Prerequisites

- **Node.js** (v18 or higher)
- **npm**
- **MongoDB Atlas** account (or a local MongoDB instance)

---

## Setup

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
# Server only
npm run server

# Client only
npm run client
```

---

## API Endpoints

### Auth

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | Login and receive a JWT  |

### Products

| Method | Endpoint             | Description              | Auth     |
| ------ | -------------------- | ------------------------ | -------- |
| GET    | `/api/products`      | Get all products         | Public   |
| GET    | `/api/products/:id`  | Get a single product     | Public   |
| POST   | `/api/products`      | Create a product         | Required |
| PUT    | `/api/products/:id`  | Update a product         | Required |
| DELETE | `/api/products/:id`  | Delete a product         | Required |

### Health

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | `/api/health`  | Server status check  |

---

## Database Models

### User

| Field    | Type   | Constraints                    |
| -------- | ------ | ------------------------------ |
| username | String | Required, unique, min 3 chars  |
| password | String | Required, hashed, min 6 chars  |

### Product

| Field       | Type   | Constraints                         |
| ----------- | ------ | ----------------------------------- |
| name        | String | Required                            |
| description | String | Optional                            |
| price       | Number | Required, min 0                     |
| category    | String | Optional, default "Uncategorized"   |

Both models include automatic `createdAt` and `updatedAt` timestamps.

---

## Security

- Passwords hashed with **bcryptjs** (10 salt rounds)
- JWT tokens expire after **7 days**
- CORS restricted to `http://localhost:3000`
- Rate limiting on all API and auth routes
- Protected routes on both client and server side
