import { useNavigate } from "react-router-dom"
import { useAppContext } from "../AppProvider"
import { useEffect } from "react"
import { BiHome, BiNote, BiLogOut } from 'react-icons/bi'

export default function NavBar() {
    const navigate = useNavigate()
    const { isNavActive, setUser } = useAppContext();
    
    const handleNavigate = (path) => {
        if(path === "/login") {
            localStorage.removeItem("token")
            setUser(null)
        }
        navigate(path)
    }

    useEffect(() => {
        console.log("NavBar rendered")
    })

    return (
        <div className={`fixed h-full bg-blue-500 transition-all duration-300 ${isNavActive ? 'w-20' : 'w-48'}`}>
            <ul className="space-y-4 mt-8">
                <li className="hover:bg-white hover:text-blue-500 rounded-l-full group" onClick={() => handleNavigate("/")}>
                    <div className="flex items-center p-4">
                        <span className="text-white text-2xl">
                            <BiHome size={30} className='group-hover:text-blue-500' />
                        </span>
                        {!isNavActive && <span className="ml-4 text-white group-hover:text-blue-500 min-w-20">Trang chủ</span>}
                    </div>
                </li>
                <li className="hover:bg-white hover:text-blue-500 rounded-l-full group" onClick={() => handleNavigate("/history")}>
                    <div className="flex items-center p-4">
                        <span className="text-white text-2xl group-hover:text-blue-500">
                            <BiNote size={30} />
                        </span>
                        {!isNavActive && <span className="ml-4 text-white group-hover:text-blue-500 min-w-20">Lịch sử</span>}
                    </div>
                </li>
                <li className="hover:bg-white hover:text-blue-500 rounded-l-full group" onClick={() => handleNavigate("/login")}>
                    <div className="flex items-center p-4">
                        <span className="text-white text-2xl group-hover:text-blue-500">
                            <BiLogOut size={30} />
                        </span>
                        {!isNavActive && <span className="ml-4 text-white group-hover:text-blue-500 min-w-20">Đăng xuất</span>}
                    </div>
                </li>
            </ul>
        </div>
    )
}