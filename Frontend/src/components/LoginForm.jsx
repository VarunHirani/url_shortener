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
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-8">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)} 
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2"  htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3"
                        id="password"
                        type="password"
                        placeholder="*****************"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)} 
                        required/>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
                        type="submit"
                        disabled={loading}
                        >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
                <div className="text-center mt-4">
                    <p className="cursor-pointer text-sm text-gray-600">
                        Don't have an account? 
                        <button
                            type="button"
                            onClick={() => state(false)}
                            className="text-blue-500 hover:text-blue-700"
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
