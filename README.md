# 📄 Resume Builder

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Live Demo:** [https://resume-builder-six-peach-27.vercel.app](https://resume-builder-six-peach-27.vercel.app/)

A highly interactive, modern, and beautiful Resume Builder application. Designed with a multi-step user experience, complete with live previews, cloud-based history saving via Google Authentication, and a direct print-to-PDF export mechanism.

---

## ✨ Features

- **Multi-Step Form Wizard:** Seamlessly navigate between Personal Details, Summary, Education, Experience, Projects, and Skills.
- **Real-time Live Preview:** Watch your resume render on a beautiful A4 page exactly as you type.
- **Drag & Drop Section Ordering:** Rearrange the layout of your resume sections dynamically.
- **Theme Color Customization:** Pick and choose primary accent colors for each unique section.
- **Cloud History Saving:** Sign in securely with Google Auth to auto-save multiple versions of your resume into Firebase Firestore.
- **Previous Work Library:** Browse through your past generated resumes and instantly populate the builder to update old data.
- **Print & Download:** A clean CSS `@media print` layout engineered perfectly for exporting to PDF without any visual artifacts.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router format)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) Validation
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Google Auth + Firestore)
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and `npm` installed. You will also need a Firebase project set up with **Authentication** (Google Native Provider) and **Firestore Database** enabled.

### 1. Clone the repository
```bash
git clone https://github.com/Neeln11/Resume-builder.git
cd Resume-builder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📝 License
This project is open-source and available for demonstration or educational purposes.
