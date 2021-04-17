import React from "react"; 
import { useSelector, useDispatch } from 'react-redux';
import { message, Switch } from "antd";
import { updateUser } from '../redux/authSlice';
import * as services from "../actions/services";

const Profile = () => { 
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  
  const onChange = () => {
    services.updateUser().then(
      res => {
        dispatch(updateUser(res))
        message.success("Profiili uuendamine õnnestus")
      }
    )
    .catch (e => message.error(e))
  }

  return ( 
    <main className="container">
      <h1 className="text-center">Profiil</h1>
      <h1>Tere, {`${user.firstName} ${user.lastName}`}</h1> 
      <p>Kas soovid, et teised näeksid Sinu väljakutsete ajalugu?   
        <Switch
          size="middle"
          checkedChildren="jah"
          unCheckedChildren="ei"
          defaultChecked={user.preferences.showHistory}
          onChange={onChange}
          style={{ marginLeft: "10px" }}
        />
      </p>
    </main> 
  ); 
}; 
export default Profile; 
