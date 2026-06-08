// import React, { useState } from "react";
// import { registerUser } from "../apis/user.api.js";
// import { login } from "../store/slice/authSlice.js";

// const RegisterForm = ({state}) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//         await registerUser(name,email, password);
//         setLoading(false);
//         dispatch(login(data.user))
//     } catch (err) {
//       setError(
//         err.message ||
//           "Registration failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-lg mx-auto">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded-md px-8 py-8"
//       >
//         <h2 className="text-4xl font-bold text-center mb-8">
//           Register
//         </h2>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <div className="mb-4">
//           <label
//             htmlFor="name"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Name
//           </label>

//           <input
//             id="name"
//             type="text"
//             placeholder="Enter your name"
//             value={name}
//             onChange={(e) =>
//               setName(e.target.value)
//             }
//             required
//             className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="email"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Email
//           </label>

//           <input
//             id="email"
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) =>
//               setEmail(e.target.value)
//             }
//             required
//             className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             htmlFor="password"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Password
//           </label>

//           <input
//             id="password"
//             type="password"
//             placeholder="Minimum 6 characters"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//             required
//             className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
//         >
//           {loading
//             ? "Creating Account..."
//             : "Register"}
//         </button>

//         <div className="text-center mt-6">
//           <p className="cursor-pointer text-sm text-gray-600">
//             Already have an account?{" "}
//             <button
//                 type="button"
//                 onClick={() => state(true)}
//                 className="text-blue-500 hover:text-blue-700 font-medium"
//                 >
//                 Login
//                 </button>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;


import { useState } from 'react';
import { registerUser } from '../apis/user.api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '../hooks/useToast.js';
import { useQueryClient } from '@tanstack/react-query';

const RegisterForm = ({state}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const handleSubmit = async (e) => {
    e.preventDefault();    
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await registerUser(name, email, password);
      dispatch(login(data.user))
      queryClient.setQueryData(['currentUser'], data.user)
      showToast(data.message || 'Registration successful')
      navigate({to:"/dashboard"})
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      showToast(err.message || 'Registration failed. Please try again.', 'error')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white px-8 py-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Create an Account</h2>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">Start tracking and managing your short links.</p>
        
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200" htmlFor="name">
            Full Name
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900"
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-900"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
    
        
        <div className="flex items-center justify-between">
          <button
            className="w-full rounded-md bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account? <button type="button" onClick={()=>state(true)} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Sign In</button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
