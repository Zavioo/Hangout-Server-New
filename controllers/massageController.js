const Massage = require('../models/massageModels')

exports.createMassageController = async (req, res) => {
    const { sender, content, ChatId } = req.body
    try {
        const newMassage = new Massage({
            sender, content, ChatId
        });
        await newMassage.save();
        res.status(200).json(newMassage);

    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }

}

exports.fetchAllMeassagesController = async (req,res) => {
    const { id } = req.params;
    const {ChatId} = id; 
    try {
        const allMeassages = await Massage.find(ChatId);
        res.status(200).json(allMeassages);       
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}