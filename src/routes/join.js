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
            reDirection : null,
            alertpass : false,
            alertname : false,
            alertnick : false,
        }

        this.pw_alert = "* 중요 ! 6-14 자의 영문 + 숫자 + 특수문자 (가능: '!@#$%^&*()')가 1개 이상 조합되어야 합니다.";
        this.name_alert = "* 중요 ! 2-7 자의 한글만 등록 가능 합니다.";
        this.nickname_alert = "* 중요 ! 6-14 자의 영문 or 숫자만 등록 가능 합니다.";

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
                <table style={{ backgroundColor : "midnightblue", color : "white", borderTop: "0px", borderBottom: "0px"}}>
                    <thead>
                        <tr>
                            <td colSpan="2">
                                <div className="join-title" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}><h2>A/ Q/ U/ A Join Page</h2></div>
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="2">
                                <div style={{float : "left", width : "50%", textAlign : "left"}}>E-mail Join Form is here.</div>
                                <div style={{float : "right", width : "50%", textAlign : "right"}}>Your SNS Account Join is here.</div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '50%' }}>
                                <div className="join-email" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-email" type='email' ref={(mount) => { this.email_form = mount;} } placeholder="E-mail : " />
                                    </div>
                                </div>
                            </td>
                            <td rowSpan="2">
                                <div className="join-facebook" style={{ display: 'table' , width : '100%', height : "50px"}}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' , textAlign : 'center'}}>
                                        <button className="join-btn-facebook btn-style selector-facebook" 
                                        style={{ backgroundColor : "rgb(59, 89, 152)", color : "white", width : "80%", height : "100%" }} 
                                        onClick={this.join_facebook.bind(this)}>facebook Sign up</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="join-password" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-password" type='password' ref={(mount) => { this.password_form = mount;} } placeholder="Password : " /><br/>
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
                                <div className="join-rePassword" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-rePassword" type='password' ref={(mount) => { this.rePassword_form = mount;} } placeholder="Re-Password : " />
                                    </div>
                                </div>
                            </td>
                            <td rowSpan="2">
                                <div className="join-google" style={{ display: 'table' , width : '100%', height : "50px"}}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign : 'center' }}>
                                        <button className="join-btn-google btn-style selector-google" 
                                        style={{ backgroundColor : "rgb(223, 74, 50)", color : "white", width : "80%", height : "100%" }}
                                        onClick={this.join_google.bind(this)}>google Sign up</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="join-name" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-name" type='text' ref={(mount) => { this.name_form = mount;} } placeholder="Your Name : "/>
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
                                <div className="join-nickname" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }} placeholder="NickName">
                                        <input id="join-nickname" type='text' ref={(mount) => { this.nickname_form = mount;} } placeholder="NickName : "/>
                                        {() => {
                                            if(this.state.alertnick)
                                                return this.nickname_alert;
                                            else return null;
                                        }}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="join-emailform" style={{ display: 'table', width : "100%" }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <button className="join-btn-email btn-style selector-deep" style={{ width : "100%" }}
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
            </div>
        );
    }

    join_email = () => 
    {
        const email = this.email_form.value;
        const password = this.password_form.value;
        const rePassword = this.rePassword_form.value;
        const name = this.name_form.value;
        const nickname = this.nickname_form.value;

        //^[가-힣]*$
        const nameKR_pat = /^([가-힣]*).{2,7}$/ // for korean
        const nickname_pat = /^([a-zA-Z0-9]*).{6,14}$/
        const pw_pat = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*()]).{6,14}$/

        if(!email)
            alert("이메일을 입력해주세요.");
        else if(!password)
            alert("비밀번호를 입력해주세요.");
        else if(!rePassword)
            alert("비밀번호 재확인란을 입력해주세요.");
        else if(!name || !nameKR_pat.test(name))
            alert("이름이 존재하지 않거나 유효하지 않습니다.");
        else if(!nickname || !nickname_pat.test(nickname))
            alert("별명이 존재하지 않거나 유효하지 않습니다.");
        else if(password !== rePassword)
            alert('입력하신 비밀번호는 같지 않습니다.');
        else if(!pw_pat.test(password))
            alert('비밀번호가 유효하지 않습니다. 조건을 다시 확인해주세요.');
        else 
        {
            async function join () {
                await axios({
                    method: 'post',
                    url: (islive()) ? api + '/api/join' : '/api/join',
                    params : { 
                        email, password, name, nickname
                    }
                })
                .then(res => {
                    this.setState({ reDirection : "login" });
                })
                .catch (err => {
                    console.log("Can't joined error : " + err);
                })
            }
            
            join();
        }
    }

    join_facebook () {
        
    }

    join_google () {
        
    }
};

export default Join;