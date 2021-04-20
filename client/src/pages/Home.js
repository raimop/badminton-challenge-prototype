import React from "react"; 
import { useSelector } from 'react-redux';
import { Divider } from 'antd';
import Notifications from "./Notifications";

const Home = () => { 
  const user = useSelector(state => state.auth.user);

  return ( 
    <main className="container">
      <h1>Sulgpalli väljakutse rakendus</h1> 
      <p>Selleks, et esitada väljakutse, on vaja registreerida ja liituda edetabeliga</p>
      { user && <><Divider/><Notifications title={"Kiirvaade teadetest"}/></> }
    </main> 
  ); 
}; 
export default Home;