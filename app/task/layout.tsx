"use client";
import { NavbarComponent } from "@/components/navbar/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarComponent />
      {children}
    </>
  );
}
