import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		// cleanup function (გასუფთავება ჩატიდან გასვლისას)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='md:min-w-[450px] flex flex-col h-full w-full bg-[#1d232a]'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-800 px-4 py-3 mb-2 flex items-center gap-2 border-b border-gray-700'>
						<span className='label-text text-gray-400'>To:</span>{" "}
						<span className='text-white font-bold'>{selectedConversation.fullName}</span>
					</div>

					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};

const NoChatSelected = () => {
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>მოგესალმებით ჩატში! 🚀</p>
				<p>აირჩიეთ იუზერი საუბრის დასაწყებად</p>
				<TiMessages className='text-3xl md:text-6xl text-center text-sky-500' />
			</div>
		</div>
	);
};

export default MessageContainer;