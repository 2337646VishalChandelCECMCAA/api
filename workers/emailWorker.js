const emailQueue = require('../queues/emailQueue');
const sendEmail = require('../utils/sendEmail');

emailQueue.on('failed', (job, err) => {
  console.error(`Email job ${job.id} failed:`, err.message);
});

emailQueue.process(async (job) => {
  const { email, otp } = job.data;

  console.log(`Sending OTP email to ${email}`);
  await sendEmail(email, "OTP", `Your OTP is ${otp}`);
});