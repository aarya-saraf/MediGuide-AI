import React from 'react';
import { User, MapPin, Star, Calendar, Clock } from 'lucide-react';
import Button from './ui/Button';
import Link from 'next/link';

// Mock Doctor Database - Expanded for better recommendations
const doctorsData = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", experience: "15 years", rating: 4.9, location: "Heart Care Institute", available: true, image: "heart" },
    { id: 2, name: "Dr. Michael Chen", specialty: "Endocrinologist", experience: "10 years", rating: 4.8, location: "City Diabetes Center", available: true, image: "diabetes" },
    { id: 3, name: "Dr. Emily Davis", specialty: "Neurologist", experience: "12 years", rating: 4.9, location: "Brain & Nerve Clinic", available: true, image: "brain" },
    { id: 4, name: "Dr. Robert Wilson", specialty: "General Physician", experience: "20 years", rating: 4.7, location: "Family Health Clinic", available: true, image: "general" },
    { id: 5, name: "Dr. Linda Martinez", specialty: "Nutritionist", experience: "8 years", rating: 4.8, location: "Wellness Hub", available: true, image: "nutrition" },
    { id: 6, name: "Dr. James Thompson", specialty: "Pulmonologist", experience: "14 years", rating: 4.8, location: "Respiratory Care Center", available: true, image: "lungs" },
    { id: 7, name: "Dr. Priya Sharma", specialty: "Dermatologist", experience: "9 years", rating: 4.7, location: "Skin Health Clinic", available: true, image: "skin" },
    { id: 8, name: "Dr. David Kim", specialty: "Orthopedic Surgeon", experience: "18 years", rating: 4.9, location: "Bone & Joint Hospital", available: true, image: "bone" },
    { id: 9, name: "Dr. Amanda Foster", specialty: "Psychiatrist", experience: "11 years", rating: 4.8, location: "Mental Wellness Center", available: true, image: "mental" },
    { id: 10, name: "Dr. Richard Lee", specialty: "Gastroenterologist", experience: "16 years", rating: 4.7, location: "Digestive Health Institute", available: true, image: "stomach" },
    { id: 11, name: "Dr. Maria Garcia", specialty: "General Physician", experience: "12 years", rating: 4.6, location: "Community Health Center", available: true, image: "general" },
    { id: 12, name: "Dr. John Parker", specialty: "Cardiologist", experience: "22 years", rating: 4.9, location: "Advanced Heart Care", available: true, image: "heart" },
];

const DoctorRecommendation = ({ risks }) => {
    // Logic to find relevant specialists based on high/medium risks
    const getRecommendedSpecialties = (riskList) => {
        const specialties = new Set();
        riskList.forEach(risk => {
            const condition = risk.condition.toLowerCase();
            if (condition.includes('diabetes') || condition.includes('thyroid') || condition.includes('metabolic')) specialties.add('Endocrinologist');
            else if (condition.includes('heart') || condition.includes('blood pressure') || condition.includes('hypertension') || condition.includes('cardiovascular')) specialties.add('Cardiologist');
            else if (condition.includes('headache') || condition.includes('migraine') || condition.includes('nerve')) specialties.add('Neurologist');
            else if (condition.includes('obesity') || condition.includes('diet') || condition.includes('nutrition') || condition.includes('weight')) specialties.add('Nutritionist');
            else if (condition.includes('lung') || condition.includes('breath') || condition.includes('respiratory') || condition.includes('asthma') || condition.includes('flu') || condition.includes('cold')) specialties.add('Pulmonologist');
            else if (condition.includes('skin') || condition.includes('acne') || condition.includes('rash')) specialties.add('Dermatologist');
            else if (condition.includes('bone') || condition.includes('joint') || condition.includes('arthritis') || condition.includes('back pain') || condition.includes('musculoskeletal')) specialties.add('Orthopedic Surgeon');
            else if (condition.includes('stress') || condition.includes('anxiety') || condition.includes('depression') || condition.includes('mental')) specialties.add('Psychiatrist');
            else if (condition.includes('stomach') || condition.includes('digest') || condition.includes('liver') || condition.includes('gastric') || condition.includes('gastrointestinal')) specialties.add('Gastroenterologist');
            else if (condition.includes('viral') || condition.includes('malaria') || condition.includes('infection') || condition.includes('fever') || condition.includes('fatigue')) specialties.add('General Physician');
            else specialties.add('General Physician');
        });
        return Array.from(specialties);
    };

    const recommendedSpecialties = getRecommendedSpecialties(risks || []);

    // Filter doctors based on specialties and ensure at least 3 doctors are shown
    let recommendedDoctors = doctorsData.filter(doc =>
        recommendedSpecialties.includes(doc.specialty)
    ).sort((a, b) => b.rating - a.rating);

    // If less than 3 doctors, add General Physicians
    if (recommendedDoctors.length < 3) {
        const generalPhysicians = doctorsData.filter(doc =>
            doc.specialty === 'General Physician' && !recommendedDoctors.find(d => d.id === doc.id)
        );
        recommendedDoctors = [...recommendedDoctors, ...generalPhysicians];
    }

    // If still less than 3, add highest-rated available doctors
    if (recommendedDoctors.length < 3) {
        const remainingDoctors = doctorsData
            .filter(doc => !recommendedDoctors.find(d => d.id === doc.id))
            .sort((a, b) => b.rating - a.rating);
        recommendedDoctors = [...recommendedDoctors, ...remainingDoctors].slice(0, Math.max(3, recommendedDoctors.length));
    }

    // Ensure we always show at least 3 doctors
    recommendedDoctors = recommendedDoctors.slice(0, Math.max(3, recommendedDoctors.length));

    return (
        <div className="w-full mt-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Recommended Doctors</h2>
                <span className="text-sm text-slate-500">Based on your risk profile</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedDoctors.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-yellow-700">{doc.rating}</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1">{doc.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-4">{doc.specialty}</p>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock className="w-4 h-4" /> <span>{doc.experience} exp.</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-4 h-4" /> <span className="truncate">{doc.location}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button href={`/consult/${doc.id}`} className="w-full py-2 text-sm">Consult Now</Button>
                            <Button variant="secondary" className="px-3">
                                <Calendar className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorRecommendation;
