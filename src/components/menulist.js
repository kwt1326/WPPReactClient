import React, { Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {logout, categoryStruct} from '../custom/custom';
import '../css/style.css';

class Menulist extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            subCategory : false,
        }

        this.subCategory = React.createRef();
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

    visibie_subwnd = () => {
        const cur = this.subCategory.style.visibility;
        this.subCategory.style.visibility = (cur === "hidden") ? "visible" : "hidden";
    }

    put_row = ( category, onclick ) => {
        return (<li className="selectorList" onClick={onclick}><h3>{category}</h3></li>);
    }

    create_subwnd = ( arr, type ) => {
        const self = this;
        async function createrow_board(params) {
            for(let i = 0 ; i < params.board.length ; ++i) {
                arr[i] = self.put_row(params.board[i], () => { self.onClick_route('/board/' + categoryStruct.board[i]) });
            }
        }                         
        async function returns () {
            if(type === 'board')
                await createrow_board(categoryStruct);
        }
        returns();
    }

    get_board = () => {
        let arr = [];
        this.create_subwnd(arr, 'board');
        return (
            <div className="sub_category" ref={(mount) => { this.subCategory = mount }}
                style={{
                    float: "right", width: "50%",
                    visibility: (this.state.subCategory) ? "visible" : "hidden"
                }}>
                <ul><h2>[ Board ]</h2></ul>    
                <ul>{arr}</ul>
            </div>
        )
    }

    renderlist = ( type ) => 
    {
        switch (type) {
            case "board" : 
            {
                return this.get_board();
                break;
            }
            default : 
                break;
        }
    }

    render() {
        return (
            <div id="MenulistPane" onAnimationEnd={this.aniendEvent_Menulist.bind(this)}>
                <div style={{ float : "left", width : "50%" }}>
                    <ul className="NoMargin">
                        <li id="sidemenu_home" className="selectorList" onClick={() => {this.onClick_route('/')}}><h3>Home</h3></li>
                        <li id="sidemenu_board" className="selectorList" onClick={() => {this.visibie_subwnd()}}><h3>Board</h3></li>
                        <li id="sidemenu_user" className="selectorList" onClick={() => {this.onClick_route('/user')}}><h3>User</h3></li>
                        <li id="sidemenu_logout" className="selectorList" onClick={this.onClick_logout}><h3>Logout</h3></li>
                        <li className="selectorList"><h3>Contact</h3></li>
                    </ul>
                </div>
                {this.renderlist("board")}
            </div>
        );
    }

}

export default Menulist;