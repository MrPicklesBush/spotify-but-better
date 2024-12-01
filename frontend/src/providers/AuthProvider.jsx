import PropTypes from "prop-types";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";

const updateApiToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

const AuthProvider = ({ children }) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);
            } catch (error) {
                updateApiToken(null);
                console.log("Error in auth provider", error);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, [getToken]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader className="size-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
};

// Define PropTypes for the component
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensure `children` is a valid React node
};

export default AuthProvider;
