import React, { Component} from 'react';
import { checklogin, logout, islive, api } from '../custom/custom'
import axios from 'axios';
import '../css/style.css';

class Auth_CPW extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            verify : this.getVerifyKey(),
        }
        this.Init();

        this.pw_alert = "* 중요 ! 6-14 자의 영문 + 숫자 + 특수문자 (가능: '!@#$%^&*()')가 1개 이상 조합되어야 합니다.";
        this.pw = React.createRef();
        this.pwCheck = React.createRef();
    }

    Init = () => {
        checklogin()
        .then(res => { 
            logout(); 
        });
    }

    getVerifyKey = () => {
        if(this.props.location.search) {
            return this.props.location.search.split('?verify=')[1];
        }
        else return null;
    }

    change_password = () => {
        const self = this;
        axios({
            method : 'patch',
            url : (islive()) ? api + "/api/auth/cpw" : "/api/auth/cpw",
            params : {
                pw : this.pw.value,
                pwCheck : this.pwCheck.value,
                verify : this.state.verify
            }
        })
        .then(res => {
            alert("비밀번호 변경에 성공하였습니다.")
            self.props.history.push('/login');
        })
        .catch(err => {
            alert("비밀번호를 변경할 수 없습니다.");
        })
    }

    render () {
        const path = (islive()) ? api + "/api/auth/cpw" : "/api/auth/cpw";
        return (
            <div className="Auth" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white", textAlign : "center" }}>
                <form className="inputform" action={path} method="post">
                    <h2>A/ Q/ U/ A - 비밀번호 변경</h2><br/>
                    <div data-tooltip={this.pw_alert}>PW&nbsp;&nbsp; : <input type="password" name="password" ref={(mount) => {this.pw = mount}}></input></div><br/>
                    <div>PW - ReCheck&nbsp;&nbsp; : <input type="password" name="pwcheck" ref={(mount) => {this.pwCheck = mount}}></input></div><br/>
                </form><br/>
                <button className="selector-deep btn-style" onClick={this.change_password}>Submit</button><br/>
            </div>
        );
    }
};

export default Auth_CPW;