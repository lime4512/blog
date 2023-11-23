import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

import { registerValidator } from './validations/auth.js'
import { validationResult } from 'express-validator'

import UserModel from './models/User.js'

mongoose
	.connect(
		'mongodb+srv://lime451212:dKSsfIoKfQbSztFa@cluster0.jsmsosc.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(console.log('DB connect'))
	.catch(err => {
		console.log('DB error', err)
	})

const app = express()

app.use(express.json())

app.post('/register', registerValidator, async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array())
	}

	const password = req.body.password

	const salt = await bcrypt.genSalt(10)

	const passwordHash = await bcrypt.hash(password, salt)

	const doc = new UserModel({
		email: req.body.email,
		name: req.body.name,
		avatarUrl: req.body.avatarUrl,
		passwordHash,
	})

	const user = await doc.save()
	res.json(user)
})

app.listen(3001, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Start server....')
})
