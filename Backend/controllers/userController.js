const Task = require('../models/Task')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

//@desc Get all users (admin only)
//@route GET /api/users
//@access Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: { $in: ['admin', 'member'] }
        }).select('-password')

        const usersWithTasksCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ 
                assignedTo: user._id,
                 status: 'pending'
            })
            const inProgressTasks = await Task.countDocuments({ 
                assignedTo: user._id,
                 status: 'inProgress'
            })
            const completedTasks = await Task.countDocuments({ 
                assignedTo: user._id,
                 status: 'completed'
            })
                   
            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        }))

        res.json(usersWithTasksCounts)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}

//@desc Get user by id (admin only)
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message })
    }
}


module.exports = {
    getUsers,
    getUserById
}