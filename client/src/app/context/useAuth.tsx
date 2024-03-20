"use client";

import { createContext, useContext, JSX, FC, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext({});

interface Props {
  children: JSX.Element;
}

interface User {
  _id?: string; // Optional string for an object ID
  name: string; // Required string
  email?: string; // Optional string
  password: string; // Required string
  role: string; // Required string
  photo?: string; // Optional string
  verified: boolean; // Required boolean
  provider: string; // Required string
  third_party_id: number; // Required number
  created_at?: Date; // Optional Date
  updated_at?: Date; // Optional Date
}
type Context = {
  user: User;
  auth: boolean;
  loading: boolean;
};

export const AppProvider: FC<Props> = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.data.user);
        setAuth(true);
        setLoading(false);
        return;
      })
      .catch((e) => {
        setAuth(false);
        setLoading(false);
        return;
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as Context;
