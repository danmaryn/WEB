# Practical Work 6 — Variant 12

This project implements a Secure Energy Monitoring Application for an Industrial Enterprise, focusing on web application security best practices.

## Architecture & Technologies

* **Backend (Server):**
    * Built with **Node.js** and **Express**.
    * **Authentication:** Uses `passport` and `passport-local` with `express-session` for stateful user sessions.
    * **Password Security:** Employs `bcrypt` for secure password hashing before storing user data.
    * **Security Headers:** Integrated `helmet` to protect against well-known web vulnerabilities.
    * **Brute-Force Protection:** Uses `express-rate-limit` to restrict repeated failed login attempts.
    * **Data Sanitization:** Uses `express-validator` to validate and escape user inputs, preventing XSS and injection attacks.
* **Frontend (Client Dashboard):**
    * Custom **Industrial Dark Theme** built with HTML5 and CSS3.
    * Fetch API for asynchronous secure REST calls.
    * Dynamic UI that adapts to the authenticated user's role.

## Features

* **Role-Based Access Control (RBAC):** Three distinct roles (`energy_manager`, `technologist`, `ceo`) with strictly enforced API access.
* **Secure Registration & Login:** Encrypted passwords and protected session cookies.
* **Live API Console:** Built-in UI terminal to monitor server responses (e.g., `200 OK` vs `403 Forbidden`).

## How to Run

1. Ensure [Node.js](https://nodejs.org/) is installed on your machine.
2. Open a terminal and navigate to the project directory (`PR6`).
3. Install the required security dependencies:
   `npm install express express-session passport passport-local bcrypt helmet cors express-rate-limit express-validator`
4. Start the server:
   `node server.js`
5. Open your web browser and navigate to: `http://localhost:3000`