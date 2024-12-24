import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import { useEffect, useState } from 'react';
import { useAppContext } from './AppProvider';
import { ToastContainer } from 'react-toastify';

function App() {
  const {user} = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    if(!user) {
      navigate('/login')
    }
  }, []);

  return (
    <div className="h-fit w-screen bg-gray-200 flex">
      <NavBar />
      <div className='flex flex-1 h-fit'>
        <Outlet />
      </div>
      <ToastContainer autoClose={3000} pauseOnHover={false} position='top-right'/>
    </div>
  )
}

export default App