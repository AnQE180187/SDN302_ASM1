# E-Commerce Web App with User Authentication & Product Management

A clothing e-commerce website built with Next.js, MongoDB, and NextAuth.js. This application allows users to register, login, and manage products, with a focus on RESTful API development, user authentication, and CRUD operations.

## Features

- **User Authentication**

  - Register with email and password
  - Login to access protected features
  - JWT-based authentication with NextAuth.js

- **Product Management**

  - Create, read, update, and delete products
  - Image upload (Base64 storage)
  - Protected routes for authenticated users only

- **UI Features**
  - Responsive design
  - Product listing with pagination
  - Search and filter products
  - Dynamic UI updates based on authentication state

## Tech Stack

- **Frontend & API**: Next.js (App Router)
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/e-commerce-nextjs.git
cd e-commerce-nextjs
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string and NextAuth secret

```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-for-jwt-tokens-here"
```

4. Push the Prisma schema to your database

```bash
npx prisma db push
```

5. Run the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- **Authentication**

  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/[...nextauth]` - NextAuth.js authentication routes

- **Products**
  - `GET /api/products` - List all products
  - `GET /api/products/:id` - Get a single product
  - `POST /api/products` - Create a new product (authenticated)
  - `PUT /api/products/:id` - Update a product (authenticated)
  - `DELETE /api/products/:id` - Delete a product (authenticated)

## Deployment

### Deploying to Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI:

```bash
npm install -g vercel
```

3. Login to Vercel:

```bash
vercel login
```

4. Deploy your application:

```bash
vercel
```

5. Set up environment variables in the Vercel dashboard
   - Add your `DATABASE_URL` and `NEXTAUTH_SECRET`
   - Set `NEXTAUTH_URL` to your deployment URL

## License

This project is licensed under the MIT License - see the LICENSE file for details.
