import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await axios.get(`/bajgi/messages/${selectedConversation.id}`);
				
				// თუ ბექენდი აბრუნებს { status: "success", data: { messages: [] } }
				// მაშინ უნდა დავწეროთ: setMessages(res.data.data.messages);
				// მაგრამ რადგან ბექენდი პირდაპირ მასივს აბრუნებს:
				const data = res.data;
				setMessages(Array.isArray(data) ? data : (data.messages || []));

			} catch (error) {
				toast.error(error.message);
				setMessages([]); // შეცდომის დროსაც მასივად დავტოვოთ
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?.id) getMessages();
	}, [selectedConversation?.id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;