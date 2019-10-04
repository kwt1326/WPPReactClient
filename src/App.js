import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';

// Common
import Header from './components/header/index';
import Footer from './components/footer';
import Intro from './components/intro';
import Main from './components/main';
import Menulist from './components/menulist';

// Route
import Login from './routes/login';
import Join from './routes/join';
import User from './routes/user';
import Write from './routes/write';
import Reading from './routes/reading';
import Freeboard from './routes/freeboard';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header id="header"><Header /></header>
        <div id="intro"><Intro /></div>
        <div id="main">
          <Route exact path="/" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/Join" component={Join} />
          <Route path="/user" component={User} />
          <Route path="/write" component={Write} />
          <Route path="/reading" component={Reading} />
          <Route path="/board" component={Freeboard} />
        </div>
        <div id="cover"></div>
        <div id="virtual-cover">
          <Menulist />
        </div>
        <footer id="footer"><Footer /></footer>
      </div>
    </BrowserRouter>
  );
}
export default App;

// !!! Custom Component Name is Must be start from 'Upper case' !!! //
// if not , this code not working => <componentName />