import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa6';
import request from '../utils/request';
import { useAppContext } from '../AppProvider';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {user, setUser} = useAppContext();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        const response = await request("http://localhost:8000/user/authenticate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if(response.status_code === 200) {
            const token = response.result.token
            localStorage.setItem("token", response.result.token);
            setUser(response.result.token)
            console.log(token)
            navigate('/')
        }
        else {
            toast.error(response.message)
        }
    };

    useEffect(() => {
        if(user) {
            navigate('/')
        }
    }, [user])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Vui lòng đăng nhập để tiếp tục
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <FaUser size={25} className='absolute text-gray-400 ml-2'/>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-md overflow-hidden w-full px-12 py-2 border-2 border-gray-600"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center relative">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <FaLock size={25} className="absolute text-gray-400 ml-2" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md overflow-hidden block w-full px-12 py-2 border-2 border-gray-600"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute flex items-center right-2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaEye size={25} color='gray'/>
                                ) : (
                                    <FaEyeSlash size={25} color='gray' />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-400">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
            <div className='absolute'>
                <ToastContainer position='top-right' draggable={true} limit={5} pauseOnHover={false} autoClose={3000}/>
            </div>
        </div>
    );
}