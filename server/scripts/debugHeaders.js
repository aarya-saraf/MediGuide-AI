const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Doctor = require('../models/Doctor');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const importDoctors = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) throw new Error('MongoDB URI not found in .env');

        const csvFilePath = path.join(__dirname, '../doctor.csv');

        if (!fs.existsSync(csvFilePath)) {
            console.error(`Error: The file ${csvFilePath} does not exist. Please name your file 'doctor.csv' and place it in the 'server' folder.`);
            process.exit(1);
        }

        let firstRowCaptured = false;

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                if (!firstRowCaptured) {
                    console.log('--- DEBUG: FIRST ROW DETECTED ---');
                    console.log('Keys:', Object.keys(row));
                    console.log('Row object:', JSON.stringify(row, null, 2));
                    firstRowCaptured = true;
                    process.exit(0); // Exit early since we just want the headers
                }
            })
            .on('end', () => {
                process.exit();
            });

    } catch (error) {
        console.error('Error debugging headers:', error.message);
        process.exit(1);
    }
};

importDoctors();
