// hash-password.js
const bcrypt = require('bcryptjs'); // if you're using Node 18+ with ES modules
// or: const bcrypt = require("bcrypt");  // if using CommonJS

const SALT_ROUNDS = 12; // you can adjust this (10–14 recommended)

async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  console.log(`\nPlain: ${plainPassword}`);
  console.log(`Hashed: ${hash}\n`);
}

// read from CLI argument
const plain = process.argv[2];

if (!plain) {
  console.log("Usage: node hash-password.js <plain_password>");
  process.exit(1);
}

hashPassword(plain);