import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    getUser();

    supabase.auth.onAuthStateChange(() => {
      getUser();
    });
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      setUser(data.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      setRole(profile?.role);
    } else {
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);