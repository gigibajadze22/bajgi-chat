import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { messages, setMessages } = useConversation();

    useEffect(() => {
        // ვუსმენთ "newMessage" ივენთს სერვერიდან
        socket?.on("newMessage", (newMessage) => {
            // მნიშვნელოვანია: ვიყენებთ ფუნქციურ განახლებას, რომ messages ყოველთვის აქტუალური იყოს
            setMessages([...messages, newMessage]);
        });

        // კავშირის გაწყვეტისას ვასუფთავებთ ლისენერს
        return () => socket?.off("newMessage");
    }, [socket, setMessages, messages]);
};

export default useListenMessages;