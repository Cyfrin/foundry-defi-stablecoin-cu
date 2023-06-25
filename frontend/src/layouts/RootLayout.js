// import './globals.css'

import React from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <>
      <div className="relative md:ml-64 mx-auto	  bg-themeColor-800">
        <nav className={"nav mb-12"}>
          <Header></Header>
        </nav>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">{children}</div>
        <footer className={"footer"}>Made with &#10084; by TK Devs</footer>
      </div>
    </>
  );
}
