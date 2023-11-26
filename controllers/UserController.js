import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import UserModel from '../models/User.js'

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({
				message: 'Неверная почта',
			})
		}

		const validPassword = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)

		if (!validPassword) {
			return res.status(404).json({
				message: 'Неверный пароль',
			})
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'testSecretWord',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...dataUser } = user._doc

		res.json({
			...dataUser,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Авторизация не прошла успешно!!!',
		})
	}
}

export const register = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const password = req.body.password

		const salt = await bcrypt.genSalt(10)

		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			name: req.body.name,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'testSecretWord',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...dataUser } = user._doc

		res.json({
			...dataUser,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Регистрация не прошла успешно!!!',
		})
	}
}

export const profile = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId)
		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}

		const { passwordHash, ...dataUser } = user._doc

		res.json(dataUser)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Нет доступа',
		})
	}
}
