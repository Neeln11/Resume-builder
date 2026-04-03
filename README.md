# 📄 Resume Builder

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Live Demo:** [https://resume-builder-mu-two-69.vercel.app](https://resume-builder-mu-two-69.vercel.app/)

A highly interactive, modern, and beautiful Resume Builder application. Designed with a landing-page-to-dashboard workflow, multi-step builder wizard, cloud-based history saving via Firebase, AI-powered writing assistance, and pixel-perfect PDF export.

---

## ✨ Features

- **Smart Routing Workflow:** Dedicated high-conversion Landing Page for guests, automatically routing authenticated users to their secure Resume Dashboard.
- **Resume Dashboard:** A central hub to view, edit, reproduce, and delete previously built resumes stored in the cloud.
- **AI Writing Assistant:** Integrated with Gemini AI to generate professional summaries and experience bullet points based on your input.
- **ATS Analyzer & Auto-Implementer:** Grade your resume's Applicant Tracking System (ATS) score using AI. View missing keywords and instantly apply optimized "1-click" intelligent text corrections right into your resume fields.
- **Categorized Skills Engine:** Build categorized hierarchical skill sections (e.g. "Frontend", "Backend", "Tools") for perfectly segmented and readable rendering across all templates.
- **Dynamic Multi-Step Builder:** Seamlessly navigate between Personal Details, Summary, Education, Experience, Projects, and Skills.
- **Mobile-First Responsive UI:** Build your resume on the go with a native-feeling Tab interface that intelligently switches between the Edit Form and Live Preview without horizontal scrolling.
- **3 Premium Templates:** Choose between Standard Professional, Clean Minimalist, and Modern Creative layouts.
- **Real-time Auto-Scaling Preview:** Watch your resume render live. If content exceeds A4 length, the engine dynamically auto-scales the font and layout to guarantee a perfect single-page fit across all devices.
- **Cloud History Saving:** Sign in securely with Google Auth to auto-save resumes into Firebase Firestore.
- **Direct PDF Download:** Click Download to instantly save your perfectly scaled A4 PDF directly to your device. Powered by `html-to-image` and `jsPDF`, utilizing a flawless mathematical rendering engine stored invisibly in the DOM to prevent clipping and floating-point page bleed on all devices.

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
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📝 License
This project is open-source and available for demonstration or educational purposes.
