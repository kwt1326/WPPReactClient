import React, { Component} from 'react';
import { checklogin, islive, api, logout } from '../custom/custom'
import '../css/style.css';
import { func } from 'prop-types';

class Auth extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            reDirect : this.redirect_result(),
        }

        this.Init();
    }

    Init = () => {
        checklogin()
        .then(res => {
            logout();
        });
    }

    redirect_result = () => {
        if(this.props.location.search) {
            const result = this.props.location.search.split('?result=')[1];
            if(result === 'true') {
                return true;
            }
        }
        else return false;
    }

    auth_form = () => {
        if(this.state.reDirect === false) {
            return (
                <div>
                    E-mail&nbsp;&nbsp; : <input type="email" name="email"></input><br/>
                    <input type="submit" className="selector-deep" value='Submit'></input><br/>
                </div>
            )
        }
        else { return (<div><h3>{"유저님께 인증 메일을 발송하였습니다. 메일함을 확인해주세요."}</h3></div>) }
    }

    render () {
        const path = (islive()) ? api + "/api/auth/mail/send" : "/api/auth/mail/send"; // 현재 이메일 인증 뿐
        return (
            <div className="Auth" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white" }}>
                <form className="inputform" action={path} method="post">
                    <h2>A/ Q/ U/ A - 이메일 인증</h2><br/>
                    {this.auth_form()}
                </form>
            </div>
        );
    }
};

export default Auth;