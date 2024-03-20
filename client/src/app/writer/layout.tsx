"use client";
import { useAuth } from "../context/useAuth";
import { Spinner } from "@nextui-org/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { auth, loading } = useAuth();
  if (loading) {
    return <Spinner className="h-screen flex items-center justify-center" />;
  }
  if (!auth) {
    return <div>Page Error</div>;
  }
  return <div>{children}</div>;
}
