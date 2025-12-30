import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    // ვამოწმებთ ორივე ვარიანტს: id და _id
    const isSelected = (selectedConversation?.id === conversation.id) || 
                       (selectedConversation?._id === conversation._id);

    return (
        <>
            <div
                className={`flex gap-3 items-center hover:bg-sky-500 rounded p-3 py-2 cursor-pointer transition-all
                ${isSelected ? "bg-sky-500" : ""}
            `}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className='avatar placeholder'>
                    <div className='w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border border-gray-600'>
                        {conversation.profilePic ? (
                            <img src={conversation.profilePic} alt='user avatar' className="rounded-full" />
                        ) : (
                            <span className='text-xl font-bold text-white'>
                                {conversation.fullName?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p className={`font-bold ${isSelected ? "text-white" : "text-gray-200"}`}>
                            {conversation.fullName}
                        </p>
                    </div>
                </div>
            </div>

            {!lastIdx && <div className='divider my-0 py-0 h-[1px] bg-gray-700 opacity-20' />}
        </>
    );
};

export default Conversation;