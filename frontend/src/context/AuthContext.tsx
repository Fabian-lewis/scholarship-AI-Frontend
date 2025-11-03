import { createContext, useContext, useEffect, useState } from "react"
import { supabase, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from "@/api/auth";

const AuthContext = createContext<any>(null); // Create a global state that the entire app can access

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser(){
            const {data} = await supabase.auth.getSession();
            const sessionUser = data.session?.user ?? null;

            if (sessionUser){
                // Fetch User profile from users table
                const {data: userProfile} = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", sessionUser.id)
                    .single();

                setUser({
                    ...sessionUser,
                    ...userProfile,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        }

        loadUser();

        // Listen for changes in the user's authentication state
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user){
                supabase
                    .from("users")
                    .select("*")
                    .eq("id", session.user.id)
                    .single()
                    .then(({data}) => {
                        setUser({
                            ...session.user,
                            ...data,
                        });
                    });
            } else {
                setUser(null);
            }
        });
        // Cleanup function to unsubscribe from the listener
        return () => listener.subscription.unsubscribe();
    }, []);

    // Auth actions available globally
    const signIn = async (email: string, password: string) => {
        await supabaseSignIn(email, password);
    };

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        await supabaseSignUp(email, password, firstName, lastName);
    };

    const signOut = async () => {
        await supabaseSignOut();
        setUser(null);
    };

    return (
        // Make user and loading available to the rest of the app
        <AuthContext.Provider value = {{user, setUser, loading, signIn, signUp, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
