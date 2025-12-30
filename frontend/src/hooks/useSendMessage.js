import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (content) => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            // ვიყენებთ შენს პრეფიქსს /bajgi
            const res = await axios.post(`/bajgi/messages/send/${selectedConversation.id}`, { content });
            
            // ვამატებთ ახალ მესიჯს არსებულების მასივში, რომ UI განახლდეს
            const newMessage = res.data;
            setMessages([...messages, newMessage]);
        } catch (error) {
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;