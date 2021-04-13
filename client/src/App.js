import { BrowserRouter, Route, Switch } from "react-router-dom";  
import './App.css';
import Header from "./components/Header";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Route path={"/"} component={Header}/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
