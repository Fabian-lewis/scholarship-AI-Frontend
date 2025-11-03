// Protects routes that require authentication

import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: JSX.Element;
    requireOnboarding?: boolean;
}

export default function ProtectedRoute({children, requireOnboarding = false}: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) { return <div>Loading...</div> }

    if (!user) { return <Navigate to="/auth" replace/> };

    if (requireOnboarding && user.user_metadata?.onboarded) { return <Navigate to="/dashboard" replace/> };

    if (!requireOnboarding && !user.user_metadata?.onboarded) { return <Navigate to="/onboarding" replace/> };

    return children;
}