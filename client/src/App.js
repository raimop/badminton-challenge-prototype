import { BrowserRouter, Route, Switch } from "react-router-dom";  
import Header from "./components/Header";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/auth/SignUp";
import 'antd/dist/antd.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Route path={"/"} component={Header}/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
