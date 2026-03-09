// app/layout.tsx
"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";  
import { Inter, Instrument_Serif } from "next/font/google";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const onScroll = () => {
        setScrolled(window.scrollY > 50);
      };

      window.addEventListener("scroll", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }, []);



  return (
    <html lang="en">
      <body>

      
        <nav className={`nav-bar ${scrolled ? "scrolled" : ""} 

              }`}>

          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            href="/dashboard"
             className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
          >
            Dashboard
          </Link>

          <Link
            href="/ai-projects"
              className={`nav-link ${pathname === "/ai-projects" ? "active" : ""}`}  
          >
            AI Projects
          </Link>

          <Link
            href="/about"
            className={`nav-link ${pathname === "/about" ? "active" : ""}`}
          >
            About
          </Link>

        </nav>
        
        {children}  
    </body>
    </html>
  );
}

