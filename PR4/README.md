# Practical Work 4 — Variant 12

This project implements a REST API and a Web Dashboard for a SCADA (Supervisory Control and Data Acquisition) monitoring system. It demonstrates client-server architecture using Node.js and Express.

## Architecture

* **Backend (REST API):**
    * Built with **Node.js** and **Express**.
    * Implements strict endpoints for a single SCADA system rather than a generic collection.
    * Uses the `fs` module for persistent data storage in a local `data/scada.json` file.
* **Frontend (Client Dashboard):**
    * A responsive, dark-themed industrial UI (HTML5/CSS3).
    * Communicates with the server asynchronously via the **Fetch API**.
    * Dynamically renders system stats, connected devices, and alarm logs.

## API Endpoints

* `GET /api/scada` — Retrieves overall SCADA system parameters.
* `GET /api/scada/devices` — Retrieves a list of connected RTU devices and their statuses.
* `GET /api/scada/datapoints` — Retrieves simulated data points.
* `GET /api/scada/alarms` — Retrieves active system alarms based on the current status.
* `POST /api/scada/configure` — Updates the system configuration (e.g., name, sampling rate).
* `PUT /api/scada` — Simulates system state changes (e.g., triggering a critical alarm).

## How to Run

1. Ensure [Node.js](https://nodejs.org/) is installed.
2. Open a terminal in the project directory (`PR4`).
3. Install the required dependencies:
   ```bash
   npm install express
4. Start the server:
   `node server.js`
5. Open your web browser and navigate to: `http://localhost:3000`