# 💰 The Ledger

> A modern personal finance tracker built with React and Supabase.  
> Focused on clean UI, practical security, and real-world full-stack development.

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

## ✨ Overview

The Ledger is a full-stack finance tracking application where users can securely manage income and expenses, analyse spending habits, and visualise financial data through interactive charts.

I built this project to move beyond tutorial-style CRUD apps and get hands-on experience with real backend integration, authentication systems, database policies, and production-oriented security practices.

The goal was not just to make something functional, but to understand how modern applications behave with real users and real data. Which mostly meant spending unhealthy amounts of time staring at Supabase policies wondering why one missing condition broke the entire application.

---

## 🚀 Features

### 🔐 Authentication & Access Control

- Email/password authentication with Supabase Auth
- Persistent login sessions with automatic refresh
- Password strength validation during signup
- Role-based access system (`user` / `admin`)

### 💸 Transaction Management

- Add and delete income/expense transactions
- Categorise transactions for easier tracking
- Real-time balance calculations
- Combined filtering by type and category
- Smooth animations for adding/removing entries

### 📊 Analytics Dashboard

- Monthly income vs expense visualisation
- Expense breakdown by category
- Responsive charts built with Recharts

### 🛡️ Security-Focused Design

- Row Level Security (RLS) enabled on all tables
- Database-level validation using PostgreSQL `CHECK` constraints
- Admin-only actions enforced server-side
- Sanitised and validated inputs before database operations
- Secure environment variable handling

---

## 🧠 Security Highlights

Security was treated as part of the architecture rather than something added at the end for decoration.

### Database Security

- RLS policies using `auth.uid()`
- Admin-only delete permissions enforced at database level
- Strict validation constraints on:
  - transaction amount
  - transaction type
  - category values
  - description length

### Supabase Hardening

- Fixed mutable `search_path` vulnerability in `handle_new_user()`
- Restricted `EXECUTE` permissions on `SECURITY DEFINER` functions

### Credential Hygiene

- `.env` excluded using `.gitignore`
- Removed exposed secrets from git history using `git filter-repo`
- Only public `anon` keys used client-side

### Input Validation

- Client-side sanitisation and bounds checking
- Password complexity enforcement
- Sensitive React state cleared on logout

---

## 🛠️ Tech Stack

| Layer          | Technology      |
| -------------- | --------------- |
| Frontend       | React 19 + Vite |
| Backend        | Supabase        |
| Database       | PostgreSQL      |
| Authentication | Supabase Auth   |
| Charts         | Recharts        |
| Styling        | Custom CSS      |

---

## 🗂️ Database Schema

### `transactions`

| Column      | Type                 |
| ----------- | -------------------- |
| id          | uuid                 |
| description | text                 |
| amount      | numeric              |
| type        | `income` / `expense` |
| category    | text                 |
| user_id     | uuid                 |
| created_at  | timestamp            |

### `profiles`

| Column | Type             |
| ------ | ---------------- |
| id     | uuid             |
| email  | text             |
| role   | `user` / `admin` |

---

## 📁 Project Structure

```txt
src/
├── App.jsx
├── main.jsx
├── supabaseClient.js
└── assets/
```

---

## ⚙️ Running the Project Locally

If you want to try the project yourself or explore the codebase, you can get everything running locally in a few minutes.

### What You'll Need

- Node.js 20+
- A Supabase project (the free tier works perfectly fine)

### Setup

Clone the repository:

```bash
git clone https://github.com/DrRat1o/Finance-Tracker.git
cd Finance-Tracker
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Start the development server:

```bash
npm run dev
```

Once the server starts, the app should be available locally in your browser.

Because nothing says “modern web development” like opening localhost and praying the dependency tree survives another day.

---

## 🧪 Current Limitations

The project is still actively being improved, so there are a few things that are intentionally simple for now:

- Transactions cannot be edited yet
- Admin roles are assigned manually
- Budgeting and savings goals are not implemented yet
- Password rules rely partly on client-side validation on the free Supabase tier

I wanted to focus first on building a stable and secure core before adding larger quality-of-life features.

---

## 🌱 Future Goals

Some things I’d like to add next:

- [ ] Transaction editing
- [ ] Budget tracking & spending alerts
- [ ] CSV export support
- [ ] Dark mode
- [ ] Better mobile responsiveness
- [ ] Public deployment with a live demo
- [ ] More detailed analytics and trends

Like every software project ever created, the feature list grows faster than the free time available to build it.

---

## 📚 What I Learned

This project helped me get practical experience with:

- Building full-stack React applications
- Working with PostgreSQL and Supabase
- Writing and debugging RLS policies
- Understanding the difference between client-side and server-side security
- Managing credentials and deployment hygiene properly
- Building around real backend constraints instead of mock data

More than anything, it helped me understand how much work happens outside the visible UI. Most bugs were not “React problems.” They were database policies, auth flows, validation edge cases, or me discovering new and inventive ways to break my own app.

---

## 🤝 Contributing

Contributions, suggestions, and feedback are always welcome.

If you spot a bug, have an idea for improvement, or want to improve the security side further, feel free to open an issue or submit a pull request.

---

## 📄 License

Open source and free to use.
