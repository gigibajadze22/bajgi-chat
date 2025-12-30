import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className='mt-auto pt-4'>
      {!loading ? (
        <div 
          className="flex items-center gap-2 text-white cursor-pointer hover:text-blue-500 transition-all"
          onClick={logout}
        >
          <BiLogOut className='w-6 h-6' />
          <span className="text-sm font-medium">გამოსვლა</span>
        </div>
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  );
};

export default LogoutButton;