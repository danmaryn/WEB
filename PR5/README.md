# Practical Work 5 — Variant 12

This project implements a Real-Time SCADA Dashboard using WebSockets. It demonstrates continuous, bi-directional client-server communication with live data visualization using interactive maps and charts.

## Architecture & Technologies

* **Backend (Server):**
    * Built with **Node.js** and **Express**.
    * Uses the `ws` library to establish a WebSocket server for real-time data broadcasting.
    * Generates and pushes simulated SCADA telemetry (system load, frequency, device statuses) to all connected clients every 2 seconds.
* **Frontend (Client Dashboard):**
    * **WebSockets API:** Maintains a persistent connection with the server, featuring auto-reconnection logic.
    * **Leaflet.js:** Renders an interactive geographical map (dark theme) displaying connected substations. Markers dynamically change color based on real-time device statuses (Normal, Warning, Critical).
    * **Chart.js:** Visualizes the overall system load on a live, continuously updating line chart.
    * **HTML5/CSS3:** A responsive, dark-themed industrial UI.

## Features

* **Real-Time Telemetry:** No manual refreshing required; data is pushed instantly from the server.
* **Live Map Tracking:** Geographical visualization of RTU controllers with status-based color coding.
* **Dynamic Charting:** Smooth, rolling line charts for power load monitoring.
* **Connection Status:** Visual indicators showing whether the WebSocket connection is active or disconnected.

## How to Run

1. Ensure [Node.js](https://nodejs.org/) is installed on your machine.
2. Open a terminal and navigate to the project directory (`PR5`).
3. Install the required dependencies:
   ```bash
   npm install express ws
4. Start the server:
   `node server.js`
5. Open your web browser and navigate to: `http://localhost:3000`