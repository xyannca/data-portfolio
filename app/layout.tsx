// app/layout.tsx
"use client";

import Script from 'next/script';
import "./globals.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";  



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
      
      <head>
        <meta name="google-site-verification" content="YOUR_CODE_HERE" />
      </head>

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

        {/* Google Analytics 4 */}
        <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-X5XGFN88YF"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-X5XGFN88YF');
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "wft0blq3la");
        `}
      </Script>

    </body>
      
    </html>
  );
}

