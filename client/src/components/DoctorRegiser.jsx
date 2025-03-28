import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, IdCard } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post('/api/register', { email, password, licenseNumber });
            setSuccess('Registration successful! You can now login.');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-bl from-pink-200 to-purple-300 flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="shadow-2xl rounded-2xl p-6 backdrop-blur-md bg-white/70">
                    <CardContent>
                        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Doctor Registration</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="text-purple-500" />
                                <Input
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Lock className="text-purple-500" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <IdCard className="text-purple-500" />
                                <Input
                                    placeholder="License Number"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                            <Button
                                onClick={handleRegister}
                                disabled={loading}
                                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                            <p className="text-sm text-center text-gray-600 mt-4">
                                Already have an account? <a href="/login" className="text-purple-600 font-medium hover:underline">Login</a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
