# 🌿 Farm El Baya

A premium, multi-language digital experience for **Farm El Baya**, a serene agro-tourism destination. This website showcases the farm's unique blend of nature, hospitality, and artisanal craftsmanship.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?logo=framer)](https://www.framer.com/motion/)

---

## ✨ Features

- **🌍 Internationalization (i18n)**: Full support for English and French using `next-intl`.
- **🏗️ The Forge**: A dedicated section and waitlist system for our artisanal workshop.
- **📅 Smart Booking**: Integrated booking request system with email notifications via Nodemailer.
- **🎨 Premium UI**: 
  - Fluid animations with **Framer Motion**.
  - Modern typography and color palettes.
  - Fully responsive, glassmorphic design.
  - Interactive photo grids and reveal animations.
- **🚀 Performance**: Built with Next.js 15 App Router for optimal speed and SEO.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **I18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/oussamakou/elbaya.git
   cd elbaya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your email configuration:
   ```env
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-app-password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

- `app/`: Next.js App Router (pages and API routes).
- `components/`: Reusable UI components and page sections.
- `content/`: Static content and JSON data for different languages.
- `messages/`: Translation files (EN/FR).
- `assets/`: Image assets and static resources.
- `i18n/`: Internationalization configuration.

---

## 📜 License

This project is private and proprietary. All rights reserved by **Farm El Baya**.

---

Developed with ❤️ by [Antigravity](https://github.com/google-deepmind/antigravity)
