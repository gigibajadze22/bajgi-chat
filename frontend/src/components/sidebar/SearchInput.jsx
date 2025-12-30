import { IoSearchSharp } from "react-icons/io5";

const SearchInput = () => {
	return (
		<form className='flex items-center gap-2'>
			<input
				type='text'
				placeholder='მოძებნე იუზერი...'
				className='input input-bordered rounded-full bg-slate-800 text-white w-full h-10 px-4 outline-none border-gray-600 focus:border-sky-500'
			/>
			<button type='submit' className='btn btn-circle bg-sky-500 text-white min-h-10 h-10 w-10 flex items-center justify-center hover:bg-sky-600 border-none'>
				<IoSearchSharp className='w-5 h-5' />
			</button>
		</form>
	);
};

export default SearchInput;