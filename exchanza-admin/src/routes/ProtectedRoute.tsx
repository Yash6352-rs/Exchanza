import type React from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import { Navigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader fullScreen />
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}