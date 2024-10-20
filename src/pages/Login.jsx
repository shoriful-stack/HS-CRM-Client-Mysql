import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MdEmail } from "react-icons/md";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axiosSecure.post('/login', { email, password });
            
            if (response.status === 200) {
                const { name, email, role } = response.data;
                
                // Save user information in localStorage
                localStorage.setItem('email', JSON.stringify({ email }));
                localStorage.setItem('name', JSON.stringify({ name }));
                localStorage.setItem('role', JSON.stringify({ role }));
                
                toast.success('Login successful!');
    
                // Redirect based on role
                navigate(role === 1 ? '/dashboard/home' : '/dashboard/home');
            } else {
                toast.error('Invalid email or password!');
            }
        } catch (error) {
            toast.error('Login failed: ' + error.response?.data?.message || error.message);
        }
    };    
    

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col justify-center">
            <div className="text-center mb-1">
                <h1 className="text-[22px] font-bold text-gray-800 mb-1">CONTRACT MANAGEMENT SYSTEM</h1>
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-[300px] px-5 py-4 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-center items-center mb-2">
                        <img className="w-48 h-9" src="https://i.ibb.co.com/zrNvt4h/logo-hs.png" alt="Logo" />
                    </div>
                    <div className="flex justify-center">
                        <div className="bg-gray-200 p-4 rounded-full w-16 flex justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-7 w-7 text-teal-500">
                                <path d="M12 12c2.97 0 5.35-2.17 5.87-5.01A5.992 5.992 0 0 0 12 2c-2.68 0-4.94 1.79-5.77 4.23C6.68 9.95 9.12 12 12 12zM12 14c-4.41 0-8 3.59-8 8h2c0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.41-3.59-8-8-8z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-700 mb-2 font-lexend">Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center">
                                    <MdEmail className="h-4 w-5" />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full py-2 pl-10 rounded-lg focus:outline-none text-sm"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center">
                                    <FaLock className="h-4 w-5" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="w-full py-2 pl-10 rounded-lg text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                </span>
                            </div>
                        </div>
                        <div className="form-control">
                            <button type="submit" className="btn-sm rounded-md bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-400 hover:to-blue-500 text-white w-full font-lexend text-xs font-semibold">Login</button>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Login;