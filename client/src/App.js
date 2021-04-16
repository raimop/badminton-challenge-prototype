import { BrowserRouter, Route, Switch } from "react-router-dom";  
import PrivateRoute from "./hoc/PrivateRoute"
import Header from "./components/Header";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Ranking from "./pages/Ranking";
import Challenges from "./pages/challenge/Challenges";
import ChallengeCreate from "./pages/challenge/ChallengeCreate";
import ChallengeHistory from "./pages/challenge/ChallengeHistory";
import 'antd/dist/antd.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Route path={"/"} component={Header}/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/ranking" component={Ranking}/>
        <PrivateRoute exact path="/challenges" component={Challenges}/>
        <PrivateRoute exact path="/challenges/create/:id" component={ChallengeCreate}/>
        <PrivateRoute exact path="/challenges/history/:id" component={ChallengeHistory}/>
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
