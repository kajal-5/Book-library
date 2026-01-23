# 🚀 Book Library - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Firebase Configuration](#firebase-configuration)
5. [Environment Setup](#environment-setup)
6. [Running the Application](#running-the-application)
7. [Build for Production](#build-for-production)
8. [Troubleshooting](#troubleshooting)
9. [Dependencies Explained](#dependencies-explained)

---

## Prerequisites

### Required Software

Before starting, ensure you have the following installed on your system:

#### 1. **Node.js** (v16.0.0 or higher)
- **Check if installed:**
  ```bash
  node --version
  ```
- **Expected output:** `v16.x.x` or higher

- **Download:**
  - Visit: https://nodejs.org/
  - Download LTS (Long Term Support) version
  - Run installer and follow instructions

- **Installation verification:**
  ```bash
  node --version
  npm --version
  ```

#### 2. **npm** (v8.0.0 or higher) or **yarn**
- npm comes bundled with Node.js
- **Check version:**
  ```bash
  npm --version
  ```

- **Alternative: yarn** (optional)
  ```bash
  npm install -g yarn
  yarn --version
  ```

#### 3. **Git** (for version control)
- **Check if installed:**
  ```bash
  git --version
  ```

- **Download:**
  - Visit: https://git-scm.com/downloads
  - Install for your operating system

#### 4. **Code Editor** (Recommended: VS Code)
- Download: https://code.visualstudio.com/
- Install recommended extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense

---

## System Requirements

### Minimum Requirements
- **OS:** Windows 10, macOS 10.14+, or Linux
- **RAM:** 4 GB (8 GB recommended)
- **Disk Space:** 500 MB free space
- **Internet:** Required for Firebase and npm packages

### Supported Browsers (for testing)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Installation Steps

Follow these steps carefully to set up the project:

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd ~/Downloads

# Clone the repository
git clone <your-repository-url>

# Navigate into project directory
cd book-library
```

**If you already have the project folder:**
```bash
cd /Users/himanssr/Downloads/Book-library/book-library
```

---

### Step 2: Install Dependencies

This will install all packages listed in `package.json`:

```bash
npm install
```

**What this does:**
- Downloads all required npm packages
- Creates `node_modules` folder
- Generates `package-lock.json` (locks exact versions)
- Takes 2-5 minutes depending on internet speed

**Expected output:**
```
added 500+ packages in 3m
```

**Alternative with yarn:**
```bash
yarn install
```

---

### Step 3: Verify Installation

Check that all dependencies were installed correctly:

```bash
# Check if node_modules exists
ls -la node_modules

# Verify key packages
npm list react react-dom vite
```

**Expected output:**
```
book-library@0.0.0
├── react@19.2.0
├── react-dom@19.2.0
└── vite@7.2.4
```

---

## Firebase Configuration

### Step 4: Create Firebase Project

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Sign in with Google account
   - Click "Add Project"

2. **Create New Project:**
   ```
   Project Name: book-library (or your choice)
   ✓ Enable Google Analytics (optional)
   Click "Create Project"
   ```

3. **Wait for project creation** (takes 30-60 seconds)

---

### Step 5: Set Up Firebase Realtime Database

1. **In Firebase Console:**
   - Click "Realtime Database" in left sidebar
   - Click "Create Database"

2. **Choose Database Location:**
   ```
   Select region closest to your users
   (e.g., us-central1, europe-west1, asia-southeast1)
   ```

3. **Set Security Rules:**
   - Choose "Start in test mode" (for development)
   - Click "Enable"

4. **Update Security Rules:**
   - Click "Rules" tab
   - Replace with:
   ```json
   {
     "rules": {
       "users": {
         ".read": "auth != null",
         "$uid": {
           ".write": "auth != null"
         }
       },
       "books": {
         ".read": true,
         ".write": "auth != null"
       },
       "rentBook": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "adminNotifications": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "userNotifications": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "transactions": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```
   - Click "Publish"

---

### Step 6: Enable Firebase Authentication

1. **In Firebase Console:**
   - Click "Authentication" in left sidebar
   - Click "Get Started"

2. **Enable Email/Password Authentication:**
   - Click "Sign-in method" tab
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

---

### Step 7: Get Firebase Configuration

1. **In Firebase Console:**
   - Click ⚙️ (Settings) → "Project settings"
   - Scroll down to "Your apps"
   - Click "</>" (Web) icon

2. **Register App:**
   ```
   App nickname: book-library-web
   ☐ Firebase Hosting (skip for now)
   Click "Register app"
   ```

3. **Copy Configuration:**
   You'll see something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyDv4-aofLFqOnDJI3aOJO57hkgtoMs1zvY",
     authDomain: "book-app-339c8.firebaseapp.com",
     projectId: "book-app-339c8",
     databaseURL: "https://book-app-339c8-default-rtdb.firebaseio.com",
     storageBucket: "book-app-339c8.appspot.com",
   };
   ```

4. **Copy these values** - you'll need them in the next step

---

### Step 8: Update Firebase Configuration in Code

You need to update the Firebase config in **4 files**:

#### File 1: `src/APIs/LoginAPi.jsx`

Open the file and update line 1 and lines 3-4:

```javascript
// Line 1: Update API Key
const FIREBASE_API_KEY = "YOUR_FIREBASE_API_KEY";

// Lines 3-4: Update Database URL
const DB_BASE_URL = "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com";
```

**Example:**
```javascript
const FIREBASE_API_KEY = "AIzaSyDv4-aofLFqOnDJI3aOJO57hkgtoMs1zvY";
const DB_BASE_URL = "https://book-app-339c8-default-rtdb.firebaseio.com";
```

#### File 2: `src/APIs/BookAPicall.jsx`

Update lines 1-2:
```javascript
const DB_BASE_URL = "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com";
```

#### File 3: `src/APIs/RequestAPi.jsx`

Update the DB_BASE_URL constant:
```javascript
const DB_BASE_URL = "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com";
```

#### File 4: `src/APIs/TransactionAPI.jsx`

Update the DB_BASE_URL constant:
```javascript
const DB_BASE_URL = "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com";
```

#### File 5: `src/APIs/RentalNotificationService.jsx`

Update all Firebase URLs in fetch calls:
```javascript
const DB_BASE_URL = "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com";
```

---

## Environment Setup

### Step 9: Create Environment File (Optional but Recommended)

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following content:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Application Settings
VITE_APP_NAME="Book Library"
VITE_APP_VERSION="1.0.0"
```

**Note:** Replace `your_*` values with your actual Firebase credentials.

**Update API files to use environment variables:**

```javascript
// Example in LoginAPi.jsx
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const DB_BASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
```

---

## Running the Application

### Step 10: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v7.2.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
➜  press h + enter to show help
```

**What this does:**
- Starts Vite development server
- Enables Hot Module Replacement (HMR)
- Watches for file changes
- Provides fast refresh

---

### Step 11: Open in Browser

1. **Open your browser**
2. **Navigate to:** http://localhost:5173
3. **You should see:** The login page

**If port 5173 is busy:**
```bash
# Vite will automatically use next available port
# Check terminal output for actual port
```

---

### Step 12: Create First Admin Account

Since the database is empty, you need to create the first user:

1. **Click "Sign Up"**
2. **Fill the form:**
   ```
   Email: admin@booklib.com
   Password: admin123
   Name: Admin User
   Contact: 1234567890
   Address: Admin Address
   ```
3. **Click "Sign Up"**

4. **Manually set as admin:**
   - Go to Firebase Console → Realtime Database
   - Find: `users/admin_booklib_com`
   - Change `"role": "user"` to `"role": "admin"`
   - Save

5. **Log out and log back in** to see admin dashboard

---

## Build for Production

### Step 13: Create Production Build

```bash
npm run build
```

**What this does:**
- Optimizes code for production
- Minifies JavaScript and CSS
- Creates `dist` folder with static files
- Takes 30-60 seconds

**Expected output:**
```
vite v7.2.4 building for production...
✓ built in 45.23s
dist/index.html                 0.45 kB
dist/assets/index-a1b2c3d4.css  125.34 kB
dist/assets/index-e5f6g7h8.js   350.67 kB
```

---

### Step 14: Preview Production Build

```bash
npm run preview
```

**Expected output:**
```
➜  Local:   http://localhost:4173/
➜  Network: http://192.168.1.100:4173/
```

Test the production build locally before deploying.

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error:**
```
Port 5173 is in use, trying another one...
```

**Solution:**
- Vite automatically finds next available port
- Or kill the process using port 5173:
  ```bash
  # macOS/Linux
  lsof -ti:5173 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```

---

#### Issue 2: Module Not Found

**Error:**
```
Cannot find module 'react'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

#### Issue 3: Firebase Permission Denied

**Error:**
```
PERMISSION_DENIED: Permission denied
```

**Solution:**
1. Check Firebase rules are set correctly
2. Ensure user is authenticated
3. Verify database URL is correct

---

#### Issue 4: CORS Error

**Error:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
- Firebase Realtime Database doesn't have CORS issues
- Ensure you're using `.json` at end of Firebase URLs
- Check URL format: `https://project.firebaseio.com/path.json`

---

#### Issue 5: Build Fails

**Error:**
```
Build failed with errors
```

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

---

#### Issue 6: Blank Page After Build

**Problem:** Production build shows blank page

**Solution:**
1. Check browser console for errors
2. Verify all Firebase URLs are updated
3. Check vite.config.js base path:
   ```javascript
   export default defineConfig({
     base: '/',  // or your deployment path
     // ...
   });
   ```

---

## Dependencies Explained

### Production Dependencies (`dependencies`)

These are required for the application to run:

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2.0 | Core React library for building UI |
| `react-dom` | 19.2.0 | React rendering for web browsers |
| `react-router-dom` | 7.12.0 | Client-side routing (navigation) |
| `@reduxjs/toolkit` | 2.11.2 | State management (Redux) |
| `react-redux` | 9.2.0 | React bindings for Redux |
| `react-hot-toast` | 2.6.0 | Toast notifications |
| `react-icons` | 5.5.0 | Icon library |
| `@tailwindcss/vite` | 4.1.18 | Tailwind CSS for styling |

**Installation:**
```bash
npm install react react-dom react-router-dom @reduxjs/toolkit react-redux react-hot-toast react-icons @tailwindcss/vite
```

---

### Development Dependencies (`devDependencies`)

These are only needed during development:

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | 7.2.4 | Build tool and dev server |
| `@vitejs/plugin-react` | 5.1.1 | Vite plugin for React |
| `eslint` | 9.39.1 | Code linting (find errors) |
| `@eslint/js` | 9.39.1 | ESLint JavaScript config |
| `eslint-plugin-react-hooks` | 7.0.1 | ESLint rules for React Hooks |
| `eslint-plugin-react-refresh` | 0.4.24 | ESLint for Fast Refresh |
| `tailwindcss` | 4.1.18 | Utility-first CSS framework |
| `postcss` | 8.5.6 | CSS processing tool |
| `autoprefixer` | 10.4.23 | Auto-add CSS vendor prefixes |
| `globals` | 16.5.0 | Global variables for ESLint |

**Installation:**
```bash
npm install --save-dev vite @vitejs/plugin-react eslint tailwindcss postcss autoprefixer
```

---

## Project Scripts

### Available Commands

Add these scripts to your `package.json` if not present:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

**Usage:**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

---

## Folder Structure After Installation

```
book-library/
├── node_modules/           # All installed packages (500+ MB)
├── public/                 # Static assets
├── src/                    # Source code
│   ├── AdminPages/
│   ├── UserPages/
│   ├── APIs/
│   ├── Store/
│   ├── Login/
│   ├── Routes/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                    # Environment variables (create this)
├── .gitignore             # Git ignore file
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json           # Project dependencies
├── package-lock.json      # Locked dependency versions
├── vite.config.js         # Vite configuration
├── README.md              # Project documentation
├── DOCUMENTATION.md       # Technical documentation
├── RENTAL_SYSTEM_GUIDE.md # Rental system guide
├── SETUP_GUIDE.md         # This file
└── USER_JOURNEY_AND_FEATURES.md  # User journey guide
```

---

## Quick Start Checklist

Use this checklist to ensure everything is set up correctly:

- [ ] Node.js v16+ installed
- [ ] npm v8+ installed
- [ ] Project cloned/downloaded
- [ ] `npm install` completed successfully
- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Authentication enabled (Email/Password)
- [ ] Firebase config copied
- [ ] All API files updated with Firebase URLs
- [ ] `.env` file created (optional)
- [ ] `npm run dev` runs without errors
- [ ] Application opens at http://localhost:5173
- [ ] Can create user account
- [ ] First admin account created and role changed
- [ ] Can log in as admin
- [ ] Can add books
- [ ] Can rent books as user

---

## Next Steps

After successful setup:

1. **Read Documentation:**
   - [README.md](README.md) - Project overview
   - [DOCUMENTATION.md](DOCUMENTATION.md) - Technical details
   - [USER_JOURNEY_AND_FEATURES.md](USER_JOURNEY_AND_FEATURES.md) - User flows

2. **Test Features:**
   - Create test user account
   - Create admin account
   - Add sample books
   - Test rental flow
   - Test return flow

3. **Customize:**
   - Update branding in `index.html`
   - Modify colors in `index.css`
   - Add custom categories
   - Adjust rental calculations if needed

4. **Deploy:**
   - See deployment section in README.md
   - Choose hosting platform (Vercel, Netlify, Firebase)
   - Set up production environment

---

## Getting Help

If you encounter issues:

1. **Check Documentation:**
   - Read error messages carefully
   - Search this guide for solutions
   - Check troubleshooting section

2. **Check Logs:**
   ```bash
   # Development server logs
   npm run dev
   
   # Browser console (F12)
   # Look for errors in Console tab
   ```

3. **Common Resources:**
   - [React Documentation](https://react.dev)
   - [Vite Documentation](https://vitejs.dev)
   - [Firebase Documentation](https://firebase.google.com/docs)
   - [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Maintenance

### Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update all packages (careful!)
npm update

# Update specific package
npm update react react-dom

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```

### Clean Installation

If things get messy:

```bash
# Remove all dependencies
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall everything
npm install
```

---

## Success!

If you've completed all steps, you should now have:

✅ Fully functional development environment  
✅ Firebase backend configured  
✅ Application running locally  
✅ Admin and user accounts working  
✅ Ready to develop or deploy  

**Congratulations! Your Book Library system is ready to use! 🎉**

---

**Document Version:** 1.0.0  
**Last Updated:** January 23, 2026  
**Maintained By:** Himans SR
