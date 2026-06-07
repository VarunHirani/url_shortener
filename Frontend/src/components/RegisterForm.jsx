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


import React, { useState } from 'react';
import { registerUser } from '../apis/user.api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';
import { useNavigate } from '@tanstack/react-router';

const RegisterForm = ({state}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();    
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await registerUser(name, password, email);
      setLoading(false);
      dispatch(login(data.user))
      navigate({to:"/dashboard"})
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="cursor-pointer text-sm text-gray-600">
            Already have an account? <span onClick={()=>state(true)} className="text-blue-500 hover:text-blue-700">Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;