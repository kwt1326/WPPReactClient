import React, { Component} from 'react';
import { checklogin, islive, api } from '../custom/custom'
import '../css/style.css';

class Auth extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            reDirect : false,
            method : "E-mail",
        }

        this.Init();
    }

    Init = () => {
        const self = this;
        //checklogin('')
        //.then(res => {
        //    self.setState({ reDirect : true });
        //});
    }

    render () {
        const path = (islive()) ? api + "/api/auth/mailing" : "/api/auth/mailing"; // 현재 이메일 인증 뿐
        return (
            <div className="Auth" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white" }}>
                <form className="inputform" action={path} method="post">
                    <h2>A/ Q/ U/ A {this.state.method} - Auth Page</h2><br/>
                    ID&nbsp;&nbsp; : <input type="email" name="email"></input><br/>
                    <input type="submit" className="selector-deep" value='Submit'></input><br/>
                </form>
            </div>
        );
    }
};

export default Auth;