# SchemeAssist

SchemeAssist is a modern, responsive web application built with Next.js 14 and Appwrite. It serves as a unified platform designed to help citizens discover, filter, and track government schemes they are eligible for. The platform features an intelligent recommendation engine based on user profiles and categorizes large volumes of schemes (e.g., Agriculture, Education, Health, etc.) for easy access.

## Features

- **User Authentication**: Secure Login and Signup flows powered by Appwrite.
- **Detailed User Profiles**: A comprehensive 18-field profile form capturing demographics, financial status, occupation, and accessibility statuses to provide highly accurate scheme recommendations.
- **Account Management**: Users can log out or permanently delete their profile and data from the database securely.
- **Dynamic Scheme Dashboard**: A personalized dashboard that displays "Recommended For You" schemes based on the user's saved profile data.
- **Categorized "All Schemes" Explorer**: Browse hundreds of schemes using explicit `Area` filters (Agriculture, Education, Health, Business, Women, Seniors, General).
- **Global Search**: Search through scheme names and benefit summaries instantly.
- **Responsive & Modern UI**: Built with Tailwind CSS, utilizing Framer Motion for smooth transitions and Lucide React for consistent iconography.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/BaaS**: Appwrite (Authentication & Databases)
- **Deployment**: Vercel (Recommended)

---

## Getting Started

Follow these instructions to set up the project locally.

### 1. Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- An [Appwrite](https://appwrite.io/) Cloud account or Self-Hosted instance.

### 2. Appwrite Setup

1. **Create a Project**: Log in to your Appwrite console and create a new project.
2. **Create a Database**: Note the Database ID.
3. **Create Collections**:
   - **`schemes`**: Create a collection for government schemes and add attributes like `schemeName` (String), `benefitsSummary` (String), `area` (String), etc.
   - **`userprofile`**: Create a collection for user profiles with attributes matching the frontend form:`userId` (String), `name` (String), `email` (Email), `age` (Integer), `gender` (String), `state` (String), `district` (String), `areaType` (String), `category` (String), `income` (Integer), `occupation` (String), `educationLevel` (String), `landHolding` (Integer), `religion` (String), `isPhysicallyDisabled` (Boolean), `hasBPLCard` (Boolean), `isTaxPayer` (Boolean), `isGovEmployee` (Boolean).
4. **Permissions**: Go to both collections' settings and ensure `Role: Any` or `Role: Users` has `Read` and `Write` access as intended.

### 3. Environment Variables

Create a `.env` file in the root of your project and populate it with your Appwrite project credentials:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_DATABASE_ID=your_database_id
NEXT_PUBLIC_COLLECTION_ID=your_schemes_collection_id
NEXT_PUBLIC_PROFILE_COLLECTION_ID=your_userprofile_collection_id

# Only needed if you run server-side admin scripts (e.g., node scripts/updateArea.js)
APPWRITE_API_KEY=your_secret_api_key
```

### 4. Installation & Running

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages (`login`, `signup`, `dashboard`, `profile`, `dashboard/schemes`).
- `components/`: Reusable UI components (`Navbar`, `Footer`, `Sidebar`, `SchemeCard`, `ProfileCard`).
- `lib/`: Configuration and utility files (e.g., `appwrite.ts` for Appwrite SDK integration).
- `scripts/`: Node.js utility scripts used for server-side database population and maintenance (e.g., bulk updating Scheme areas).

## License
This project is open-source.
