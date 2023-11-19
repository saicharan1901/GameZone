"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
      

      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
