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
        })
        .catch(err => {
            alert("비밀번호를 변경할 수 없습니다.");
        })
    }

    render () {
        const path = (islive()) ? api + "/api/auth/cpw" : "/api/auth/cpw";
        return (
            <div className="Auth" style={{ padding: "50px", backgroundColor : "midnightblue", color : "white" }}>
                <form className="inputform" action={path} method="post">
                    <h2>A/ Q/ U/ A - 비밀번호 변경</h2><br/>
                    PW&nbsp;&nbsp; : <input type="password" name="password" ref={(mount) => {this.pw = mount}}></input><br/>
                    PW - ReCheck&nbsp;&nbsp; : <input type="password" name="pwcheck" ref={(mount) => {this.pwCheck = mount}}></input><br/>
                </form>
                <button className="selector-deep btn-style" onClick={this.change_password}>Submit</button><br/>
            </div>
        );
    }
};

export default Auth_CPW;