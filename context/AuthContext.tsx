import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/apiClient";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (creadentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User | undefined;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);
let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "next-auth.token");
  destroyCookie(undefined, "next-auth.refreshToken");
  authChannel.postMessage('signOut')
  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut': {
          signOut();
          authChannel.close();
          break;
        }
        default: break;      }
    }
  }, [])

  useEffect(() => {
    const { "next-auth.token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { permissions, roles, email } = response.data;
          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", { email, password });

      const { token, refreshToken, roles, permissions } = response.data;

      setCookie(undefined, "next-auth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 1 month
        path: "/",
      });
      setCookie(undefined, "next-auth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 1 month
        path: "/",
      });

      setUser({ email, roles, permissions });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch {
      alert("O error ocorreu, verifique os dados e tente novamente.");
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signOut, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function signContext() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(AuthContext);
}
