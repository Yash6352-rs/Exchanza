import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";

export const useRole = () => {
    const { userData } = useContext(AuthContext);

    const role = userData?.role || "user";

    return {
        role,

        isAdmin: role === "admin",
        isUser: role === "user,"
    }
}