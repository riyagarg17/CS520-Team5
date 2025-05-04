import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://cs520-team5:cs520-team5@cluster0.6p9qrjd.mongodb.net/CareCompass';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB CareCompass database');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB; 