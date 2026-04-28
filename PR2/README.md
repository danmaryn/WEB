# Practical Work 2 — Variant 12

This project implements a monitoring dashboard for an Uninterruptible Power Supply (UPS) system with real-time dynamic data updates.

## Architecture

* **Simulation Module** generates voltage, load, and battery charge values within specified ranges.
* **Logic Module** determines system statuses (`Normal` / `Warning` / `Danger`) and current operating modes (`Grid` / `Battery` / `Bypass`).
* **UI Components** display numerical values, color-coded indicators, and a dynamic oscillation chart using Chart.js.
* **Timer** handles automatic updates every 3 seconds, while a dedicated button allows for manual refreshes.

## How to check

1.  Open `index.html` in a web browser.
2.  Click **UPDATE DATA** to verify immediate value changes and chart updates.
3.  Enable **AUTO UPDATE** to observe continuous real-time data streaming.
4.  Check the status indicators (lines at the bottom of cards) and system mode logic (Grid/Battery/Bypass) based on input voltage and load.