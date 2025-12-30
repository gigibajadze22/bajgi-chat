import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import useListenMessages from "../../hooks/useListen"; 

const Messages = () => {
    const { messages, loading } = useGetMessages();
    useListenMessages(); // ეს ხაზი აცოცხლებს ჩატს
    const lastMessageRef = useRef();

    // ვრწმუნდებით რომ მასივია
    const chatMessages = Array.isArray(messages) ? messages : [];

    useEffect(() => {
        // ავტომატური სქროლი ბოლო მესიჯზე
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [chatMessages]);

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {!loading && chatMessages.length > 0 && chatMessages.map((message, index) => (
                <div key={message.id || index} ref={index === chatMessages.length - 1 ? lastMessageRef : null}>
                    <Message message={message} />
                </div>
            ))}

            {loading && (
                <div className="flex justify-center my-4">
                    <span className="loading loading-spinner"></span>
                </div>
            )}

            {!loading && chatMessages.length === 0 && (
                <p className='text-center text-white mt-10'>დაიწყეთ საუბარი!</p>
            )}
        </div>
    );
};

export default Messages;