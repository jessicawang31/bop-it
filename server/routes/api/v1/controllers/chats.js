import express from 'express';
const router = express.Router();

// POST method endpoint to add a new message in 
router.post('/messages', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({
            error: 'you are not logged in, please login!'
        });
    }
    try {
        const { newChat } = req.body;
        if(!newChat){
            return res.status(400).json({
                error: 'the chat message cannot be empty.'
            });
        }
        const chatMessage = new req.models.ChatBox({
            username: req.session.account.username,
            message: newChat,  
            timestamp: new Date()
        });

        await chatMessage.save();
        res.json({ "status": "success" });

    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: 'Failed to post chat message' });
    }
})

// GET method endpoint for retrieving all chat messages 
router.get('/messages', async (req, res) => {
    try {
        const messages = await req.models.ChatBox.find().sort({ timestamp: 1 });    // the sort() will essure we recieve chats chronologically
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat messages' });
    }
})

// DELETE method endpoint for deleting chat message (only if its from this curr user)
router.delete('/messages', async (req, res) => {
    if(!req.sessions.isAuthenticated){
        return res.status(401).json({
            error: 'you are not logged in, please login!'
        });
    }
    try {
        const { messageId } = req.body;

        const message = await req.models.ChatBox.findById(messageId);
        if (!message) {
            return res.status(404).json({ 
                error: 'the message was not found' 
            });
        }
        if (message.username !== req.session.account.username) {
            return res.status(403).json({ 
                error: 'you can only delete your own messages' 
            });
        }
        await req.models.ChatBox.findByIdAndDelete(messageId);
        res.json({ 
            message: 'the chat was successfully deleted' 
        });
    } catch(error){
        res.status(500).json({ error: 'Failed to delete chat message' });
    }
})
export default router;