const express = require("express");
const WebSocket = require("ws");

const { startBroadcasting, stopBroadcasting } = require("./broadcast-manager.js");

const app = express();
const port = 5175;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Create a WebSocket server by passing the HTTP server instance of Express
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");
  // Handle incoming messages from the client
  ws.on("message", (message) => {

    if(message.toString('utf8') === "START") {
      console.log("Received START message");
      stopBroadcasting();
      startBroadcasting(ws);
    }
    else if(message.toString('utf8') === "STOP") {
      console.log("Received STOP message");
      stopBroadcasting();
    }

  });

  // Handle connection close
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});
