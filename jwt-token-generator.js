import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config.js";

function generateRandomUserId() {
  const timestamp = Date.now().toString(36); // Base36 encoding of current timestamp
  const randomPart = Math.random().toString(36).substr(2, 9); // Generating a random string
  return `user_${timestamp}_${randomPart}`;
}

function generateUuidUserId() {
  return { userId: uuidv4() }; // Generates a standard UUID v4
}

export function generateAuthToken() {
  const user = generateUuidUserId();
  return jwt.sign(user, config.token_secret, { expiresIn: '12h' });
}
