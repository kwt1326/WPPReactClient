import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import {checklogin, islive, api, getimgsrc} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';

import BoardSub from '../components/boardSub';
import { func } from 'prop-types';

// 자유게시판 (게시글 리스트))
class Board extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',
           redirect : 'none',
           defaultimg : require('../image/file_default.png'),
           page : 1,
           ofs : null,
           row_count : null,
           page_div : null,
           render_rows : null,
           render_rows_mobile : null,
           renderready : false,
        };
        this.load = this.Load.bind(this);
        this.addrow = this.add_row.bind(this);
        this.addpage = this.add_page.bind(this);
        this.addheader = this.add_header.bind(this);
        this.reactsplitL = this.react_splitLeft.bind(this);
        this.reactsplitR = this.react_splitRight.bind(this);
        this.clickApply = this.onClick_Apply.bind(this);

        this.load();
    }

    // Posting Data load
    Load () {
        const self = this;
        const page = (self.props.history.location.search) ? 
            parseInt(self.props.history.location.search.split("?page=")[1]) : 
            self.state.page;

        const process = async () => {
            return await axios({
                method: 'get',
                url: (islive()) ? api + '/api/post/list' : '/api/post/list',
                params : {
                    category : '오픈',
                    page : page
                }
            })
            .then(function (response) {
                return Promise.resolve({ 
                    ofs : response.data.ofs,
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
            self.addrow(res)
            .then(res => {
                self.addpage(res);
            });
        });
    }

    add_header () {
        if(this.state.screenstate === 'phone') {
            return (
                <tr>
                    <td style={{ width: '100%' }}>
                        <div className="board-titleofpost" style={{ display: 'table', width: '100%', textAlign: 'center' }}>
                            <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>Title</div>
                        </div>
                    </td>
                </tr>
            )
        }
        else
        return (
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
        )
    }

    add_row = (res) => 
    {
        const self = this;
        let arr = [];
        let arr_mobile = [];
        let rows = res.rows;
        let length = (res.count > 10) ? 10 : res.count;
        const ofs = res.ofs;

        if(rows.length > 0) {
            async function ArrAsyncProcess() {
                for (var i = 0; i < length; ++i) {
                    if (!rows[i])
                        continue;
                    else {
                        arr.push(
                            <tr>
                                <td style={{ width: '10%' }}>
                                    <div className="board-seqofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{(ofs - i)}</div>
                                    </div>
                                </td>
                                <td className="selectorList" style={{ width: '50%' }}>
                                    <Link to={'/reading' + '?post=' + rows[i].content.guid} style={{textDecoration : 'none', color : 'white'}}>
                                    <div className="board-titleofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', width : "30%"}}><img src={getimgsrc(rows[i].content.frontimg, self.state.defaultimg)} ></img></div> 
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft : "2%", width : "70%" }}>{rows[i].content.title}</div>
                                    </div>
                                    </Link>
                                </td>
                                <td style={{ width: '20%' }}>
                                    <div className="board-writerofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[i].writer}</div>
                                    </div>
                                </td>
                                <td style={{ width: '10%' }}>
                                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[i].content.views}</div>
                                    </div>
                                </td>
                                <td style={{ width: '10%' }}>
                                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{rows[i].content.hearts}</div>
                                    </div>
                                </td>
                            </tr>
                        );
                        arr_mobile.push(
                            <tr>
                                <td className="selectorList" style={{ width: '50%' }}>
                                    <Link to={'/reading' + '?post=' + rows[i].content.guid} style={{textDecoration : 'none', color : 'white'}}>
                                    <div className="board-titleofpost" style={{ display: 'table', padding : "1%" }}>
                                        <img src={getimgsrc(rows[i].content.frontimg, self.state.defaultimg)} style={{ width : "100px", height : "100px"}}></img>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft : "2%", width : "70%" }}>{rows[i].content.title}</div>
                                    </div>
                                    </Link>
                                </td>
                            </tr>
                        );    
                    }
                }
            }

            async function setRows () {
                await ArrAsyncProcess();
                return ({
                    render_rows : arr,
                    render_rows_mobile : arr_mobile,
                    row_count : res.count,
                    ofs : res.ofs
                })
            }
            return setRows();
        }
    }

    add_page (res) {
        const self = this;
        let numpage = parseInt(res.row_count / 10);
        numpage += (res.row_count % 10 > 0) ? 1 : 0;
        const elems = [];
    
        async function create () {
            numpage = (numpage > 10) ? 10 : numpage;
            for(let i = 1 ; i <= numpage ; ++i)
            {
                elems.push(
                    <button className="selector-deep btn-style" onClick={() => {
                        self.props.history.push(self.props.history.location.pathname + '?page=' + String(i));
                        self.load();
                        }}>
                        {String(i) + " "}
                    </button>
                )
            }        
        }    
    
        async function process() {
            await create();
            self.setState({
                renderready : true,
                render_rows : res.render_rows,
                render_rows_mobile : res.render_rows_mobile,
                row_count : res.row_count,
                ofs : res.ofs,
                page_div : elems
            })
        }
    
        process();
    }

    render_rows = () => {
        if(this.state.screenstate === "phone")
            return this.state.render_rows_mobile
        else
            return this.state.render_rows
    }

    react_splitLeft() {
        if (this.state.screenstate === 'desktop') { // desktop - mobile 에서 표시 안함
            return (
                <div className="split-left" >
                    <BoardSub/>
                </div>
            );
        }
    }

    react_splitRight() {

        let rightratio;
        if (this.state.screenstate === 'mobile' ||
            this.state.screenstate === 'phone') { 
            rightratio = '90%';
        }
        else
            rightratio = '69%';

        return (
            <div className="board-tablelist split-right" style={{ width : rightratio }}>
                <div style={{ display: 'table', width: '100%'}}>
                    <div style={{ display: 'table-cell', width: '50%', float: 'left'}}><h3>Post</h3></div>
                    <div style={{ display: 'table-cell', width: '50%', float: 'right', textAlign : 'right', verticalAlign: 'middle' }}>
                        <input className="board-search" type='text' placeholder='Search : ' />
                    </div>
                </div>
                <table>
                    <thead>
                        {this.addheader()}
                    </thead>
                    <tbody>
                        {this.render_rows()}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='5' style={{ textAlign : 'right', paddingRight : '0%'}}>
                                <button className="board-apply btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}} onClick={this.clickApply}>Apply</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div style={{ width: '100%',textAlign : "center" }}>
                    {this.state.page_div}
                </div>
            </div>
        );
    }

    render () {
        if(this.state.redirect !== 'none')
            return (<Redirect push to={this.state.redirect}/>);
        else
        return (
            <div className="board">
                {this.reactsplitL()}
                {this.reactsplitR()}
            </div>
        );
    }

    resize () {
        if(window.innerWidth <= 720) {
            if(window.innerWidth <= 600){
                if(this.state.screenstate !== 'phone') {
                    this.setState({ screenstate : 'phone' });
                    return;
                }    
            }
            else
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
        checklogin( 'write' )
        .then((res) => {
            self.setState({redirect : '/write'});
        })
        .catch((err) => {
            alert('로그인 페이지로 이동합니다.');
            self.setState({redirect : '/login'});
        })
    }

    componentDidMount () {
        window.addEventListener('resize', () => {setTimeout(this.resize.bind(this), 100)});
        this.resize();
    }
}

export default Board;