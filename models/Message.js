import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });  

const Message = mongoose.model('Message', messageSchema);

export default Message;
