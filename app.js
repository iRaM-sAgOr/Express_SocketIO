import express from "express";
import http from "http";
import { initializeSocket } from "./socketservice.js";
import { generateAuthToken } from "./jwt-token-generator.js";
import { config } from "./config.js";

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

app.get("/generate-token", (req, res) => {
  const token = generateAuthToken();

  // Set the JWT as a cookie with Cache-Control header
  // Could be unnecessary.
  res.cookie("authToken", token, {
    httpOnly: true, // Helps prevent XSS attacks by not allowing JS access to the cookie
    maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    sameSite: "Strict", // Helps protect against CSRF attacks
    // secure: true, // Uncomment if using HTTPS
  });

  res.set("Cache-Control", "public, max-age=43200"); // 12 hours in seconds

  res.json({
    message: "Token has been generated and set as a cookie",
    token: token, // Optional: Might not want to send the token in JSON for security reasons
  });
});

// Initialize Socket.IO using the separate module
initializeSocket(server);

const PORT = config.port || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
