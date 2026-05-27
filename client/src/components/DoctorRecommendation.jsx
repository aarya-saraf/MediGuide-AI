import React, { useState, useEffect } from 'react';
import { User, MapPin, Star, Calendar, Clock, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import Link from 'next/link';

const DoctorRecommendation = ({ risks }) => {
    const [recommendedDoctors, setRecommendedDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            const specialties = getRecommendedSpecialties(risks || []);
            const specialtyQuery = specialties.join(',');

            try {
                // Use the dedicated recommend endpoint to get unique, persisted recommendations
                const response = await fetch(`http://localhost:5000/api/doctors/recommend?count=12&specialty=${encodeURIComponent(specialtyQuery)}`);
                const data = await response.json();

                if (data.doctors) {
                    setRecommendedDoctors(data.doctors);
                }
            } catch (error) {
                console.error("Failed to fetch recommended doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [risks]);

    if (loading) {
        return (
            <div className="w-full mt-12 flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500">Finding the best specialists for you...</p>
            </div>
        );
    }

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
