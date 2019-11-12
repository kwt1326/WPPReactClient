import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { changescreenstate } from './reducer/screen';
import './App.css';

// Common
import Header from './components/header';
import Footer from './components/footer';
import Menulist from './components/menulist';
import MainSection from './components/mainsection';

axios.defaults.headers = { 
  Authorization: `Bearer ${window.sessionStorage.getItem('token')}` 
};

class App extends Component {
  render () {
    return (
      <div className="App">
        <BrowserRouter>
        <Route path="/*" component={Header} />
        <MainSection/>
        <Route path="/*" component={Menulist } />
        <Footer />
        </BrowserRouter>
      </div>
    );
  }

  resize = () => {
    if(window.innerWidth <= 720) {
      if(window.innerWidth <= 600) {
        if(this.props.screenstate !== 'phone') {
            this.props.changescreenstate('phone');
            return;
          }    
        }
        else
        if(this.props.screenstate !== 'mobile') {
            this.props.changescreenstate('mobile');
            return;
        }
    }
    else if(window.innerWidth > 720) {
        if(this.props.screenstate !== 'desktop') {
            this.props.changescreenstate('desktop');
        }
    } 
  }

  handle_resize = () => {
    setTimeout(this.resize, 100);
  }

  componentDidMount () {
    window.addEventListener('resize', this.handle_resize);
    this.resize();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handle_resize);
  }
}

// props 로 넣어줄 스토어 상태값
const mapStateToProps = state => ({
  screenstate: state.screen.screenstate,
});
  
// props 로 넣어줄 액션 생성함수
const mapDispatchToProps = dispatch => ({
  changescreenstate: screenstate => dispatch(changescreenstate(screenstate)),
});  

export default connect(mapStateToProps, mapDispatchToProps)(App);

// !!! Custom Component Name is Must be start from 'Upper case' !!! //
// if not , this code not working => <componentName />