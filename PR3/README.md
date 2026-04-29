# Practical Work 3 — Variant 12

This project is a web application for registering and managing equipment diagnostic protocols (Technical Condition Monitoring). It features a Node.js/Express backend with JSON-based data persistence.

## Architecture

* **Frontend (Client Side):**
    * **HTML5/CSS3:** A professional industrial dark-themed interface with a sidebar and a content grid.
    * **JavaScript (Fetch API):** Handles asynchronous communication with the server (GET, POST, DELETE requests) without page reloads.
* **Backend (Server Side):**
    * **Node.js & Express:** Provides a RESTful API for managing diagnostic records.
    * **File System (fs):** Manages data persistence by reading from and writing to a local `diagnostics.json` file.
* **Data Structure:**
    * Diagnostic records include equipment type, inventory number, substation name, defect history, inspection results, a critical status flag (notifications), and an automatic timestamp.

## How to Run

1.  **Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2.  **Navigate to Project Directory:** Open your terminal and go to the `PR3` folder.
3.  **Install Dependencies:** Run the following command to install the Express framework:
    ```
    npm install express
    ```
4.  **Start the Server:** Execute the server script:
    ```
    node server.js
    ```
5.  **Access the Application:** Open your web browser and navigate to:
    `http://localhost:3000`

## Features

* **Form Submission:** Input equipment details and inspection results.
* **Real-time Archive:** View a dynamically updated list of saved protocols.
* **Critical Alerts:** Records marked as "Critical" are visually highlighted with danger indicators.
* **Data Persistence:** Records remain available even after restarting the server, as they are stored in `data/diagnostics.json`.
* **Record Management:** Easily delete old or incorrect protocols from the archive.