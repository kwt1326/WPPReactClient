import React from 'react';
import { Route } from 'react-router-dom';
import '../css/style.css';
// component
import Boardframe from './boardFrame';

// routes
import Login from '../routes/login';
import Join from '../routes/join';
import User from '../routes/user';
import Auth from '../routes/auth'
import Auth_CPW from '../routes/auth_cpw';
import Contact from '../routes/contact';
import Main from '../routes/main';
import Introduce from '../routes/introduce';

function MainSection () {    
    return (
        <section id="main">
          <Route exact path="/" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/auth/e-mail" component={Auth} />
          <Route path="/auth/cpw" component={Auth_CPW} />
          <Route path="/Join" component={Join} />
          <Route path="/user" component={User} />
          <Route path="/board/:name" component={Boardframe} />
          <Route exact path="/Introduce" component={Introduce} />
          <Route exact path="/contact" component={Contact} />
        </section>
    )
}

export default MainSection;