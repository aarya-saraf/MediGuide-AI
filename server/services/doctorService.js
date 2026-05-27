const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let doctors = [];
let isLoaded = false;

const loadDoctors = () => {
    return new Promise((resolve, reject) => {
        if (isLoaded) return resolve(doctors);

        const results = [];
        const csvPath = path.join(__dirname, '../doctor.csv');

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => {
                // Map CSV columns to our internal format
                results.push({
                    id: results.length + 1, // Simple ID based on index
                    name: data.Name,
                    degree: data.Degree,
                    rating: data['DP Score'] || 'N/A',
                    patientCount: data['NPV Value'] || 'N/A',
                    location: data.Location,
                    city: data.City,
                    fees: data['Consult Fee'],
                    experience: data['Years of Experience'],
                    specialty: data.Speciality
                });
            })
            .on('end', () => {
                doctors = results;
                isLoaded = true;
                console.log(`Loaded ${doctors.length} doctors from CSV`);
                resolve(doctors);
            })
            .on('error', (err) => {
                console.error('Error loading doctors CSV:', err);
                reject(err);
            });
    });
};

const getDoctors = async (filters = {}) => {
    if (!isLoaded) await loadDoctors();

    let filtered = [...doctors];
    const { search, specialty, city, limit = 20, page = 1 } = filters;

    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(doc => 
            doc.name.toLowerCase().includes(searchLower) || 
            doc.specialty.toLowerCase().includes(searchLower)
        );
    }

    if (specialty) {
        const specialties = specialty.split(',').map(s => s.trim().toLowerCase());
        filtered = filtered.filter(doc => 
            specialties.some(s => doc.specialty.toLowerCase().includes(s))
        );
    }

    if (city) {
        const cityLower = city.toLowerCase();
        filtered = filtered.filter(doc => 
            doc.city.toLowerCase().includes(cityLower)
        );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + parseInt(limit));

    return {
        doctors: paginated,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
    };
};

const getDoctorById = async (id) => {
    if (!isLoaded) await loadDoctors();
    return doctors.find(doc => doc.id === parseInt(id));
};

module.exports = {
    loadDoctors,
    getDoctors,
    getDoctorById
};

const recommendedFile = path.join(__dirname, '../recommended.json');

const _loadRecommendedIds = () => {
    try {
        if (!fs.existsSync(recommendedFile)) return new Set();
        const raw = fs.readFileSync(recommendedFile, 'utf8');
        const arr = JSON.parse(raw || '[]');
        return new Set(arr.map(id => parseInt(id)));
    } catch (err) {
        console.error('Error loading recommended.json:', err);
        return new Set();
    }
};

const _saveRecommendedIds = (set) => {
    try {
        const arr = Array.from(set.values());
        fs.writeFileSync(recommendedFile, JSON.stringify(arr, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving recommended.json:', err);
    }
};

// Recommend doctors ensuring each doctor is recommended only once (persisted)
// Optionally accept `specialties` array to prefer matching specialists.
const recommendDoctors = async (count = 3, specialties = []) => {
    if (!isLoaded) await loadDoctors();

    const recommended = _loadRecommendedIds();
    let remaining = doctors.filter(d => !recommended.has(d.id));

    // If specialties provided, try to prioritize doctors matching them
    let prioritized = [];
    if (specialties && specialties.length > 0) {
        const prefs = specialties.map(s => s.trim().toLowerCase());
        prioritized = remaining.filter(d => {
            if (!d.specialty) return false;
            const spec = d.specialty.toLowerCase();
            return prefs.some(p => spec.includes(p));
        });
    }

    // If we've recommended everyone already, reset the list (start over)
    if (remaining.length === 0) {
        recommended.clear();
        remaining = [...doctors];
    }

    // Build pool: prioritized first, then others
    let pool = [];
    const prioritizedSet = new Set(prioritized.map(d => d.id));
    pool = prioritized.concat(remaining.filter(d => !prioritizedSet.has(d.id)));

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const picked = pool.slice(0, count).map(d => d);
    picked.forEach(d => recommended.add(d.id));
    _saveRecommendedIds(recommended);

    return picked;
};

module.exports.recommendDoctors = recommendDoctors;
