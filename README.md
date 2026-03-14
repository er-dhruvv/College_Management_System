# 🎓 College Management System (CMS)

A comprehensive, full-stack web application designed to streamline academic and administrative tasks for students and faculty members. Built using the **MERN** stack, this platform provides a centralized hub for attendance tracking, marks management, leave applications, and more.

---

## 🚀 Features

### 👨‍🏫 Faculty Dashboard
*   **Attendance Management**: Mark and track student attendance with ease.
*   **Marks Entry**: Upload and manage internal/external exam marks for various subjects.
*   **Subject Management**: Assign and organize subjects for specific semesters.
*   **Timetable Creation**: Build and update weekly class schedules.
*   **Leave Approval**: Review and approve/reject student leave applications.
*   **Student Directory**: View detailed profiles and academic records of students.

### 👨‍🎓 Student Dashboard
*   **Subject-wise Attendance**: Detailed breakdown of attendance percentage and totals.
*   **Exam Results**: View academic performance and marks history.
*   **Weekly Timetable**: Access real-time class schedules.
*   **Leave Application**: Apply for leaves and track their status online.
*   **Profile Management**: Update personal details and manage profile pictures.

### 🔒 Core Functionalities
*   **Role-Based Access Control (RBAC)**: Secure routes for Students and Faculty.
*   **JWT Authentication**: Secure login system with token-based session management.
*   **File Uploads**: Integrated system for uploading profile pictures using Multer.
*   **Responsive UI**: Optimized for desktops, tablets, and mobile devices using Tailwind CSS.

---

## 🛠️ Tech Stack

**Frontend:**
*   React.js 19
*   Vite (Build Tool)
*   Tailwind CSS (Styling)
*   React Router Dom (Navigation)
*   Axios (API Requests)
*   FontAwesome (Icons)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database)
*   JSON Web Tokens (Authentication)
*   Bcrypt.js (Password Hashing)
*   Multer (File Uploads)

---

## 📂 Project Structure

```text
CMS-PROJECT/
├── Backend/
│   ├── authentication/   # Auth logic (Login, Logout, Session)
│   ├── config/           # Database connection
│   ├── controllers/      # Business logic for routes
│   ├── middleware/       # JWT and Auth guards
│   ├── Models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── ProfilePicture/   # Stored user images
│   └── index.js          # Entry point
│
├── Frontend/
│   ├── src/
│   │   ├── Components/   # Reusable UI elements
│   │   ├── pages/        # Role-specific dashboards and views
│   │   ├── App.jsx       # Main routing configuration
│   │   └── main.jsx      # React entry point
│   └── tailwind.config.js
└── README.md
```

---

## ⚙️ Installation

### 1. Prerequisite
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   npm or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/er-dhruvv/College_Management_System.git
cd College_Management_System
```

### 3. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SecretKey=your_jwt_secret_key
```
Run the backend server:
```bash
node index.js
```

### 4. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🛡️ API Endpoints (Quick Reference)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/login` | User Authentication |
| GET | `/api/students` | Get all students data |
| POST | `/api/marks` | Upload student marks |
| POST | `/LeaveForm` | Submit leave application |
| GET | `/getInfo` | Get current user info |
| PATCH | `/UpdateuserData` | Update profile details |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
*Created with ❤️ by [Dhruv](https://github.com/er-dhruvv)*
