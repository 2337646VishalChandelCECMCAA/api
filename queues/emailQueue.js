require('dotenv').config();
const Queue = require('bull');

const redisUrl = process.env.REDIS_URL;

let emailQueue;

if (redisUrl) {
	emailQueue = new Queue('emailQueue', redisUrl);
	emailQueue.on('error', (err) => {
		console.warn(`⚠️ Email queue unavailable: ${err.message}`);
	});
} else {
	console.warn('⚠️ REDIS_URL not set, email queue disabled');
	emailQueue = {
		add: async () => {
			throw new Error('Email queue disabled: REDIS_URL not set');
		},
		process: () => {},
		on: () => {}
	};
}

module.exports = emailQueue;