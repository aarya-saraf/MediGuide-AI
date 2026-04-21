const mongoose = require('mongoose');
require('dotenv').config();

const testConnect = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error('FAIL');
        console.error(JSON.stringify(err, null, 2));
        process.exit(1);
    }
};

testConnect();
