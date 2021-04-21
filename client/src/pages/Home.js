import React from "react"; 
import { useSelector } from 'react-redux';
import { Divider } from 'antd';
import Notifications from "./Notifications";

const Home = () => { 
  const user = useSelector(state => state.auth.user);

  return ( 
    <>
    <main className="container">
      <h1>Sulgpalli väljakutsete rakendus</h1> 
      <p>Selleks, et esitada väljakutse, on vaja registreerida ja liituda edetabeliga</p>
      <p>Prototüüp valminud bakalaureusetöö raames TLÜ 2021</p>
      <p className="attribution">Logo on teinud <a href="https://www.freepik.com" title="Freepik">Freepik</a> ja saadud aadressit <a href="https://www.flaticon.com/" title="Flaticon">flaticon.com</a></p>
    </main> 
    { user && <><Divider/><Notifications title={"Kiirvaade teadetest"}/></> }
    </>
  ); 
}; 
export default Home;