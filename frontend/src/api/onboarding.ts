// frontend/src/api/onboarding.ts

// Save onboarding data to "users" table via backend api
import { supabase } from "../api/auth";

export async function saveUserProfile(profileData: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    level: string;
    interests: string[];
    goals: string;
}) {
    // Call the backend api from this end point
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/onboarding`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
    });

    // Error handling

    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save profile")
    }
    // ✅ Backend succeeded — now refresh Supabase user metadata
    await supabase.auth.refreshSession();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Error refreshing Supabase user:", error);
    } else {
        console.log("✅ User refreshed successfully:", data.user);
    }

    return await response.json();
}
