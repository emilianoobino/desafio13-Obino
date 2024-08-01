import mongoose from "mongoose";

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        //required: true
    },
    email: {
        type: String,
        required: true,
        index: true, 
        unique: true 
    },
    password: {
        type: String,
        //required: true
    },
    age: {
        type: Number,
        //required: true
    },

    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
         type: String,
         enum: ['admin', 'usuario', 'premium'],
         default: 'usuario'
    },
    resetToken: {
        token: String,
        expiresAt: Date
    }
});

const UserModel = mongoose.model("user", schema);

export default UserModel; 