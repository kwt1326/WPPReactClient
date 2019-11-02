import React, { Component} from 'react';
import { Redirect } from 'react-router-dom';
import {checklogin, api, local, islive} from '../custom/custom';
import axios from 'axios';
import '../css/style.css';
import unknown from '../image/unknown.png';

class User extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
            screenstate : 'desktop',
            email : "E-mail",
            nickname : "Nickname",
            username : "Username",
            profileimg : unknown,
            loadimgname : "",
            reDirection : 'none',
        }

        this.profileimg = React.createRef();
        this.email = React.createRef();
        this.username = React.createRef();
        this.nickname = React.createRef();
        this.file = null;

        this.getuserinfo();
    }

    getuserinfo() 
    {    
        const self = this;

        checklogin()
        .then((res) => {
            const data = res.userdata.data;
            self.setState({
                email : data.email,
                nickname : data.nickname,
                username : data.username,
                profileimg : data.profileimg,
                loadimgname : data.profileimg,
                provider : data.provider
            }, () => { 
                const emailinput = self.email;
                const nickinput = self.nickname;
                const userinput = self.username;
                emailinput.placeholder = self.state.email;
                nickinput.value = self.state.nickname;
                userinput.value = self.state.username;
            });
        })
        .catch((err) => {
            alert("로그인을 먼저 해주세요.");
            self.props.history.push('/login');
        })
    }

    // REST API
    // 1. update
    user_update () 
    {
        const self = this;
        const nickinput = self.nickname;
        const userinput = self.username;
        const formData = new FormData();
        formData.append('img', this.file);
        let filename = "";

        // image upload
        async function Edit() {
            if(self.file !== null) {
                await axios({
                    method: 'post',
                    url: (islive()) ? api + '/api/post/files/ci' : '/api/post/files/ci',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: formData,
                })
                .then(res => {
                    filename = res.data.url;
                })
                .catch((err) => {
                    alert(err);
                });    
            }
    
            await axios({
                method: 'patch',
                url: (islive()) ? api + '/api/user/' : '/api/user/',
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    nickname: nickinput.value,
                    username: userinput.value,
                    profileimg : (filename) ? filename : unknown,
                }
            })
            .then(function (response) {
                console.log(response.data.result);
                alert('개인정보가 수정되었습니다.');
                window.location.reload();
                return;
            })
            .catch((err) => {
                alert(err);
            });                
        }

        Edit();
    }

    // 2. delete
    user_delete = () => {
        axios({
            method: 'delete',
            url: (islive()) ? api + '/api/user/' : '/api/user/',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(function (response) {
            alert('회원탈퇴가 완료되었습니다.');
            window.location.replace('/');
            return;
        })
        .catch((err) => {
            alert(err);
        });
    }

    use_changeimage = () => {
        if(this.state.provider === 'local')
            return (
                <input className="btn-style" style={{
                    display: 'table-cell', width: "180px", position: "relative", textAlign: "left", left: "calc(50% - 90px)", marginTop: "1%", marginBottom: "1%"
                }} id="profileimg" type="file" accept=".jpg, .jpeg, .png" ref={(mount) => { this.profileimg = mount; }} onChange={this.onChange_profileimg}></input>
            )
        else return null;
    }

    render () {
        if(this.state.reDirection !== 'none')
            return (<Redirect push to={this.state.reDirection}/>);

        if(this.state.screenstate === "mobile") {
            return (
                <div className="User" style={{ backgroundColor : 'midnightblue', color : "white" }}>
                    <div className="inputform">
                        <div style={{ display : 'table', width: "100%" , minHeight :"300px"}}>
                            <img src={this.state.profileimg} style={{ 
                                display : 'table-cell', width : "180px", textAlign : "left", left : "calc(50% - 90px)", position : "relative", marginTop : "1%", marginBottom : "1%"
                                }} alt="profile-img" />
                            {this.use_changeimage()}
                        </div>
                        <div style={{ width: "100%", minHeight :"300px"}}>
                        <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>E-Mail</section>
                        <input type="email" name="user_email" placeholder={this.state.email} ref={(mount) => {this.email = mount;}} readOnly></input><br/>
                        <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>Nickname</section>
                        <input type="text" name="user_nickname" placeholder={this.state.nickname} ref={(mount) => {this.nickname = mount;}}></input><br/>
                        <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>Username</section>
                        <input type="text" name="user_username" placeholder={this.state.username} ref={(mount) => {this.username = mount;}}></input><br/>
                        <button className="btn-style" onClick={this.user_update.bind(this)}>수정</button>{` `}
                        <button className="btn-style" onClick={this.user_delete.bind(this)}>회원탈퇴</button>
                        </div>
                    </div>
                </div>
            )
        }
        else
        return (
            <div className="User">
                <div className="inputform" style={{backgroundColor : 'midnightblue', color : "white"}}>
                    <div style={{ float : "left" , width: "30%" , minHeight :"300px", padding : "10%", backgroundColor : 'midnightblue', color : "white"}}>
                        <img src={this.state.profileimg} style={{ width : "180px" }} alt="profile-img" />
                        {this.use_changeimage()}
                    </div>
                    <div style={{ float : "right" , width: "30%", minHeight :"300px", padding: "10%", backgroundColor : 'midnightblue', color : "white"}}>
                    <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>E-Mail</section>
                    <input type="email" name="user_email" placeholder={this.state.email}  ref={(mount) => {this.email = mount;}} readOnly></input><br/>
                    <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>Nickname</section>
                    <input type="text" name="user_nickname" placeholder={this.state.nickname}  ref={(mount) => {this.nickname = mount;}}></input><br/>
                    <section style={{ position : 'relative', textAlign:'left', left : 'calc(50% - 90px)'}}>Username</section>
                    <input type="text" name="user_username" placeholder={this.state.username}  ref={(mount) => {this.username = mount;}}></input><br/>
                    <button className="btn-style" onClick={this.user_update.bind(this)}>수정</button>{` `}
                    <button className="btn-style" onClick={this.user_delete.bind(this)}>회원탈퇴</button>
                    </div>
                </div>
            </div>
        );
    }

    onChange_profileimg = () => {
        const self = this;
        const file = this.profileimg.files[0];

        if(file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                self.file = file;
                self.setState({
                    profileimg : e.target.result,
                })         
            };
            reader.readAsDataURL(file);
        }
    }

    resize () {
        if(window.innerWidth <= 720) {
            if(this.state.screenstate !== 'mobile') {
                this.setState({ screenstate : 'mobile' });
                return;
            }
        }
        else if(window.innerWidth > 720) {
            if(this.state.screenstate !== 'desktop') {
                this.setState({ screenstate : 'desktop' });
                return;
            }
        } 
    }

    componentDidMount() 
    {
        window.addEventListener('resize', () => {setTimeout(this.resize.bind(this), 100)});
        this.resize();
    }
};

export default User;