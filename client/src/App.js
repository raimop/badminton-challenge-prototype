import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { fetchNotifications } from './redux/notificationSlice';
import { updateChallenges } from './redux/challengeSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Button, notification } from 'antd';
import io from "socket.io-client";
import PrivateRoute from "./hoc/PrivateRoute"
import Header from "./components/Header";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Ranking from "./pages/Ranking";
import Challenges from "./pages/challenge/Challenges";
import ChallengeCreate from "./pages/challenge/ChallengeCreate";
import ChallengeUpdate from "./pages/challenge/ChallengeUpdate";
import ChallengeHistory from "./pages/challenge/ChallengeHistory";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import 'antd/dist/antd.css';
import './App.css';

const socket = io();

function App() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const openNotification = content => {
    const key = `open${Date.now()}`;
    const btn = (<Button type="primary" size="small" onClick={() => notification.close(key)}> Sulge </Button>);
    notification.open({
      message: 'Uus teade',
      description: content,
      placement: 'bottomRight',
      btn,
      key
    });
  };

  useEffect(() => {
    if (user){
      dispatch(fetchNotifications())
      dispatch(updateChallenges())
    }
  }, [user])

  useEffect(() => {
    const handleNotification = data => {
      dispatch(fetchNotifications())
      dispatch(updateChallenges())
      openNotification(data.content);
    }

    if (user) socket.on(user._id, handleNotification);

    return () => {
      if (user) socket.off(user._id, handleNotification);
    }
  }, [user])

  return (
    <BrowserRouter>
      <Route path={"/"} component={Header}/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/ranking" component={Ranking}/>
        <Route exact path="/confirm/:confirmationCode" component={ConfirmRegistration} />
        <PrivateRoute exact path="/challenges" component={Challenges}/>
        <PrivateRoute exact path="/challenges/create/:id" component={ChallengeCreate}/>
        <PrivateRoute exact path="/challenges/update/:id" component={ChallengeUpdate}/>
        <PrivateRoute exact path="/challenges/history/:id" component={ChallengeHistory}/>
        <PrivateRoute exact path="/notifications" component={Notifications}/>
        <PrivateRoute exact path="/profile" component={Profile}/>
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
