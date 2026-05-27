import PatientForm from '../../components/PatientForm';
import Navbar from '../../components/layout/Navbar';

export default function AssessmentPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="container mx-auto px-4 py-32">
                <div className="max-w-4xl mx-auto mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Patient Assessment</h1>
                    <p className="text-slate-600">Please provide your health details so our AI can analyze potential risks and provide personalized recommendations.</p>
                </div>
                <PatientForm />
            </div>
        </div>
    );
}
