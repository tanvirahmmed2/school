# 🏫 School & Coaching Management System

A modern, responsive, and full-featured **School & Institution Management Portal** built using **Next.js (App Router)**, **Tailwind CSS**, and **PostgreSQL**. The platform supports multiple distinct user portals (Admin, Teacher, Student, and Staff) with complete role-based authorization, database-backed dashboard metrics, interactive roll call registers, grade sheets, fee systems, and co-curricular club memberships.

---

## 🏗️ Project Architecture & Tech Stack

### Frontend & Core
* **Framework**: [Next.js](https://nextjs.org/) (App Router & Server Actions / Route Handlers)
* **React Engine**: [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS variables
* **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Feather & Flat icons)
* **Toasters**: `react-hot-toast` for micro-animations and status updates

### Backend & Databases
* **Server**: Next.js Route Handlers (RESTful APIs)
* **Database**: [PostgreSQL](https://www.postgresql.org/) with raw SQL query pools (`pg` client)
* **Authentication**: JSON Web Token (JWT) with HTTP-only cookies
* **Security & Password Hashing**: `bcryptjs` for secure teacher/student/admin credentials hashing

---

## 🔐 Core Portals & Key Features

### 👤 1. Admin Portal (`/admin`)
* **Access Control**: Super admin page to manage system settings, notices, and announcements.
* **Class & Curriculum Management**: Set up classes, section capacities, timetables, and subjects.
* **Account Provisioning**: Form triggers to create, approve, and toggle status of teachers, staff, and student admissions.
* **Financial Oversight**: Allocate monthly salary slips and record incoming invoices and tuition fees.
* **Exams & Grading**: Configure term schedules, publish GPAs, and generate student transcripts.

### 👩‍🏫 2. Teacher Portal (`/teacher`)
* **Responsive Dashboard**: Summary statistics of active teaching subjects, total student capacity, leave records, and received salaries.
* **Class Schedule**: Weekday-filterable daily timetable reflecting timing schedules and assigned classrooms.
* **Student Attendance Registry**: Multi-class and section roll call interface allowing daily submissions (Present, Absent, Late, Half Day) with remarks.
* **Marks Evaluation**: Batched marks entry ledger for student exams, mapping percentage thresholds.
* **Leaves Management**: Self-apply portal for Casual, Medical, or Duty leaves with status tracking (Pending, Approved, Rejected).
* **Financial Records**: View monthly salary ledgers and paid/pending billing slips.
* **Teacher Profile**: Official credentials, designations, and contact cards.

### 👨‍🎓 3. Student Portal (`/student`)
* **Student Dashboard**: Welcome banner displaying active academic information alongside subjects, co-curricular club counts, and attendance ratings.
* **Class Routine**: Responsive day-by-day class routine cards.
* **Attendance Registry**: Visual representation of logs indicating present rates, absences, and late tallies.
* **Coursework & Syllabus**: List assigned class subjects with associated teachers, including direct PDF download links for curriculums.
* **Exam routines**: Chronological view of exams, timing structures, and locations.
* **Report Cards**: Grade cards highlighting cumulative term GPAs and letter grades (A+, A-, F).
* **Ledgers & Fines**: Detail listing of outstanding tuition bills and late penalties.
* **Clubs Hub**: Directory of school clubs, allowing students to dynamically join/leave clubs with real-time membership state tracking.

---

## 📁 Repository Structure

```
├── .next/                  # Built Next.js output
├── public/                 # Static asset resources
├── scripts/                # Database seed and table setup scripts
│   ├── setup-db-tables.js  # Main tables (classes, students, attendance, fees)
│   ├── setup-clubs.js      # Clubs and co-curricular tables
│   └── setup-results.js    # Exam routines, marks, and GPA tables
└── src/
    ├── app/                # App Router Page Views & API Handler Directories
    │   ├── (admin)/        # Admin dashboard layouts & page routes
    │   ├── (auth)/         # Login portals (Admin, Teacher, Student, Staff)
    │   ├── (student)/      # Student portal layout, dashboard, and routine views
    │   ├── (teacher)/      # Teacher portal layout, roll call registry, and leaves
    │   ├── (home)/         # Public landing pages (Noticeboard, Contact, Facilities)
    │   └── api/            # API Route Handlers (REST controllers)
    ├── component/          # Shared layout frames & bars
    │   ├── bars/           # Responsive Navbar & Sidebar components for all portals
    │   └── helper/         # Context providers & wrappers
    └── lib/                # Shared utilities
        ├── auth.js         # JWT signing/verification & password hashing helpers
        ├── db.js           # PostgreSQL query pools
        └── secret.js       # Secret variables loadout
```

---

## 🛠️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd school
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PG_USER=your_postgres_user
   PG_PASSWORD=your_postgres_password
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=school_db
   JWT_SECRET=your_jwt_secret
   ```

4. **Initialize Database Tables**:
   Run the initial setup scripts:
   ```bash
   node scripts/setup-db-tables.js
   node scripts/setup-clubs-tables.js
   node scripts/setup-results-tables.js
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Production Build Compilation**:
   Verify everything compiles:
   ```bash
   npm run build
   ```
