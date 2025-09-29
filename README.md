# 📚 EduConnect - Full-Stack Educational Platform

EduConnect is a comprehensive web platform designed to streamline communication and enhance collaboration between students, teachers, and administrators in an academic environment. It provides role-based dashboards, secure authentication, and features for managing academic interactions.

## 🚀 Live Demo

* **Frontend (Live Website):** [https://educonnect-frontend-lewk.onrender.com](https://educonnect-frontend-lewk.onrender.com)
* **Backend (API Server):** [https://educonnect-backend-e3wl.onrender.com](https://educonnect-backend-e3wl.onrender.com)

---

## ✨ Features

* **Role-Based Authentication:** Secure signup and login for three distinct user roles: **Student**, **Teacher**, and **Admin**.
* **User Dashboards:** Dedicated and functional dashboards for each user role.
* **Profile Management:** Users can view and update their profile information, including their name, email, and avatar.
* **Secure API:** Backend API secured with JWT (JSON Web Tokens) for access and refresh tokens.
* **Cloudinary Integration:** Seamless avatar and image uploads handled via Multer and stored on Cloudinary.
* **Dynamic Content:** User details (like department name) are fetched dynamically from the database.
* **Feedback System:** A full-stack feature allowing logged-in users to submit feedback which is saved to the database.
* **Responsive Design:** The entire user interface is designed to be fully responsive and accessible on all devices, from mobile phones to desktops.

---

## 🛠️ Tech Stack

#### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (jsonwebtoken), bcryptjs
* **File Uploads:** Multer, Cloudinary

#### Frontend
* **Core:** HTML5, CSS3, Vanilla JavaScript
* **Styling:** Tailwind CSS
* **API Communication:** Axios

#### Deployment
* **Platform:** Render
* **Services:** Web Service (Backend) & Static Site (Frontend)
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

The project is a monorepo containing two main folders:

* `/frontend`: Contains all the client-side static files (HTML, CSS, JS, images).
* `/backend`: Contains the Node.js/Express server, API routes, controllers, and database models.

---

## 🏁 Getting Started (Local Setup)

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v18 or higher)
* npm (or another package manager)
* MongoDB (either a local instance or a free Atlas account)
* Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Chandan785/Edu-nnect.git .
    cd Edu-nnect
    ```

2.  **Set up the Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` folder and add the following variables. **Do not include quotes.**

    ```env
    # --- .env file for backend ---

    # Server Port
    PORT=3000

    # MongoDB Connection String (from MongoDB Atlas)
    MONGODB_URI=your_mongodb_connection_string

    # CORS Origin for local frontend (adjust port if needed)
    CORS_ORIGIN=[http://127.0.0.1:5500](http://127.0.0.1:5500)

    # JWT Secrets (generate your own random strings)
    ACCESS_TOKEN_SECRET=your-access-token-secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your-refresh-token-secret
    REFRESH_TOKEN_EXPIRY=10d

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

3.  **Run the Backend Server:**
    ```bash
    npm start
    ```
    Your backend API should now be running on `http://localhost:3000`.

4.  **Set up the Frontend:**
    * There are no dependencies to install for the frontend.
    * The easiest way to run it is with a live server extension. For example, if you use VS Code, you can install the "Live Server" extension.
    * Right-click on the `frontend/index.html` file and choose "Open with Live Server". This will open the website, usually on a port like `5500`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the issues page if you want to contribute.

## 🔗 Explore site  
[🌟 Click here to explore Educonnect website ](https://educonnect-frontend-lewk.onrender.com/)

## 📝 License

This project is licensed under the MIT License.
