import React, { Component} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Common
import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';
import Menulist from './components/menulist';
import Introduce from './components/introduce';

// Route
import Login from './routes/login';
import Join from './routes/join';
import User from './routes/user';
import Write from './routes/write';
import Reading from './routes/reading';
import Board from './routes/board';
import Auth from './routes/auth'
import Auth_CPW from './routes/auth_cpw';
import { string } from 'prop-types';

axios.defaults.headers = { 
  Authorization: `Bearer ${window.sessionStorage.getItem('token')}` 
};

function App () {
  return (
    <BrowserRouter>
      <div className="App">
        <header id="header"><Header /></header>
        <section id="main">
          <div id="main-div">
            <Route exact path="/" component={Main} />
            <Route path="/login" component={Login} />
            <Route path="/auth/e-mail" component={Auth} />
            <Route path="/auth/cpw" component={Auth_CPW} />
            <Route path="/Join" component={Join} />
            <Route path="/user" component={User} />
            <Route path="/write" component={Write} />
            <Route path="/reading" component={Reading} />
            <Route path="/board/:page" component={Board} />
            <Route exact path="/Introduce" component={Introduce} />
          </div>
        </section>
        <div id="cover"></div>
        <div id="virtual-cover">
          <Menulist />
        </div>
        <footer id="footer">
          <div><Footer /></div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;

// !!! Custom Component Name is Must be start from 'Upper case' !!! //
// if not , this code not working => <componentName />