import { body } from 'express-validator'

export const registerValidator = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Минимум 5 символа').isLength({ min: 5 }),
	body('name', 'Минимум 3 символа').isLength({ min: 3 }),
	body('avatarUrl', 'Неверный формат ссылки').optional().isURL(),
]
