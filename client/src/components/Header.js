import React from 'react'
import { Link } from "react-router-dom";  
import BadmintonChallengeLogo from "../logo.svg"
import "./Header.css";

const Header = () => {
  return (
    <header>
      <div className="header--container">
        <div className="header--logo"><Link to="/"><img className="header--logo--icon" src={BadmintonChallengeLogo} alt="logo" /></Link></div>
        <nav>
          <ul className="header--links">
            <li><Link to="/">Edetabel</Link></li>
            <li><Link to="/">Väljakutsed</Link></li>
            <li><Link to="/">Teated</Link></li>
          </ul>
        </nav>
        <div className="header--auth">
          <Link to="/login">Logi sisse</Link> | <Link to="/signup">Registreeru</Link>
        </div> 
      </div>
    </header>
  )
}

export default Header