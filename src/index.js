import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import Map from "./components/Map/MapPage";
import Home from "./components/Home/HomePage";
import Chart from "./components/Chart/ChartPage";
import Timeline from "./components/Timeline/TimelinePage";
import * as serviceWorker from "./serviceWorker";

var hist = createBrowserHistory();

ReactDOM.render(<Router history={hist}>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/map" component={Map} />
    <Route path="/timeline" component={Timeline} />
    <Route path="/chart" component={Chart} />
  </Switch>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
