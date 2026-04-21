import React from 'react';
import { Brain, Stethoscope, MessageSquare, ShieldCheck, Activity, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">
            {description}
        </p>
    </div>
);

const Features = () => {
    const features = [
        {
            icon: Brain,
            title: "AI Risk Prediction",
            description: "Advanced algorithms analyze your health data to predict potential future risks, allowing for proactive care.",
            color: "bg-purple-100 text-purple-600"
        },
        {
            icon: Stethoscope,
            title: "Doctor Recommendations",
            description: "Get matched with the best specialists near you based on your specific health needs and risks.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: MessageSquare,
            title: "Online Consultation",
            description: "Connect instantly with healthcare professionals for a quick chat and guidance from the comfort of your home.",
            color: "bg-green-100 text-green-600"
        },
        {
            icon: Activity,
            title: "Preventive Suggestions",
            description: "Receive personalized tips and lifestyle advice to maintain optimal health and prevent issues.",
            color: "bg-orange-100 text-orange-600"
        },
        {
            icon: ShieldCheck,
            title: "Secure Health Data",
            description: "Your health records are encrypted and stored securely. You have full control over who sees your data.",
            color: "bg-cyan-100 text-cyan-600"
        },
        {
            icon: Users,
            title: "Community Support",
            description: "Join a community of users and experts sharing insights and support for better health journeys.",
            color: "bg-pink-100 text-pink-600"
        }
    ];

    return (
        <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-u text-blue-600 font-bold uppercase tracking-wider text-sm mb-4">Core Features</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Everything you need for smarter healthcare</h3>
                    <p className="text-lg text-slate-600">MediGuide leverages cutting-edge AI to provide comprehensive health insights and seamless medical connections.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
