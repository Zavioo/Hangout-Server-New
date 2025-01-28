const Massage = require('../models/massageModels')

// exports.createMassageController = async (req, res) => {
//     const { sender, content, ChatId } = req.body
//     try {
//         const newMassage = new Massage({
//             sender, content, ChatId
//         });
//         await newMassage.save();
//         res.status(200).json(newMassage);

//     } catch (error) {
//         console.error(err);
//         res.status(500).json({ message: "Internal Server Error", error: err.message });
//     }

// }