import React, { Component} from 'react';
import { checklogin, islive, api } from '../custom/custom'
import '../css/style.css';

class Login extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            reDirect : false,
        }

        this.Init();
    }

    Init = () => {
        const self = this;
        if(self.props.location.state) {
            if(self.props.location.state.from === 'header') {
                checklogin('')
                .then(res => {
                    self.setState({ reDirect : true });
                });
            }
        }
    }

    render () {
        const path = (islive()) ? api + "/api/auth/login" : "/api/auth/login";
        return (
            <div className="Login" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white" }}>
                <form className="inputform" action={path} method="post">
                    <h2>A/ Q/ U/ A Login</h2><br/>
                    ID&nbsp;&nbsp; : <input type="email" name="email"></input><br/>
                    PW : <input type="password" name="password"></input><br/>
                    <input type="submit" className="selector-deep" value='LOGIN'></input><br/><br/>
                    <a href="/join" className="selector-deep" style={{ color : "white" }}>You are not have been id? come here!</a><br/><br/>
                    <a href="/auth/e-mail" className="selector-deep" style={{ color : "white" }}>Forgot the password for your account?</a>
                </form>
            </div>
        );
    }
};

export default Login;