import { createContext, ReactNode, useContext } from "react";
import { api } from "../services";

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(creadentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;
  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", { email, password });
      console.log(response.data);
    } catch {
      alert("O error ocorreu, verifique os dados e tente novamente.");
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function signContext() {
  return useContext(AuthContext);
}
