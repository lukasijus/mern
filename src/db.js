const mongoose = require('mongoose');

const database = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        await mongoose.connect(database, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        console.log('Database Connected...')
    } catch (error) {
        throw new Error('Can not connect to the database!');
    }
}

module.exports = connectDB