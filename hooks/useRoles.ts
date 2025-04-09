import { useState, useEffect } from "react";
import axios from "axios";

interface Role {
    _id: string;
    name: string;
}

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get("https://api.rock.io.vn/api/v1/roles");
                setRoles(response.data.data);
            } catch (err) {
                setError("Failed to fetch roles");
                console.error("Error fetching roles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return { roles, loading, error };
};
