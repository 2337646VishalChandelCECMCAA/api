const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			match: /^[A-Za-z]+$/
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			sparse: true
		},
		password: {
			type: String,
			required: true,
			minlength: 6
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user"
		},
		otp: String,
		otpExpires: Date,

		otpAttempts: {
			type: Number,
			default: 0
		},
		isOtpVerified: {
			type: Boolean,
			default: false
		}
	},

	{
		timestamps: true
	}
);

module.exports = mongoose.model('User', userSchema);
