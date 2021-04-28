import React, { useRef, useState, useEffect } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Navigation } from "./HeaderComponents/Navigation";
import { Auth } from "./HeaderComponents/Auth";
import { Logo } from "./HeaderComponents/Logo";
import "./Header.css";

const Header = () => {
  const [showingNav, setShowingNav] = useState(false);
  const navRef = useRef(null);

  const handleResize = () => {
    if (window.innerWidth > 576) {
      if (document.body.classList.contains("disable-scrolling"))
        document.body.classList.remove("disable-scrolling");
    } else {
      if (
        navRef &&
        navRef.current.classList.contains("show-nav") &&
        !document.body.classList.contains("disable-scrolling")
      )
        document.body.classList.add("disable-scrolling");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNav = () => {
    if (navRef.current && window.innerWidth < 576) {
      if (navRef.current.classList.contains("show-nav")) {
        navRef.current.classList.remove("show-nav");
        navRef.current.firstChild.classList.remove("show-nav-ul");
        document.body.classList.remove("disable-scrolling");
        setShowingNav(false);
      } else {
        navRef.current.classList.add("show-nav");
        navRef.current.firstChild.classList.add("show-nav-ul");
        document.body.classList.add("disable-scrolling");
        setShowingNav(true);
      }
    }
  };

  return (
    <header>
      <div className="header--container">
        <Logo />
        <Navigation navRef={navRef} toggleNav={toggleNav} />
        <Auth />
        {showingNav ? (
          <CloseOutlined className="header--hamburger" onClick={toggleNav} />
        ) : (
          <MenuOutlined className="header--hamburger" onClick={toggleNav} />
        )}
      </div>
    </header>
  );
};

export default Header;
