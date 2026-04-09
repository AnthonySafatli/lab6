import React from "react";
import Footer from "./footer";
import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      <div className="glow-orb" />

      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
