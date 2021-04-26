import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Dropdown, message } from "antd";
import { useHistory, Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { logoutAndErase } from "../redux/authSlice";
import "./Auth.css";

export const Auth = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAndErase());
    history.push("/");
    message.success("Välja logimine õnnestus!");
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

  return (
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
  );
};