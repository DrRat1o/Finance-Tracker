# 💰 The Ledger

> A simple personal finance tracker built with React and Supabase.

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

## ✨ About The Project

The Ledger is a full-stack finance tracking application where users can add income and expense transactions, track their balance, and view spending analytics.

I built this project to learn how frontend applications connect to a real backend and database. Most of my earlier projects only used localStorage or mock data, so I wanted to work with authentication, databases, and proper user access for the first time.

A lot of this project was also me learning by breaking things repeatedly and then trying to understand why they broke. Which, apparently, is just software development.

---

## 🚀 Features

### 🔐 Authentication

- Sign up and login using Supabase Auth
- Persistent user sessions
- Password strength validation during signup
- Simple role-based access (`user` / `admin`)

### 💸 Transactions

- Add income and expense transactions
- Delete transactions
- Categorise transactions
- Real-time balance calculation
- Filter by category and type

### 📊 Analytics

- Monthly income vs expense chart
- Expense breakdown by category
- Charts built using Recharts

### 🛡️ Security

- Row Level Security (RLS) enabled on database tables
- Database validation using PostgreSQL constraints
- Users can only access their own data
- Secure handling of environment variables
- Input validation before database operations

---

## 🛠️ Tech Stack

| Layer          | Technology    |
| -------------- | ------------- |
| Frontend       | React + Vite  |
| Backend        | Supabase      |
| Database       | PostgreSQL    |
| Authentication | Supabase Auth |
| Charts         | Recharts      |
| Styling        | CSS           |

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

## ⚙️ Running the Project

### Requirements

- Node.js 20+
- A Supabase project

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

Create your `.env` file:

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

The app should now run locally in your browser.

---

## 🗂️ Database Tables

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

## 🌱 Future Improvements

Things I would like to add later:

- [ ] Transaction editing
- [ ] Budget tracking
- [ ] CSV export
- [ ] Dark mode
- [ ] Better mobile responsiveness
- [ ] Public deployment

The list keeps growing faster than my ability to finish it, which seems to be a common programming experience.

---

## 📚 What I Learned

This project helped me learn:

- How to connect React with a real backend
- How authentication works in full-stack apps
- Basics of PostgreSQL and database security
- The difference between client-side and server-side validation
- How Row Level Security works in Supabase
- Better project structure and state management

It also taught me that database policies can break your app in extremely creative ways.

---

## 🤝 Contributing

Suggestions, feedback, and improvements are welcome.

If you notice bugs or have ideas for improvements, feel free to open an issue or submit a pull request.

---

## 📄 License

Open source and free to use.
