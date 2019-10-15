import React, { Component} from 'react';
import {categoryStruct, getTags} from '../custom/custom';
import axios from 'axios';
import '../css/style.css';
import '../css/board.css';

class BoardSub extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            render_ready : false,
        };

        this.ul_style = { listStyle : "none" };
        this.li_style = { marginBlockStart : "0", marginBlockEnd : "0" };

        this.render_sub_board = [];
        this.render_sub_tag = [];
        this.create_subwnd.bind(this);

        this.create_subwnd();   
    }

    create_subwnd = () => {
        const self = this;
        const marginNone = { marginBlockStart : "0", marginBlockEnd : "0" };

        const put_row = ( category, onclick ) => {
            return (<li className="btn-style selector-deep" style={ this.li_style } onClick={onclick}><h5 style={ marginNone }>{category}</h5></li>);
        }
    
        async function createrow_board(params) {
            for(let i = 0 ; i < params.board.length ; ++i) {
                self.render_sub_board[i] = put_row(params.board[i], () => { window.location.replace(window.location.origin + '/board/' + params.board[i]); });
            }
        }
        
        async function createrow_blog(params) {
            if(params !== undefined && params !== null) {
                for(let i = 0 ; i < params.length ; ++i) {
                    self.render_sub_tag[i] = put_row(params[i].name, () => { window.location.replace(window.location.origin + '/tag/' + params[i].name); });
                }
            }
        }

        async function returns () {
            await createrow_board(categoryStruct);
            await getTags()
            .then(res => { 
                createrow_blog(res.tags)
                .then(res => {
                    self.setState({ render_ready : true });
                });
            });
        }

        returns();
    }

    render () {
        if(this.state.render_ready === true)
        return (
            <div className="board-subMenu">
                <ul className="list-style" style={ this.ul_style }>
                    <h3 className="list-style" style={ this.li_style }>{"Tag"}</h3>
                    {this.render_sub_tag}
                </ul>
                <ul className="list-style" style={ this.ul_style }>
                    <h3 className="list-style" style={ this.li_style }>{"Board"}</h3>
                    {this.render_sub_board}
                </ul>
            </div>
        );
        else
        return null;
    }
}

export default BoardSub;