import React, { Component} from 'react';
import {checklogin, api, islive} from '../custom/custom';
import axios from 'axios';
import '../css/style.css';

class User extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            email : "E-mail",
            nickname : "Nickname",
            username : "Username",
        }
    }

    getuserinfo() 
    {    
        const thisobj = this;

        checklogin()
        .then((res) => {
            const data = res.userdata.data;
            thisobj.setState({
                email : data.email,
                nickname : data.nickname,
                username : data.username,
            }, () => { // setState 는 promise 반환 하지 않으므로 자체 콜백 기능 사용
                const emailinput = document.getElementsByName('user_email')[0];
                const nickinput = document.getElementsByName('user_nickname')[0];
                const userinput = document.getElementsByName('user_username')[0];
                emailinput.placeholder = thisobj.state.email;
                nickinput.placeholder = thisobj.state.nickname;
                userinput.placeholder = thisobj.state.username;
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // REST API
    // 1. update
    user_update () 
    {
        const thisobj = this;
        const emailinput = document.getElementsByName('user_email')[0];
        const nickinput = document.getElementsByName('user_nickname')[0];
        const userinput = document.getElementsByName('user_username')[0];
        axios({
            method: 'patch',
            url: (islive()) ? api + '/api/user/' + thisobj.state.email : '/api/user/' + thisobj.state.email,
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                email: emailinput.value,
                nickname: nickinput.value,
                username: userinput.value
            }
        })
            .then(function (response) {
                console.log(response.data.result);
                alert('개인정보가 수정되었습니다.');
                return;
            })
            .catch((err) => {
                console.log(err);
            });            
    }

    render () {
        return (
            <div className="User" style={{ backgroundColor : 'white'}}>
                <div className="inputform">
                    <div style={{ padding : '10%' }}>
                    <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>E-Mail</section>
                    <input type="email" name="user_email" placeholder={this.state.email}></input><br/>
                    <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>Nickname</section>
                    <input type="text" name="user_nickname" placeholder={this.state.nickname}></input><br/>
                    <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>Username</section>
                    <input type="text" name="user_username" placeholder={this.state.username}></input><br/>
                    <button className="btn-style" onClick={this.user_update.bind(this)}>수정</button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getuserinfo();
    }
};

export default User;