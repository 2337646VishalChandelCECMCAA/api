const baseUrl = 'http://localhost:3000';
const runId = Date.now().toString(36);

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
    // keep raw text if response is not JSON
  }

  return { status: response.status, data };
}

async function runLoginLimiterTest() {
  const attempts = [];

  for (let i = 1; i <= 6; i++) {
    const result = await post('/users/login', {
      email: `rate-limit-${runId}@example.com`,
      password: 'wrong-password'
    });

    attempts.push({
      attempt: i,
      status: result.status,
      body: result.data
    });
  }

  return attempts;
}

async function runOtpLimiterTest() {
  const attempts = [];

  for (let i = 1; i <= 4; i++) {
    const result = await post('/users/forgot-password', {
      email: `otp-limit-${runId}@example.com`
    });

    attempts.push({
      attempt: i,
      status: result.status,
      body: result.data
    });
  }

  return attempts;
}

async function runApiLimiterSmokeTest() {
  const attempts = [];

  for (let i = 1; i <= 3; i++) {
    const suffix = String.fromCharCode(96 + i);
    const result = await post('/users/register', {
      name: `apismoke${suffix}`,
      email: `api-smoke-${i}-${Date.now()}@example.com`,
      password: 'Pass1234'
    });

    attempts.push({
      attempt: i,
      status: result.status,
      body: result.data
    });
  }

  return attempts;
}

async function main() {
  const loginResults = await runLoginLimiterTest();
  const otpResults = await runOtpLimiterTest();
  const apiSmokeResults = await runApiLimiterSmokeTest();

  console.log(JSON.stringify({
    loginResults,
    otpResults,
    apiSmokeResults
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
