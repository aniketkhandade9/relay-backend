const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let relayCommand = "OFF";
let actualRelayState = "OFF";
let waterStatus = "Inactive";
let lastHardwarePing = 0;

// UI calls to request a change
app.get("/api/relay/on", (req, res) => {
  relayCommand = "ON";
  res.send("Command ON received");
});

app.get("/api/relay/off", (req, res) => {
  relayCommand = "OFF";
  res.send("Command OFF received");
});

// UI polls this to see the accurate hardware status
app.get("/api/relay/status", (req, res) => {
  res.send(actualRelayState);
});

// Hardware polls this to see what the UI wants it to do (Acts as a heartbeat)
app.get("/api/relay/command", (req, res) => {
  lastHardwarePing = Date.now(); // Update heartbeat
  res.send(relayCommand);
});

// UI polls this to check if hardware is reachable
app.get("/api/hardware/status", (req, res) => {
  // If hardware hasn't polled in 5 seconds, it is considered dead/offline.
  const isOnline = (Date.now() - lastHardwarePing) < 5000;
  res.send(isOnline ? "ONLINE" : "OFFLINE");
});

// Hardware calls this to confirm what it actually successfully did locally
app.get("/api/relay/set", (req, res) => {
  lastHardwarePing = Date.now(); // Update heartbeat
  if (req.query.status) {
    actualRelayState = req.query.status;
    relayCommand = req.query.status; // Keep them synced
  }
  res.send(actualRelayState);
});

// Endpoint for hardware to set water status
app.get("/api/water/set", (req, res) => {
  lastHardwarePing = Date.now(); // Update heartbeat
  if (req.query.status) {
    waterStatus = req.query.status;
  }
  res.send(waterStatus);
});

app.get("/api/water/status", (req, res) => {
  res.send(waterStatus);
});

// ⭐ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
