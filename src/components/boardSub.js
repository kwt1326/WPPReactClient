import React, { Component} from 'react';
import {getTags} from '../custom/custom';
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

        this.render_sub = [];
        this.create_subwnd.bind(this);

        this.create_subwnd();   
    }

    create_subwnd = () => {
        const self = this;
        const marginNone = { marginBlockStart : "0", marginBlockEnd : "0" };

        const put_row = ( category, onclick ) => {
            return (<li className="btn-style selector-deep" style={ this.li_style } onClick={onclick}><h5 style={ marginNone }>{category}</h5></li>);
        }
            
        async function createrow(params) {
            if(params !== undefined && params !== null) {
                for(let i = 0 ; i < params.length ; ++i) {
                    self.render_sub[i] = put_row(params[i].name, () => { window.location.replace(window.location.origin + '/board/' + params[i].name); });
                }
            }
        }

        async function returns () {
            await getTags()
            .then(res => { 
                const tags = res.tags;
                tags.unshift({name : 'All'});
                createrow(tags)
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
                    <h3 className="list-style" style={ this.li_style }>{"Board"}</h3>
                    {this.render_sub}
                </ul>
            </div>
        );
        else
        return null;
    }
}

export default BoardSub;