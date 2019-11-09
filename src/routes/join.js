import React, { Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { islive, api } from '../custom/custom'
import '../css/style.css';

class Join extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            screenstate : 'desktop',
            reDirection : null,
            alertpass : false,
            alertname : false,
            alertnick : false,
        }

        this.pw_alert = "* 중요 ! 6-14 자의 영문 + 숫자 + 특수문자 (가능: '!@#$%^&*()')가 1개 이상 조합되어야 합니다.";
        this.name_alert = "* 중요 ! 2-7 자의 한글만 등록 가능 합니다.";
        this.nickname_alert = "* 중요 ! 4-14 자의 영문 or 숫자만 등록 가능 합니다.";

        this.email_form = React.createRef();
        this.password_form = React.createRef();
        this.rePassword_form = React.createRef();
        this.name_form = React.createRef();
        this.nickname_form = React.createRef();
    }

    render () {
        if(this.state.reDirection !== null) {
            return (<Redirect push to={this.state.reDirection}/>);
        }
        else
        return (
            <div className="Join">
                {this.render_table()}
            </div>
        );
    }

    render_table = () => {
        return (
        <table style={{ backgroundColor : "midnightblue", color : "white", borderTop: "0px", borderBottom: "0px", textAlign : "center"}}>
        <thead>
            <tr>
                <td>
                    <div className="join-title" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}><h2>A/ Q/ U/ A Join Page</h2></div>
                    </div>
                </td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div style={{ textAlign : "left"}}>E-mail Join Form is here.</div>
                </td>
            </tr>
            <tr>
                <td>
                    <div className="join-email" style={{ display: 'table', width : '100%' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                            <input id="join-email" style={{  width : '90%' }} type='email' ref={(mount) => { this.email_form = mount;} } placeholder="E-mail : " />
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div className="join-password" style={{ display: 'table' , width : '100%'}}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }} data-tooltip={this.pw_alert}>
                            <input id="join-password" style={{  width : '90%' }} type='password' ref={(mount) => { this.password_form = mount;} } placeholder="Password : " /><br/>
                            {() => {
                                if(this.state.alertpass)
                                    return this.pw_alert;
                                else return null;
                            }}
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div className="join-rePassword" style={{ display: 'table', width : '100%' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                            <input id="join-rePassword" style={{  width : '90%' }} type='password' ref={(mount) => { this.rePassword_form = mount;} } placeholder="Re-Password : " />
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div className="join-name" style={{ display: 'table', width : '100%' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }} data-tooltip={this.name_alert}>
                            <input id="join-name" style={{  width : '90%' }} type='text' ref={(mount) => { this.name_form = mount;} } placeholder="Your Name : "/>
                            {() => {
                                if(this.state.alertname)
                                    return this.name_alert;
                                else return null;
                            }}
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div className="join-nickname" style={{ display: 'table', width : '100%'  }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }} placeholder="NickName" data-tooltip={this.nickname_alert}>
                            <input id="join-nickname" style={{  width : '90%' }} type='text' ref={(mount) => { this.nickname_form = mount;} } placeholder="NickName : "/>
                            {() => {
                                if(this.state.alertnick)
                                    return this.nickname_alert;
                                else return null;
                            }}
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div className="join-emailform" style={{ display: 'table', width : "100%" }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                            <button className="join-btn-email btn-style selector-deep" style={{ width : "90%" }}
                            onClick={this.join_email}>E-mail Join</button>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colSpan='2' style={{ textAlign : 'right', paddingRight : '0%'}}>
                    <div className="join-footer" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>If you have any questions, please send them to my u1326@hotmail.com.</div>
                    </div>
                </td>
            </tr>
        </tfoot>
        </table>
        );    
    }

    join_email = () => 
    {
        const self = this;
        const email = this.email_form.value;
        const password = this.password_form.value;
        const rePassword = this.rePassword_form.value;
        const name = this.name_form.value;
        const nickname = this.nickname_form.value;

        const kr_pat_include = /[가-힣]/;
        const kr_pat = /^[가-힣]+$/; // for korean
        const nick_pat = /^[a-zA-Z0-9]+$/;

        const pw_pat1 = /[a-zA-Z]/;
        const pw_pat2 = /[0-9]/;
        const pw_pat3 = /[!@#$%^&*()]/;

        if(!email)
            alert("이메일을 입력해주세요.");
        else if(!password)
            alert("비밀번호를 입력해주세요.");
        else if(!rePassword)
            alert("비밀번호 재확인란을 입력해주세요.");
        else if(!name || !kr_pat.test(name) || !(name.length >= 2 && name.length <= 7 ))
            alert("이름이 존재하지 않거나 유효하지 않습니다.");
        else if(!nickname || !nick_pat.test(nickname) || !(nickname.length >= 4 && nickname.length <= 14 ))
            alert("별명이 존재하지 않거나 유효하지 않습니다.");
        else if(password !== rePassword)
            alert('입력하신 비밀번호는 같지 않습니다.');
        else if(!pw_pat1.test(password) || !pw_pat2.test(password) || !pw_pat3.test(password) || kr_pat_include.test(password) ||
            !(password.length >= 6 && password.length <= 14 ))
            alert('비밀번호가 유효하지 않습니다. 조건을 다시 확인해주세요.');
        else 
        {
            async function join () {
                await axios({
                    method: 'post',
                    url: (islive()) ? api + '/api/join' : '/api/join',
                    headers: {
                        'Content-Type': 'application/json',
                    },        
                    params : { 
                        email, password, name, nickname
                    }
                })
                .then(res => {
                    alert("가입에 성공했습니다. 환영합니다!");
                    self.setState({ reDirection : "login" });
                })
                .catch (err => {
                    alert("가입 요청이 실패하였습니다. : " + err);
                })
            }
            
            join();
        }
    }

    resize = () => {
        if(window.innerWidth <= 720) {
            if(this.state.screenstate !== 'mobile') {
                this.setState({ screenstate : 'mobile' });
            }
        }
        else if(window.innerWidth > 720) {
            if(this.state.screenstate !== 'desktop') {
                this.setState({ screenstate : 'desktop' });
            }
        } 
    }

    handle_resize = () => {
        setTimeout(this.resize, 100);
    }

    componentDidMount () {
        window.addEventListener('resize', this.handle_resize);
        this.resize();
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.handle_resize);
    }
};

export default Join;