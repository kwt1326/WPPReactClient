import React, { Component} from 'react';
import { Route } from 'react-router-dom';
import Write from '../routes/write';
import Reading from '../routes/reading';
import Board from '../routes/board';
import { connect } from 'react-redux';
import { changeboardstate } from '../reducer/board';
import {getTags} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';

class Boardframe extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            render_ready : false,
        };

        const { width } = props;

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
            return (<li key={`boardsub-${category}`} className="btn-style selector-deep" style={ this.li_style } onClick={onclick}><h5 style={ marginNone }>{category}</h5></li>);
        }
            
        async function createrow(params) {
            if(params !== undefined && params !== null && params !== "") {
                for(let i = 0 ; i < params.length ; ++i) {
                    self.render_sub[i] = put_row(params[i].name, () => { 
                        self.props.changeboardstate(params[i].name);
                    });
                }
            }
        }

        getTags()
        .then(res => { 
            const tags = res.tags;
            tags.unshift({name : 'All'});
            createrow(tags)
            .then(res => {
                self.setState({render_ready : true});
            });
        });
    }

    returnSubPage = () => {
        if(this.props.screenstate === 'desktop' && this.state.render_ready === true)
            return (
                <div className="split-left">
                    <ul className="list-style" style={ this.ul_style }>
                        <h3 className="list-style" style={ this.li_style }>{"Board"}</h3>
                        {this.render_sub}
                    </ul>
                </div>
            );
        else
        return null;
    }

    returnPage = () => {
        switch (this.props.match.params.name) {
            case 'mainboard' : {
                return (<Board/>);
            }
            case 'write' : {
                return (<Route path='/board/write/:post' component={Write}/>);
            }
            case 'reading' : {
                return (<Route path='/board/reading/:post' component={Reading}/>);
            }
            default : return null;
        }
    }

    render () {
        return (
            <div>
                {this.returnSubPage()};
                {this.returnPage()};
            </div>
        )
    }
}

const mapStateToProps = state => ({
    screenstate: state.screen.screenstate,
});

const mapDispatchToProps = dispatch => ({
    changeboardstate: boardstate => dispatch(changeboardstate(boardstate)),
});  

export default connect(mapStateToProps, mapDispatchToProps)(Boardframe);