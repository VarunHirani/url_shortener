import {useState} from "react";
import { loginUser } from "../apis/user.api.js";
import {useDispatch} from 'react-redux';
import { login } from "../store/slice/authSlice.js";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "../hooks/useToast.js";
import { useQueryClient } from "@tanstack/react-query";

const LoginForm = ({state})=>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            const data = await loginUser(email,password);
            dispatch(login(data.user));
            queryClient.setQueryData(["currentUser"], data.user);
            showToast(data.message || "Login successful");
            navigate({to: "/dashboard"})
        }catch (err){
            setError(err.message || "Login failed. Please check your credentials.");
            showToast(err.message || "Login failed. Please check your credentials.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white px-8 py-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Login</h2>
                <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">Access your dashboard and manage your links.</p>

                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)} 
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200"  htmlFor="password">
                        Password
                    </label>
                    <input
                        className="w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900"
                        id="password"
                        type="password"
                        placeholder="*****************"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)} 
                        required/>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={loading}
                        >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Don't have an account? 
                        <button
                            type="button"
                            onClick={() => state(false)}
                            className="ml-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                            Register
                        </button>
                    </p>
                </div>
            </form>
        </div>
    )
};

export  default LoginForm;
