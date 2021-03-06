import React, { Component} from 'react';
import { connect } from 'react-redux';
import { changeboardstate } from '../reducer/board';
import { Link } from 'react-router-dom';
import {checklogin, logout} from '../custom/custom';
import '../css/style.css';
import unknown from '../image/unknown.png';

class Header extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            isopenedMenulist : false,
            redirect : false,
            nickname : '',
            profileimg : unknown,
            existsession : false
        };
        this.reactscreen = this.react_window.bind(this);
        this.routeui = this.route_ui.bind(this);
    }

    SlideMenulist() {
        if (this.state.isopenedMenulist === false) {
            this.setState({isopenedMenulist : true});
            const virtualcover = document.getElementById("virtual-cover");
            virtualcover.style.zIndex = 1;
            const menulistdom = document.getElementById("MenulistPane");
            menulistdom.style.opacity = 0.7;
            menulistdom.style.animationName = "slide-menu";
            menulistdom.style.animationDuration = "0.3s";
            menulistdom.style.visibility = "visible";
            menulistdom.style.zIndex = 1;
        }
        else {
            this.setState({isopenedMenulist : false});
            const menulistdom = document.getElementById("MenulistPane");
            menulistdom.style.opacity = 0;
            menulistdom.style.animationName = "slide-menu-reverse";
            menulistdom.style.animationDuration = "0.3s";
        }
    }

    check_login = () =>
    {
        const self = this;
        checklogin()
        .then((res) => {
            const data = res.userdata.data;
            if(self.state.nickname !== data.nickname &&
                self.state.existsession !== true) {
                    self.setState({ 
                        profileimg : data.profileimg,
                        nickname : data.nickname,
                        existsession : true
                    })
                }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onclick_logout () {
        const self = this;
        logout()
        .then((res) => {
            self.setState({
                profileimg : unknown,
                nickname : res.nickname,
                existsession : res.existsession
            }, () => {
                alert("성공적으로 로그아웃 되었습니다.");
                window.location.replace('/');
            });
        })
        .catch ((err) => {
            console.log(err);
        });
    }
    
    // ./login or ./user 라우팅 조건(로그인 세션 존재하는지) 검사
    route_ui () 
    {
        this.check_login();
        const session = this.state.existsession;
        if(session === false) {
            if (this.props.screenstate === 'mobile' || this.props.screenstate === 'phone') { // mobile - login
                return (
                    <div id="header-usericon-mobile" className="box-child-main squere-menu-user">
                        <Link className="link-login" to={{
                            pathname: '/login',
                            state : { from : 'header' }
                        }}><div className="usericon selectorIcon" style={{ width : '50%' }}/></Link>
                    </div>
                )    
            }
            else if (this.props.screenstate === 'desktop') { // desktop - login
                return (
                    <div id="header-usericon-desktop" className="box-child-main squere-menu-user">
                        <Link className="link-login" to={{
                            pathname: '/login',
                            state : { from : 'header' }
                        }}><div className="usericon selectorIcon" style={{ width: '50%' }} /></Link>
                    </div>
                )    
            }
        }
        else if(session === true){
            if (this.props.screenstate === 'mobile' || this.props.screenstate === 'phone') { // mobile - user
                return (
                    <div id="header-usericon-mobile" className="box-child-main squere-menu-user">
                        <div className="btn-logout selectorIcon" onClick={this.onclick_logout.bind(this)}></div>
                        <Link className="link-user" to="/user">
                            <img className="selectorIcon" src={this.state.profileimg} style={{width : '50px', height : '50px', position : "absolute"}}
                                 alt="profile-img" onError={(e)=>{e.target.onerror = null; e.target.src=unknown}}/>
                            <div className="userframe selectorIcon" style={{ width : '50px', height : '50px', position : "absolute"}}></div>
                        </Link>
                    </div>
                )
            }
            else if (this.props.screenstate === 'desktop') { // desktop - user
                return (
                    <div id="header-usericon-desktop" className="box-child-main squere-menu-user">
                        <div className="btn-logout selectorIcon" onClick={this.onclick_logout.bind(this)}></div>
                        <div className="nickname" >{this.state.nickname}</div>
                        <Link className="link-user" to="/user">
                            <img className="selectorIcon" src={this.state.profileimg} style={{width : '50px', height : '50px', position : "absolute"}}
                                 alt="profile-img" onError={(e)=>{e.target.onerror = null; e.target.src=unknown}}/>
                            <div className="userframe selectorIcon" style={{ width : '50px', height : '50px', position : "absolute"}}></div>
                        </Link>
                    </div>
                )
            }
        }
        else return;
    }

    react_window() {
        if (this.props.screenstate === 'mobile' || this.props.screenstate === 'phone') { // mobile
            return (
                <div className="Menubar-mobile">
                    <div className="box-main">
                        <div className="Menuicon selectorIcon" onClick={this.SlideMenulist.bind(this)}></div>
                        <Link style={{ textDecoration : 'none', color : 'black' }} to="/">
                            <div className="box-child-main squere-menu-title"><h3><p className="all-middle-text"> A/ Q/ U/ A</p></h3></div>
                        </Link>
                        {this.routeui()}
                    </div>
                </div>
            )
        }
        else if (this.props.screenstate === 'desktop') { // desktop
            return (
                <div className="Menubar">
                    <div className="box-main">
                        <Link style={{ textDecoration : 'none', color : 'black' }} to="/">
                        <div className="box-child-main squere-menu-title"><h3><p className="all-middle-text"> A/ Q/ U/ A</p></h3></div>
                        </Link>
                        <Link style={{ textDecoration : 'none', color : 'black' }} to="/">
                        <div className="box-child-main squere-menu-child selector"><p className="all-middle-text">Archive</p></div>
                        </Link>
                        <Link style={{ textDecoration : 'none', color : 'black' }} to="/board/mainboard">
                            <div className="box-child-main squere-menu-child selector">
                                <p className="all-middle-text">Board</p>
                            </div>
                        </Link>
                        <Link style={{ textDecoration : 'none', color : 'black' }} to="/Introduce">
                            <div className="box-child-main squere-menu-child selector">
                                <p className="all-middle-text">Introduce</p>
                            </div>
                        </Link>
                        <Link style={{ textDecoration : 'none', color : 'black' }} to="/contact">
                            <div className="box-child-main squere-menu-child selector">
                                <p className="all-middle-text">Contact</p>
                            </div>
                        </Link>
                        {this.routeui()}
                    </div>
                </div>
            )
        }
        else return;
    }

    render () {
        return (
            // DIV 부모 컨테이너는 반드시 하나만 존재해야 한다. (리액트 규칙)
            <header>
                {this.reactscreen()}
            </header>
        );
    }
}

const mapStateToProps = state => ({
    screenstate: state.screen.screenstate,
    boardstate: state.board.boardstate,
});

const mapDispatchToProps = dispatch => ({
    changeboardstate: boardstate => dispatch(changeboardstate(boardstate)),
});  

export default connect(mapStateToProps, mapDispatchToProps)(Header);