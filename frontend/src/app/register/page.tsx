'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password, country }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                const msg = await res.text();
                setError(msg || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center min-h-screen px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card w-full max-w-md p-10 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h1 className="text-3xl font-black text-white mb-2">Welcome Aboard!</h1>
                                <p className="text-white/60">Your account was created successfully.</p>
                                <p className="text-white/40 text-sm mt-4 italic">Redirecting to login...</p>
                            </motion.div>
                        ) : (
                            <motion.div key="form">
                                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Create <span className="text-gradient">Account</span></h1>
                                <p className="text-white/40 text-sm font-medium mb-8">Join the elite gaming community today</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="gamertag"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="ninja@gametify.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Country</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <select
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                            >
                                                <option value="" disabled className="bg-black">Select your country</option>
                                                <option value="Argentina" className="bg-black">Argentina</option>
                                                <option value="Brazil" className="bg-black">Brazil</option>
                                                <option value="Chile" className="bg-black">Chile</option>
                                                <option value="Colombia" className="bg-black">Colombia</option>
                                                <option value="Mexico" className="bg-black">Mexico</option>
                                                <option value="Spain" className="bg-black">Spain</option>
                                                <option value="United States" className="bg-black">United States</option>
                                                <option value="Uruguay" className="bg-black">Uruguay</option>
                                                <option value="Other" className="bg-black">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                                        >
                                            {error}
                                        </motion.p>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                                    </button>

                                    <p className="mt-8 text-center text-sm text-white/40">
                                        Already have an account? <Link href="/login" className="text-primary hover:text-primary/80 font-bold">Sign In</Link>
                                    </p>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </main>
    );
}
