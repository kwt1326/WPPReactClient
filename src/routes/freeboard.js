import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import {checklogin} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';

import BoardSub from '../components/boardSub';
import { func } from 'prop-types';

// 자유게시판 (게시글 리스트))
class Freeboard extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',
           redirect : 'none',
           page : 0,
           rows : [],
           render_rows : [],
           renderready : false,
        };
        this.load = this.Load.bind(this);
        this.addrow = this.add_row.bind(this);
        this.reactsplitL = this.react_splitLeft.bind(this);
        this.reactsplitR = this.react_splitRight.bind(this);
        this.clickApply = this.onClick_Apply.bind(this);
        this.renderRow = this.render_rows.bind(this);

        this.load();
    }

    // Posting Data load
    Load () {
        const self = this;
        const process = async () => {
            return await axios({
                method: 'get',
                url: '/api/post/list',
            })
            .then(function (response) {
                return Promise.resolve({ 
                    count : response.data.count,
                    rows : response.data.rows
                });
            })
            .catch ((err) => {
                return Promise.reject(err);
            });
        }
        process()
        .then((res) => {
            self.setState({ rows : res.rows });
            //count = res.count;
        });
    }

    add_row () {

        const self = this;

        if(self.state.renderready === true) 
            return;

        let arr = [];
        let rows = this.state.rows;
        var length = (rows.length > 10) ? 10 : rows.length;
        var page = this.state.page;
        var ofs = rows.length - (page * 10);
        if(rows.length > 0) {
            async function ArrAsyncProcess() {
                for (var i = 1; i <= length; ++i) {
                    if (!rows[ofs - i])
                        continue;
        
                    const result = await axios({
                        method: 'get',
                        url: '/api/user/search',
                        params: {
                            userid: rows[ofs - i].userId,
                        }
                    })
                    .then(function (response) {
                        arr.push(
                            <tr>
                                <td style={{ width: '10%' }}>
                                    <div className="board-seqofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{(ofs - i)}</div>
                                    </div>
                                </td>
                                <td className="selectorList" style={{ width: '50%' }}>
                                    <Link to={'./reading' + '?post=' + rows[ofs - i].guid} style={{textDecoration : 'none', color : 'black'}}>
                                    <div className="board-titleofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[ofs - i].title}</div>
                                    </div>
                                    </Link>
                                </td>
                                <td style={{ width: '20%' }}>
                                    <div className="board-writerofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{response.data.nickname}</div>
                                    </div>
                                </td>
                                <td style={{ width: '10%' }}>
                                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[ofs - i].views}</div>
                                    </div>
                                </td>
                                <td style={{ width: '10%' }}>
                                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[ofs - i].hearts}</div>
                                    </div>
                                </td>
                            </tr>
                        );    
                    })
                }
            }

            async function setRows () {
                const work = await ArrAsyncProcess();
                self.setState({ 
                    renderready : true,
                    render_rows : arr
                });
            }

            setRows();
        }
    }

    render_rows() {
        return this.state.render_rows;
    }

    react_splitLeft() {
        if (this.state.screenstate === 'desktop') { // desktop - mobile 에서 표시 안함
            return (
                <div className="split-left">
                    <BoardSub/>
                </div>
            );
        }
    }

    react_splitRight() {

        let rightratio;
        if (this.state.screenstate === 'mobile') { 
            rightratio = '90%';
        }
        else
            rightratio = '60%';

        return (
            <div className="board-tablelist split-right" style={{ width : rightratio }}>
                <div style={{ display: 'table', width: '100%' }}>
                    <p style={{ display: 'table-cell', width: '50%', float: 'left', verticalAlign: 'middle' }}>Board</p>
                    <div style={{ display: 'table-cell', width: '50%', float: 'right', textAlign : 'right' }}>
                        <input className="board-search" type='text' placeholder='Search : ' />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td style={{ width: '10%' }}>
                                <div className="board-seqofpost" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>PostNum</div>
                                </div>
                            </td>
                            <td style={{ width: '50%' }}>
                                <div className="board-titleofpost" style={{ display: 'table', width: '100%', textAlign: 'center' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>Title</div>
                                </div>
                            </td>
                            <td style={{ width: '20%' }}>
                                <div className="board-writerofpost" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>Writer</div>
                                </div>
                            </td>
                            <td style={{ width: '10%' }}>
                                <div className="board-viewsofpost" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>Views</div>
                                </div>
                            </td>
                            <td style={{ width: '10%' }}>
                                <div className="board-viewsofpost" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>Heart</div>
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.addrow()}
                        {this.renderRow()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='5' style={{ textAlign : 'right', paddingRight : '0%'}}>
                                <button className="board-apply btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}} onClick={this.clickApply}>Apply</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div style={{ width: '100%' }}>
                    {/* numbering */}
                </div>
            </div>
        );
    }

    render () {
        if(this.state.redirect !== 'none')
            return (<Redirect push to={this.state.redirect}/>);
        else
        return (
            <div className="freeboard">
                {this.reactsplitL()}
                {this.reactsplitR()}
            </div>
        );
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

    onClick_Apply () 
    {
        const self = this;
        checklogin( './write' )
        .then((res) => {
            self.setState({redirect : './write'});
        })
        .catch((err) => {
            alert('로그인 페이지로 이동합니다.');
            self.setState({redirect : './login'});
        })
    }

    componentDidMount () {
        window.addEventListener('resize', () => {setTimeout(this.resize.bind(this), 100)});
        this.resize();
    }
}

export default Freeboard;