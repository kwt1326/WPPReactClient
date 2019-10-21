import React, { Component} from 'react';
import {logout, getTags} from '../custom/custom';
import '../css/style.css';

import Board from '../routes/board';

class Menulist extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            subCategory : false,
            subCategory_name : 'board',
            render_ready : false,
        }

        this.render_sub = [];
        this.subCategory = React.createRef();
        this.create_subwnd.bind(this);

        this.create_subwnd();
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

    visibie_subwnd = ( type ) => {
        const cur = this.subCategory.style.visibility;
        this.subCategory.style.visibility = (cur === "hidden") ? "visible" : "hidden";
        this.setState({subCategory : !this.state.subCategory, subCategory_name : type});
    }

    create_subwnd = () => {
        const self = this;

        const put_row = ( category, onclick ) => {
            return (<li className="selectorList" onClick={onclick}><h3>{category}</h3></li>);
        }
            
        async function createrow(params) {
            if(params !== undefined && params !== null) {
                for(let i = 0 ; i < params.length ; ++i) {
                    self.render_sub[i] = put_row(params[i].name, () => { self.onClick_route('/board/' + params[i].name) });
                }
            }
        }

        async function returns () {
            await getTags()
            .then(res => { 
                const tags = res.tags;
                tags.unshift({name :'All'});
                createrow(tags)
                .then(res => {
                    self.setState({ render_ready : true });
                })
            });
        }

        returns();
    }

    render_subwnd = () => {
        if(this.state.render_ready) {
            return this.render_sub;
        }
    }

    render () {
        return (
            <div id="MenulistPane" onAnimationEnd={this.aniendEvent_Menulist.bind(this)}>
                <div style={{ float : "left", width : "50%" }}>
                    <ul className="NoMargin">
                        <li id="sidemenu_home" className="selectorList" onClick={() => {this.onClick_route('/')}}><h3>Home</h3></li>
                        <li id="sidemenu_board" className="selectorList" onClick={() => {this.visibie_subwnd('board')}}><h3>Board</h3></li>
                        <li id="sidemenu_user" className="selectorList" onClick={() => {this.onClick_route('/user')}}><h3>User</h3></li>
                        <li id="sidemenu_logout" className="selectorList" onClick={this.onClick_logout}><h3>Logout</h3></li>
                        <li className="selectorList"><h3>Contact</h3></li>
                    </ul>
                </div>
                <div className="sub_category" ref={(mount) => { this.subCategory = mount;}} style={{
                    float: "right", width: "50%",
                    visibility: (this.state.subCategory) ? "visible" : "hidden"
                }}>
                    <ul><h2>[ {this.state.subCategory_name} ]</h2></ul>    
                    <ul>
                        {this.render_subwnd()}
                    </ul>
                </div>
            </div>
        );
    }

}

export default Menulist;