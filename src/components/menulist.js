import React, { Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {logout} from '../custom/custom';
import '../css/style.css';

class Menulist extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
        }
    }

    aniendEvent_Menulist () {
        const menulistdom = document.getElementById("MenulistPane");
        if (menulistdom.style.animationName === "slide-menu-reverse") {
            const virtualcover = document.getElementById("virtual-cover");
            virtualcover.style.zIndex = -1;
            menulistdom.style.zIndex = -1;
            menulistdom.style.visibility = "hidden";
        }
    }

    onClick_route = (path) => {
        window.location.replace(window.location.origin + path);
    }

    onClick_logout = () => {
        logout()
        .then((res) => {
            alert("성공적으로 로그아웃 되었습니다.");
            window.location.replace(window.location.origin);
        })
        .catch ((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div id="MenulistPane" onAnimationEnd={this.aniendEvent_Menulist.bind(this)}>
                <ul className="NoMargin">
                    <li id="sidemenu_home" className="selectorList" onClick={() => {this.onClick_route('/')}}><h3>Home</h3></li>
                    <li id="sidemenu_board" className="selectorList" onClick={() => {this.onClick_route('/board')}}><h3>Board</h3></li>
                    <li id="sidemenu_user" className="selectorList" onClick={() => {this.onClick_route('/user')}}><h3>User</h3></li>
                    <li id="sidemenu_logout" className="selectorList" onClick={this.onClick_logout}><h3>Logout</h3></li>
                    <li className="selectorList"><h3>Contact</h3></li>
                </ul>
            </div>
        );
    }

}

export default Menulist;