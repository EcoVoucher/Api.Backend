import mongoose from 'mongoose';
import {config} from 'dotenv';
config();

const {MONGODB_URI} = process.env;

if(!MONGODB_URI) {
    throw new Error(
        'Por favor, defina a variável de ambiente MONGODB_URI dentro do arquivo .env'
    )
}

async function connectDatabase() {
    mongoose.connect(MONGODB_URI);
    return mongoose.connection;
}

export default connectDatabase;
