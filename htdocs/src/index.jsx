import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

// Import top-level components
import Main from './Main.jsx';
import Home from './home/Section.jsx';
import Info from './info/Section.jsx';
import Contracts from './contracts/Section.jsx';
import Indicators from './indicators/Section.jsx';
import Register from './register/Section.jsx';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={Main}>
      <Route path="/" component={Home}/>
      <Route path="/information" component={Info}/>
      <Route path="/contracts" component={Contracts}/>
      <Route path="/indicators" component={Indicators}/>
      <Route path="/register" component={Register}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
