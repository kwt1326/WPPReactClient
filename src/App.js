import React, { Component} from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';

// Common
import Header from './components/header/index';
import Footer from './components/footer';
import Main from './components/main';
import Menulist from './components/menulist';

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        screenstate : 'desktop',
    };
    this.main_ref = React.createRef();
    this.footer_ref = React.createRef();
  }

  render () {
    return (
      <BrowserRouter>
        <div className="App">
          <header id="header"><Header /></header>
          <div id="intro">{/*<Intro />*/}</div>
          <section id="main">
            <div id="main-div" ref={(mount) => {this.main_ref = mount}}>
              <Route exact path="/" component={Main} />
              <Route path="/login" component={Login} />
              <Route path="/auth/e-mail" component={Auth} />
              <Route path="/auth/cpw" component={Auth_CPW} />
              <Route path="/Join" component={Join} />
              <Route path="/user" component={User} />
              <Route path="/write" component={Write} />
              <Route path="/reading" component={Reading} />
              <Route path="/board/:page" component={Board} />
            </div>
          </section>
          <div id="cover"></div>
          <div id="virtual-cover">
            <Menulist />
          </div>
          <footer id="footer">
            <div ref={(mount) => {this.footer_ref = mount}}><Footer /></div>
          </footer>
        </div>
      </BrowserRouter>
    );
  }

  resize () {
    if(window.innerWidth <= 720) {
        if(this.state.screenstate !== 'mobile') {
            this.setState({ screenstate : 'mobile' });
            return;
        }
    }
    else if(window.innerWidth > 720) {
        if(this.state.screenstate !== 'desktop') {
            this.setState({ screenstate : 'desktop' });
            return;
        }
    } 
  }
}
export default App;

// !!! Custom Component Name is Must be start from 'Upper case' !!! //
// if not , this code not working => <componentName />