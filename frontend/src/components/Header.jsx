import { BiMenu } from "react-icons/bi";
import { useAppContext } from "../AppProvider";

export default function Header(){
  const {setIsNavActive} = useAppContext();
  const toggleNav = () => setIsNavActive(pre => !pre);
    return (
      <div className="flex justify-between items-center bg-white p-4 shadow-md ">
        <div onClick={toggleNav} className="text-3xl cursor-pointer">
          <BiMenu size={30} />
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src="/src/assets/user.png" alt="User" />
        </div>
      </div>
    )
}