import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // .trim() აზღვევს ცარიელი "space"-ების გაგზავნას
        if (!message.trim()) return; 
        
        await sendMessage(message);
        setMessage("");
    };

    return (
        <form className='px-4 my-3' onSubmit={handleSubmit}>
            <div className='w-full relative'>
                <input
                    type='text'
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white outline-none focus:border-sky-500 transition-all'
                    placeholder='დაწერეთ შეტყობინება...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading} // გაგზავნის დროს ინპუტი იბლოკება
                />
                <button 
                    type='submit' 
                    className='absolute inset-y-0 end-0 flex items-center pe-3 active:scale-90 transition-transform'
                    disabled={loading}
                >
                    {loading ? (
                        <div className='loading loading-spinner'></div>
                    ) : (
                        <BsSend className="text-white hover:text-sky-500" />
                    )}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;