# Student CRUD - Full Stack (React + Node.js + MySQL)

A small full-stack project to Create, Read, Update and Delete student records.

## Requirements
- Node.js (18+ recommended)
- MySQL Server
- npm

## 1. Create the database
Open MySQL Workbench or the MySQL terminal and run the SQL in `database/schema.sql`.

## 2. Configure the backend
Open a terminal in the `backend` folder:

```bash
npm install
```

Copy `.env.example` to `.env` and update the MySQL username/password:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_db
```

Start the backend:

```bash
npm run dev
```

The API runs at http://localhost:5000.

## 3. Start the React frontend
Open a second terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173).

## CRUD features
- Add a student
- View all students
- Edit a student
- Delete a student

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

The zip intentionally does not include `node_modules`; run `npm install` in both folders.
