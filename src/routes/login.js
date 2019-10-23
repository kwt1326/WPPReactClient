import React, { Component} from 'react';
import axios from 'axios';
import { checklogin, islive, api } from '../custom/custom'
import '../css/style.css';

class Login extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            reDirect : false,
            from : "",
        }

        this.resframe = null;
        this.state.from = this.getfrom();
        this.Init();
    }

    getfrom = () => {
        const self = this;
        let from = null;
        if (self.props.location.search) {
            from = self.props.location.search.split('?from=')[1];
        }
        return from; 
    }

    Init = () => {
        if(this.state.from) {
            checklogin()
            .then(res => {
                this.reDirection();
            });
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
        const from = (this.state.from) ? this.state.from : "";
        window.location.replace('/' + from);
    }

    login_strategy = ( strategy ) => {
        axios({
            method : 'get',
            url : (islive()) ? api + 'api/auth/social/' + strategy : 'api/auth/social/' + strategy,
            headers : {
                'Content-Type' : 'application/json'
            },
        })
        .then(res => {
            window.location.replace('/');
        })
        .catch(err => {
            alert(err);
        })
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
                    <input type="submit" className="selector-deep" style={{ minWidth : "220px", margin : "10px"}} value="LOGIN"></input>
                </form>
                <div style={{textAlign: 'center'}}>
                    <button className="selector-facebook btn-style" style={{ minWidth : "220px", backgroundColor : "rgba(59, 89, 152, 1)", color : "white", margin : "10px"}} onClick={() => {this.login_strategy('facebook')}}>Facebook</button><br/>
                    <button className="selector-google btn-style" style={{ minWidth : "220px", backgroundColor : "rgba(223, 74, 50, 1)", color : "white", margin : "10px"}} onClick={() => {this.login_strategy('google')}}>Google</button>
                    <br/>
                    <a href="/join" className="selector-deep" style={{ color : "white" }}>You are not have been id? come here!</a><br/><br/>
                    <a href="/auth/e-mail" className="selector-deep" style={{ color : "white" }}>Forgot the password for your account?</a>
                </div>
            </div>
        );
    }
};

export default Login;