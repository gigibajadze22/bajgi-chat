import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await api.get("/users/all");
                
                // Prisma-ს კონტროლერიდან გამომდინარე: res.data.data.users
                const fetchedUsers = res.data?.data?.users;

                if (Array.isArray(fetchedUsers)) {
                    setConversations(fetchedUsers);
                } else {
                    setConversations([]);
                }
            } catch (error) {
                toast.error(error.message || "იუზერების წამოღება ვერ მოხერხდა");
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations };
};

export default useGetConversations;