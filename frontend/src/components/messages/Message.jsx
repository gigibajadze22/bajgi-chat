import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { selectedConversation } = useConversation();

	// მარტივი ლოგიკა: თუ senderId არ არის არჩეული იუზერის ID, ესე იგი ჩემია
	const fromMe = message.senderId !== selectedConversation.id;
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const bubbleBgColor = fromMe ? "bg-sky-500" : "bg-slate-700";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img
						alt='avatar'
						src={fromMe 
                            ? "https://avatar.iran.liara.run/public/boy" 
                            : selectedConversation.profilePic || "https://avatar.iran.liara.run/public/girl"}
					/>
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
				{message.content}
			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center text-white'>
				{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			</div>
		</div>
	);
};

export default Message;