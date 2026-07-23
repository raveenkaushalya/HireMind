import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CompanySetupPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { openLogin } = useAuth();

    const searchParams = new window.URLSearchParams(window.location.search);
    const companyToken = searchParams.get('companySetupToken');
    const recruiterToken = searchParams.get('recruiterSetupToken');
    const hiringManagerToken = searchParams.get('hiringManagerSetupToken');

    const token = companyToken || recruiterToken || hiringManagerToken;
    const isRecruiter = !!recruiterToken;
    const isHiringManager = !!hiringManagerToken;

    const accountType = isHiringManager ? 'Hiring Manager' : isRecruiter ? 'Recruiter' : 'Company';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const endpoint = isHiringManager ? '/api/auth/hiring-manager-setup-password' :
                isRecruiter ? '/api/auth/recruiter-setup-password' :
                    '/api/auth/company-setup-password';

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Account setup complete! You can now log in.");
                // clear the URL param
                window.history.replaceState({}, document.title, window.location.pathname);
                openLogin();
            } else {
                setError(data.message || data.title || "Failed to setup account.");
            }
        } catch (err: any) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid items-center bg-gray-900 justify-center text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white">Setup {accountType} Account</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Please create a password for your {accountType.toLowerCase()} account.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">New Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? "Setting up account..." : "Set Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
