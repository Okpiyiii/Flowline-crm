import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type AuthMode = 'LOGIN' | 'SIGNUP';

export const Auth: React.FC<{ mode: AuthMode }> = ({ mode }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Auto login or show check email message
                // For simplicity, let's try to sign them in immediately or redirect to login
                navigate('/login');
                alert('Signup successful! Please check your email for verification (if enabled) or log in.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/app');
            }
        } catch (err: any) {
            console.error('Auth Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-zinc-100 p-8">
                <div className="mb-8 text-center">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg mx-auto flex items-center justify-center text-white font-bold mb-4">
                        F
                    </div>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        {mode === 'LOGIN' ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm">
                        {mode === 'LOGIN'
                            ? 'Enter your credentials to access your workspace.'
                            : 'Get started with Flowline today.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'LOGIN' ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    {mode === 'LOGIN' ? (
                        <>
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-zinc-900 font-medium hover:underline">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <Link to="/login" className="text-zinc-900 font-medium hover:underline">
                                Sign in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
