import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layout, Database, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold">F</div>
                        <span className="font-semibold text-lg tracking-tight">Flowline</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-subtle hover:shadow-card"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-zinc-900 mb-6">
                            The CRM that <br /> <span className="font-medium">gets out of your way.</span>
                        </h1>
                        <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            A minimalist, glassy workspace for tracking leads and closing deals.
                            Zero clutter, just focus.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="group px-8 py-3 bg-zinc-900 text-white rounded-xl font-medium shadow-card hover:bg-zinc-800 transition-all flex items-center gap-2"
                            >
                                Start for free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
                        <FeatureCard
                            icon={<Layout className="w-6 h-6 text-zinc-700" />}
                            title="Pipeline View"
                            description="Drag and drop deals through customizable stages with fluid animations."
                        />
                        <FeatureCard
                            icon={<Database className="w-6 h-6 text-zinc-700" />}
                            title="Data Ownership"
                            description="Your data is your own. Powered by Supabase for reliable, secure storage."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-zinc-700" />}
                            title="Privacy First"
                            description="Row Level Security ensures you only see what belongs to you."
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 mt-20 py-10 text-center text-zinc-400 text-sm">
                <p>&copy; {new Date().getFullYear()} Flowline CRM. Built for speed and simplicity.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-card transition-shadow">
        <div className="mb-4 p-2 bg-zinc-50 rounded-lg w-fit">{icon}</div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>
        <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
);
