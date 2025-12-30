import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='border-r border-gray-700 p-4 flex flex-col w-64 md:w-80 h-full bg-[#12171d]'>
			<SearchInput />
			<div className='divider px-3 my-2 border-gray-700'></div>
			<Conversations />
			<div className="mt-auto pt-4 border-t border-gray-700">
				<LogoutButton />
			</div>
		</div>
	);
};

export default Sidebar;