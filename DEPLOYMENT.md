# Deployment Guide

This guide will help you deploy your e-commerce application to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)
3. Your MongoDB Atlas database (already set up)

## Steps to Deploy

### 1. Push your code to GitHub

If your code is not already on GitHub, create a new repository and push your code:

```bash
# Initialize git repository if needed
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

#### Option 1: Deploy via the Vercel website

1. Login to [Vercel](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave as default)
   - Output Directory: (leave as default)
5. Add Environment Variables:
   - `DATABASE_URL`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: Your NextAuth secret key
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., https://your-project.vercel.app)
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy your application:

```bash
vercel
```

4. Follow the prompts to configure your deployment
5. Add environment variables:

```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

### 3. Verify Your Deployment

1. Once deployed, Vercel will provide you with a URL for your application
2. Open the URL in your browser to verify that your application is working
3. Test the authentication features and product management functionality

### 4. Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click on "Settings" > "Domains"
3. Add your custom domain and follow the instructions to configure DNS

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Vercel dashboard
2. Verify that your environment variables are correctly set
3. Make sure your MongoDB Atlas database is accessible from Vercel (whitelist all IP addresses in MongoDB Atlas Network Access settings)
4. Check that your `NEXTAUTH_URL` matches your deployment URL
