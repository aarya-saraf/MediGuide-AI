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

        await mongoose.connect(uri);
        console.log('Connected to MongoDB for Import');

        const doctors = [];
        const csvFilePath = path.join(__dirname, '../doctor.csv');

        if (!fs.existsSync(csvFilePath)) {
            console.error(`Error: The file ${csvFilePath} does not exist.`);
            process.exit(1);
        }

        console.log('Starting CSV processing...');

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                // Skips empty rows or rows without a name
                if (!row['Name'] || row['Name'].trim() === '') return;

                doctors.push({
                    name: row['Name']?.trim(),
                    degree: row['Degree']?.trim(),
                    specialty: row['Speciality']?.trim() || 'General Physician',
                    experience: row['Years of Experience']?.trim(),
                    location: row['Location']?.trim(),
                    city: row['City']?.trim(),
                    rating: row['DP Score']?.trim(),
                    patientCount: row['NPV Value']?.trim(),
                    fees: row['Consult Fee']?.trim()
                });
            })
            .on('end', async () => {
                console.log(`Processing complete. Found ${doctors.length} valid doctor entries.`);
                
                try {
                    // It's safer to clear existing doctors before re-importing if we want to avoid duplicates
                    // await Doctor.deleteMany();
                    
                    if (doctors.length === 0) {
                        console.error('No doctors found in CSV.');
                        process.exit(1);
                    }

                    // Bulk insert with chunking to avoid issues with large datasets
                    const chunkSize = 500;
                    for (let i = 0; i < doctors.length; i += chunkSize) {
                        const chunk = doctors.slice(i, i + chunkSize);
                        await Doctor.insertMany(chunk);
                        console.log(`Imported ${i + chunk.length} / ${doctors.length} doctors...`);
                    }

                    console.log(`SUCCESS: Successfully added ${doctors.length} doctors to the database!`);
                    process.exit();
                } catch (error) {
                    console.error('Error during database insertion:', error.message);
                    process.exit(1);
                }
            });

    } catch (error) {
        console.error('Error initialising import:', error.message);
        process.exit(1);
    }
};

importDoctors();
