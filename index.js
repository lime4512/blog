import express from 'express'
import mongoose from 'mongoose'
import { registerValidator } from './validations/auth.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'

mongoose
	.connect(
		'mongodb+srv://lime451212:tewJLmpVziAlGgRE@cluster0.jsmsosc.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(console.log('DB connect'))
	.catch(err => {
		console.log('DB error', err)
	})

const app = express()

app.use(express.json())

app.post('/login', UserController.login)
app.post('/register', registerValidator, UserController.register)
app.get('/profile', checkAuth, UserController.profile)

app.listen(3001, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Start server....')
})
//tewJLmpVziAlGgRE
