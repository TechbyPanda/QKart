import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from './components/Checkout'
import Thanks from './components/Thanks'
import V1Register from "./v1/components/Register/Register";
// front end url : https://641c1c821e083e15101fb394--otakukart.netlify.app/
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/v1`,
  // live url
  // endpoint: 'https://qkart-1jo4.onrender.com/api/v1'
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Products} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/thanks" component={Thanks} />
        <Route exact path="/v1/register" component={V1Register} />
      </Switch>
    </div>
  );
}

export default App;
