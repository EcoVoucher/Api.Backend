import mongoose from 'mongoose';
const { Schema } = mongoose;

const errorLoginSchema = new Schema({
    ip: { type: String },
    identidade: { type: String },
    date: {
        type: Date,
        default: Date.now
    }
});

const errorLogin = mongoose.model('errorLogin', errorLoginSchema);

export default errorLogin;
