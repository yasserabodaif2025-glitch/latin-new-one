# Latin Academy Management System

This is a [Next.js](https://nextjs.org) project for managing Latin Academy's operations, including student management, course scheduling, and financial tracking.

## Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- API server URL (for backend communication)

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://your-api-url:port/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-for-next-auth

# Authentication (if using NextAuth.js)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Other environment variables as needed
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/latin-academy.git
   cd latin-academy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables (see above)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Student Management
- Course Scheduling
- Financial Tracking
- Multi-language Support (English/Arabic)
- Responsive Design

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Next-Intl (i18n)
- TanStack Query (React Query)
- Radix UI Components

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
