import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Menu, Dropdown, message, Tooltip } from "antd";
import { DownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { logoutAndErase } from "../redux/authSlice";
import BadmintonChallengeLogo from "../logo.svg";
import "./Header.css";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector((state) => state.notifications);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const navRef = useRef(null);
  const [showingNav, setShowingNav] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAndErase());
    history.push("/");
    message.success("Välja logimine õnnestus!");
  };

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
    setUnreadNotifications(notifications.data.filter((e) => !e.read).length);
  }, [notifications]);

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

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile">Profiil</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/" onClick={handleLogout}>
          Logi välja
        </Link>
      </Menu.Item>
    </Menu>
  );

  const welcome = user && (
    <button className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
      Tere,{" "}
      {user.firstName.length > 15
        ? user.firstName.substr(0, 15) + ".."
        : user.firstName}{" "}
      <DownOutlined />
    </button>
  );

  const showHamburger = (props) =>
    showingNav ? <CloseOutlined {...props} /> : <MenuOutlined {...props} />;

  return (
    <header>
      <div className="header--container">
        <div className="header--logo">
          <Link to="/">
            <Tooltip title="Avalehele">
              <img
                className="header--logo--icon"
                src={BadmintonChallengeLogo}
                alt="logo"
              />
            </Tooltip>
          </Link>
        </div>
        <nav ref={navRef} className="header--nav" onClick={toggleNav}>
          <ul className="nav--links">
            <li>
              <Link to="/ranking">Edetabel</Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/challenges">Väljakutsed</Link>
                </li>
                <li>
                  <Link to="/notifications">Teated</Link>
                  {unreadNotifications ? (
                    <span className="notifications--unread">
                      {unreadNotifications}
                    </span>
                  ) : null}
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="header--auth">
          {user ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              {welcome}
            </Dropdown>
          ) : (
            <>
              <Link to="/login">Logi sisse</Link> |{" "}
              <Link to="/signup">Registreeru</Link>
            </>
          )}
        </div>
        {showHamburger({ className: "header--hamburger", onClick: toggleNav })}
      </div>
    </header>
  );
};

export default Header;
