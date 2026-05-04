require('dotenv').config();
const Queue = require('bull');

const redisUrl = process.env.REDIS_URL;
const isProd = process.env.NODE_ENV === 'production';
const isLocalRedis = redisUrl && /127\.0\.0\.1|localhost/.test(redisUrl);
const queueEnabled = redisUrl && !(isProd && isLocalRedis);

let emailQueue;
let hasLoggedQueueError = false;

if (queueEnabled) {
	emailQueue = new Queue('emailQueue', redisUrl);
	emailQueue.on('error', (err) => {
		if (!hasLoggedQueueError) {
			console.warn(`⚠️ Email queue unavailable: ${err.message}`);
			hasLoggedQueueError = true;
		}
	});
} else {
	if (isProd && isLocalRedis) {
		console.warn('⚠️ REDIS_URL points to localhost in production, email queue disabled');
	} else {
		console.warn('⚠️ REDIS_URL not set, email queue disabled');
	}
	emailQueue = {
		add: async () => {
			throw new Error('Email queue disabled');
		},
		process: () => {},
		on: () => {}
	};
}

module.exports = emailQueue;