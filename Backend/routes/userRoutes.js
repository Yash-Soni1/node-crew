const express = require('express')

const { protect, adminOnly } = require('../middlewares/authMiddleware')
const { getUsers, getUserById } = require('../controllers/userController')

const router = express.Router()

// user management routes
router.get('/', protect, adminOnly, getUsers)
router.get('/:id', protect, getUserById)

module.exports = router