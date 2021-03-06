import React, { Component} from 'react';
import { checklogin, islive, api } from '../custom/custom'
import '../css/style.css';

class Login extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            from : "",
        }

        this.resframe = null;
        this.state.from = this.getfrom();
        this.Init();
    }

    getfrom = () => {
        let from = null;
        if (this.props.location.search) {
            from = this.props.location.search.split('?from=')[1];
        }
        return from; 
    }

    Init = () => {
        const self = this;
        if(this.state.from) {
            checklogin()
            .then(res => {
                this.reDirection();
            });
        }
        else {
            checklogin()
            .then(res => {
                self.props.history.push('/');
            });
        }
    }

    onClick_facebook = () => {
        window.location.href = (islive()) ? api + `/api/auth/social/facebook` : `/api/auth/social/facebook`;
    }

    onClick_google = () => {
        window.location.href = (islive()) ? api + `/api/auth/social/google` : `/api/auth/social/google`;
    }

    reDirection = () => {
        const from = (this.state.from) ? this.state.from : "";
        this.props.history.push('/' + from);
    }

    render () {
        const path = (islive()) ? api + "/api/auth/login" : "/api/auth/login";
        const facebook_href = (islive()) ? api + `/api/auth/social/facebook` : `/api/auth/social/facebook`;
        const google_href = (islive()) ? api + `/api/auth/social/google` : `/api/auth/social/google`;
        return (
            <div className="Login" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white" }}>
                <form className="inputform" action={path} method="post">
                    <h2>A/ Q/ U/ A Login</h2><br/>
                    ID&nbsp;&nbsp; : <input type="email" name="email"></input><br/>
                    PW : <input type="password" name="password"></input><br/>
                    <input type="submit" className="selector-deep" style={{ minWidth : "220px", margin : "10px"}} value="LOGIN"></input>
                </form>
                <div style={{textAlign: 'center'}}>
                    <a href={facebook_href}><button className="selector-facebook btn-style" style={{ minWidth : "220px", backgroundColor : "rgba(59, 89, 152, 1)", color : "white", margin : "10px"}} >Facebook</button></a><br/>
                    <a href={google_href}><button className="selector-google btn-style" style={{ minWidth : "220px", backgroundColor : "rgba(223, 74, 50, 1)", color : "white", margin : "10px"}} >Google</button></a><br/>
                    <a href="/join" className="selector-deep" style={{ color : "white" }}>가입한 계정이 없으신가요? 여기에요!</a><br/><br/>
                    <a href="/auth/e-mail" className="selector-deep" style={{ color : "white" }}>이메일 계정의 비밀번호를 잊으셨나요? 여기서 도와드릴게요.</a>
                </div>
            </div>
        );
    }
};

export default Login;