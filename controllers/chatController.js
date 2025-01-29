const Chats = require('../models/chatModels')


exports.openChatController = async (req, res) => {
    const { id } = req.params; // Fixed typo here
    const { userId } = req.body;

    console.log(`currentUser Id: ${id}, userId: ${userId}`);

    try {
        // Find chat where both users are present
        const isChat = await Chats.findOne({
            $and: [
                { users: { $elemMatch: { $eq: id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        }).populate("users", "_id");
        console.log(isChat);

        if (isChat) {
            // If chat exists, return it
            res.status(200).json(isChat);
        } else {
            // Create a new chat
            const newChat = new Chats({
                users: [id, userId] // Create an array of users
            });
            await newChat.save();
            res.status(200).json(newChat); // Use 201 for created resource
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};