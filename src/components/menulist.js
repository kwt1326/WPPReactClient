import React, { Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import '../css/style.css';

class Menulist extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
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

    render() {
        return (
            <div id="MenulistPane" onAnimationEnd={this.aniendEvent_Menulist.bind(this)}>
                <ul className="NoMargin">
                    <Link style={{ textDecoration : 'none', color : 'white' }} to="/" >
                        <li id="sidemenu_home" className="selectorList"><h3>Home</h3></li>
                    </Link>
                    <Link style={{ textDecoration : 'none', color : 'white' }} to="/board" >
                        <li  id="sidemenu_board" className="selectorList"><h3>Board</h3></li>
                    </Link>
                    <li className="selectorList"><h3>Contact</h3></li>
                </ul>
            </div>
        );
    }
}

export default Menulist;