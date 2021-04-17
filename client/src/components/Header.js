import React from 'react'
import { Link } from "react-router-dom";  
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Menu, Dropdown, message } from 'antd';
import { DownOutlined  } from "@ant-design/icons"
import { logoutAndErase } from '../redux/authSlice';
import BadmintonChallengeLogo from "../logo.svg"
import "./Header.css";

const Header = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = e => {
    e.preventDefault();
    dispatch(logoutAndErase());
    history.push("/");
    message.success("Välja logimine õnnestus!")
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile">Profiil</Link> 
      </Menu.Item>
      <Menu.Item>
        <Link to="/" onClick={handleLogout}>Logi välja</Link> 
      </Menu.Item>
    </Menu>
  )

  return (
    <header>
      <div className="header--container">
        <div className="header--logo" style={{ width: user ? "12%" : "18%" }}><Link to="/"><img className="header--logo--icon" src={BadmintonChallengeLogo} alt="logo" /></Link></div>
        <nav>
          <ul className="header--links">
            <li><Link to="/ranking">Edetabel</Link></li>
            { user && (
                <>
                  <li><Link to="/challenges">Väljakutsed</Link></li>
                  <li><Link to="/">Teated</Link></li>
                </>
              )
            }
          </ul>
        </nav>
        <div className="header--auth">
          { user ? 
              <Dropdown overlay={menu} trigger={['click']}>
                <button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Tere, { user.firstName.length > 10 ? user.firstName.substr(0,10)+".." : user.firstName } <DownOutlined />
                </button>
              </Dropdown>
              : 
              <>
                <Link to="/login">Logi sisse</Link> | <Link to="/signup">Registreeru</Link>
              </>
          }
        </div> 
      </div>
    </header>
  )
}

export default Header