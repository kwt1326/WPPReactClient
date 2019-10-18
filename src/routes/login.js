import React, { Component} from 'react';
import { Redirect } from 'react-router-dom';
import { checklogin, islive, api } from '../custom/custom'
import '../css/style.css';

class Login extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            reDirect : false,
        }

        this.resframe = null;
        this.Init();
    }

    Init = () => {
        if(this.props.location.state) {
            if(this.props.location.state.from === 'header') {
                checklogin()
                .then(res => {
                    this.reDirection();
                });
            }
        }
    }

    onLoad = () => {
        if(window.sessionStorage.getItem('token'))
            this.reDirection();
        else if(this.resframe.contentDocument.body.innerText) {
            window.sessionStorage.setItem('token', this.resframe.contentDocument.body.innerText);
            this.reDirection();
        }
    }

    reDirection = () => {
        this.props.history.push('./user');
    }

    render () {
        const path = (islive()) ? api + "/api/auth/login" : "/api/auth/login";
        return (
            <div className="Login" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white" }}>
                <iframe id="responseframe" ref={(mount) => {this.resframe = mount}} name="responseframe" style={{display : "none"}} onLoad={this.onLoad}></iframe>
                <form className="inputform" action={path} method="post" target="responseframe">
                    <h2>A/ Q/ U/ A Login</h2><br/>
                    ID&nbsp;&nbsp; : <input type="email" name="email"></input><br/>
                    PW : <input type="password" name="password"></input><br/>
                    <input type="submit" className="selector-deep" value="LOGIN"></input><br/><br/>
                    <a href="/join" className="selector-deep" style={{ color : "white" }}>You are not have been id? come here!</a><br/><br/>
                    <a href="/auth/e-mail" className="selector-deep" style={{ color : "white" }}>Forgot the password for your account?</a>
                </form>
            </div>
        );
    }
};

export default Login;