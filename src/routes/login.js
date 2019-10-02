import React, { Component} from 'react';
import { checklogin, islive } from '../custom/custom'
import '../css/style.css';

class Login extends Component 
{
    constructor(props) {
        super(props);
        this.Init = this.init.bind(this);
        this.Init();
    }

    init () {
        const self = this;
        if(self.props.location.state) {
            if(self.props.location.state.from === 'header') {
                checklogin('./');
            }
        }
    }

    render () {
        return (
            <div className="Login">
                <form className="inputform" action={() => { 
                    alert(process.env.API_PATH + process.env.NODE_ENV);
                    return (islive()) ? process.env.API_PATH + "/api/auth/login" : "/api/auth/login"
                }} method="post">
                    <h2>Cafe of Study Login</h2><br/>
                    ID&nbsp;&nbsp; : <input type="email" name="email"></input><br/>
                    PW : <input type="password" name="password"></input><br/>
                    <input type="submit" className="selector-deep" value='LOGIN'></input><br/><br/>
                    <a href="/join" className="selector-deep">You are not have been id? come here!</a>
                </form>
            </div>
        );
    }
};

export default Login;