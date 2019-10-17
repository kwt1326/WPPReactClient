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
        }

        this.email_input = React.createRef();
        this.password_input = React.createRef();
        //this.Init();
    }

    // Init = () => {
    //     const self = this;
    //     if(self.props.location.state) {
    //         if(self.props.location.state.from === 'header') {
    //             checklogin('')
    //             .then(res => {
    //                 self.setState({ reDirect : true });
    //             });
    //         }
    //     }
    // }

    onLogin = () => 
    {
        //const httpRequest = new XMLHttpRequest();
        //httpRequest.onreadystatechange = alertContents;
        //httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //httpRequest.open('POST', (islive()) ? api + "/api/auth/login" : "/api/auth/login");
        //httpRequest.send('?email=' + this.email_input.value + '&password=' + this.password_input.value);

        axios({
            method: 'post',
            url: (islive()) ? api + "/api/auth/login" : "/api/auth/login",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            email : this.email_input.value,
            password : this.password_input.value,
        })
        .then(function (response) {   
            window.sessionStorage.setItem('user' , response.data.user);
            window.sessionStorage.setItem('token' , response.data.token);
        })
        .catch((err) => {
            alert("이메일과 비밀번호를 다시 확인해주세요.");
        });    
    }

    render () {
        return (
            <div className="Login" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white" }}>
                <div className="inputform">
                    <h2>A/ Q/ U/ A Login</h2><br/>
                    ID&nbsp;&nbsp; : <input type="email" ref={(mount) => {this.email_input = mount}} name="email"></input><br/>
                    PW : <input type="password" ref={(mount) => {this.password_input = mount}} name="password"></input><br/>
                    <button className="btn-style selector-deep" onClick={this.onLogin}>LOGIN</button><br/><br/>
                    <a href="/join" className="selector-deep" style={{ color : "white" }}>You are not have been id? come here!</a><br/><br/>
                    <a href="/auth/e-mail" className="selector-deep" style={{ color : "white" }}>Forgot the password for your account?</a>
                </div>
            </div>
        );
    }
};

export default Login;