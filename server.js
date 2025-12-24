const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let relayState = "OFF";

app.get("/api/relay/on", (req, res) => {
  relayState = "ON";
  res.send("ON");
});

app.get("/api/relay/off", (req, res) => {
  relayState = "OFF";
  res.send("OFF");
});

app.get("/api/relay/status", (req, res) => {
  res.send(relayState);
});

// ⭐ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
