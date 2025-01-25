const mongoose = require('mongoose');
const users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// registers
exports.registerController = async (req, res) => {
    console.log(req.body);
    const { username, name, email, password } = req.body
    console.log(username, name, email, password);
    try {
        const existingUserName = await users.findOne({ username })
        const existingUser = await users.findOne({ email })
        if (existingUser || existingUserName) {
            res.status(406).json("You are already registered , Try Diffrent Username or Email ")
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const newUser = new users({
                username, name, email, password: hashPassword, profilePic: "user.jpg", about: ""
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        console.log(error);
    }
}

//login

exports.loginController = async (req, res) => {
    console.log("Inside login Controller");
    const { email, password } = req.body

    try {
        existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWTPASSWORD)
            // console.log(token);
            const isMatch = await bcrypt.compareSync(password, existingUser.password)
            if (isMatch) {
                res.status(200).json({
                    user: existingUser, token
                })
            } else {
                res.status(404).json("Incorrect Password")
            }
        } else {
            res.status(404).json("Incorrect Email or Password!!!")
        }
    } catch (error) {
        console.log(error);
    }
}

// profile updation
exports.editUserController = async (req, res) => {
    console.log("Inside editUserController");
    const { username, name, email, password, profilePic, about } = req.body
    const uploadProfilePic = req.file ? req.file.filename : profilePic

    const userId = req.userId

    console.log(username, name, email, password, about, uploadProfilePic, userId);

    try {
        const updateUser = await users.findByIdAndUpdate({ _id: userId }, {
            username, name, email, password, profilePic: uploadProfilePic, about
        }, { new: true })
        await updateUser.save()
        res.status(200).json(updateUser)

    } catch (err) {
        res.status(401).json(err)
    }

}

exports.updateFriendsController = async (req, res) => {
    console.log('Inside updateFriendsController');
    const { id } = req.params; // Current User's ID
    const { userId } = req.body; // User ID to add/remove
    console.log('Current User Id:', id);
    console.log('User Id to add/remove:', userId);

    try {

        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        // Find the current user by their ID
        const user = await users.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        // Check if the user is already friends with the target user
        const isFriends = user.friends.some((friend) => friend.equals(userIdObjectId));
        console.log('Is Friends:', isFriends);

        if (isFriends) {
            // Remove the user from friends
            user.friends = user.friends.filter((friend) => !friend.equals(userIdObjectId));
        } else {
            // Add the user to friends
            user.friends.push(userIdObjectId);
        }

        // Save the updated user
        const updatedUserFriends = await user.save();
        res.status(200).json(updatedUserFriends);
    } catch (err) {
        console.error('Error updating friends:', err.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// to get friends list 
exports.getFriendsController = async (req, res) => {
    const { id } = req.params; // Current User's ID
    try {
        const user = await users.findById(id).populate('friends')
        res.status(200).json(user.friends);
    } catch (err) {
        console.error(err);
        res.status(401).json(err);
    }
}

// to get users List 
exports.getAllUsers = async (req, res) => {
    const searchKey = req.query.search
    console.log(searchKey);
    const query = {
        name: {
            $regex: searchKey, $options: 'i'
        }
    }
    try {
        const usersList = await users.find(query)
        res.status(200).json(usersList)
    } catch (err) {
        console.error(err);
        res.status(401).json(err);
    }

}
