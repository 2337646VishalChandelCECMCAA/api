const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./models/User');

const baseUrl = 'http://localhost:3000';
const letters = 'abcdefghijklmnopqrstuvwxyz';
const suffix = Array.from(crypto.randomBytes(6), (byte) => letters[byte % 26]).join('');
const name = `Reset${suffix}`;
const tag = Date.now().toString(36).slice(-6);
const email = `reset${tag}@example.com`;
const oldPassword = 'Oldpass123';
const newPassword = 'Newpass123';

async function post(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let data = text;

  try {
    data = JSON.parse(text);
  } catch {
    // keep raw text if it is not JSON
  }

  return { status: response.status, data };
}

async function main() {
  const register = await post('/users/register', {
    name,
    email,
    password: oldPassword
  });

  if (register.status !== 201) {
    throw new Error(`register failed: ${JSON.stringify(register.data)}`);
  }

  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
  await User.updateOne(
    { email },
    { $set: { isOtpVerified: true, otpAttempts: 0 } }
  );
  await mongoose.disconnect();

  const reset = await post('/users/reset-password', {
    email,
    newPassword
  });

  const loginNew = await post('/users/login', {
    email,
    password: newPassword
  });

  const loginOld = await post('/users/login', {
    email,
    password: oldPassword
  });

  console.log(JSON.stringify({
    email,
    register,
    reset,
    loginNew,
    loginOld
  }, null, 2));
}

main().catch(async (error) => {
  try {
    await mongoose.disconnect();
  } catch {}
  console.error(error.message);
  process.exit(1);
});
