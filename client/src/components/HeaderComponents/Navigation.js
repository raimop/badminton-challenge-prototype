import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "./Navigation.css";

export const Navigation = ({ navRef, toggleNav }) => {
  const notifications = useSelector((state) => state.notifications);
  const user = useSelector((state) => state.auth.user);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    setUnreadNotifications(notifications.data.filter((e) => !e.read).length);
  }, [notifications]);

  return (
    <nav ref={navRef} className="header__nav" onClick={toggleNav}>
      <ul className="nav__links">
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
  );
};

Navigation.propTypes = {
  toggleNav: PropTypes.func.isRequired,
  navRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};