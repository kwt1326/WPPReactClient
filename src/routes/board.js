import React, { Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import {checklogin, islive, api} from '../custom/custom';
import '../css/style.css';
import '../css/board.css';

import BoardSub from '../components/boardSub';
import filedef from '../image/file_default.png';
import { func } from 'prop-types';

// 자유게시판 (게시글 리스트))
class Board extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
           screenstate : 'desktop',
           redirect : 'none',
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

        this.searchdiv = React.createRef();

        this.load();
    }

    // Posting Data load
    Load () {
        const self = this;
        const page = (this.props.history.location.search) ? 
            parseInt(this.props.history.location.search.split("?page=")[1]) : 
            this.state.page;

        let keyword = null;
        if(this.props.history.location.pathname.indexOf('/board/search/') !== -1) {
            keyword = this.props.history.location.pathname.split('/board/search/')[1].split('/')[0];
        }

        const process = async () => {
            return await axios({
                method: 'get',
                url: (islive()) ? api + '/api/post/list' : '/api/post/list',
                headers: {
                    'Content-Type': 'application/json',
                },    
                params : {
                    search : (keyword) ? keyword : self.props.match.params.page,
                    page : page,
                    keyword : (keyword) ? true : false,
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
            if(res.rows.length > 0) {
                self.addrow(res)
                .then(res => {
                    self.addpage(res);
                });
            }
        });
    }

    add_header () {
        if(this.state.screenstate === 'phone') {
            return null;
        }
        else
        return (
            <tr>
                <td style={{ width: '10%' }}>
                    <div className="board-seqofpost" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>번호</div>
                    </div>
                </td>
                <td style={{ width: '70%' }}>
                    <div className="board-titleofpost" style={{ display: 'table', width: '100%', textAlign: 'center' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>제목</div>
                    </div>
                </td>
                <td style={{ width: '10%' }}>
                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>조회</div>
                    </div>
                </td>
                <td style={{ width: '10%' }}>
                    <div className="board-viewsofpost" style={{ display: 'table' }}>
                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>추천</div>
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
                        const img = (rows[i].content.frontimg) ? rows[i].content.frontimg : filedef;
                        arr.push(
                            <tr className="selectorList">
                                <td style={{ width: '10%' }}>
                                    <div className="board-seqofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>{(ofs - i)}</div>
                                    </div>
                                </td>
                                <td className="selectorList" style={{ width: '70%' }}>
                                    <Link to={'/reading?post=' + String(rows[i].content.guid)} style={{textDecoration : 'none', color : 'white'}}>
                                    <div className="board-titleofpost" style={{ display: 'table' }}>
                                        <div style={{ display: 'table-cell', width : "30%"}}><img src={img} alt="unknown" onError={(e)=>{e.target.onerror = null; e.target.src=filedef}}></img></div> 
                                        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft : "2%", width : "70%" }}>{rows[i].content.title}</div>
                                    </div>
                                    </Link>
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
                            <tr className="selectorList">
                                <td style={{ width: '100%' }}>
                                    <Link to={'/reading?post=' + String(rows[i].content.guid)} style={{textDecoration : 'none', color : 'white'}}>
                                    <div className="board-titleofpost" style={{ display: 'table', padding : "1%" }}>
                                        <img src={img} style={{ width : "100px", height : "100px"}}  alt="unknown" onError={(e)=>{e.target.onerror = null; e.target.src=filedef}}></img>
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

    search_tag = () => {
        if(window.event.keyCode === 13) {
            this.props.history.push(`/board/search/${this.searchdiv.value}/?page=${String(this.state.page)}`);
            this.load();
        }
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
                    <div style={{ display: 'table-cell', width: '50%', float: 'left'}}><h3>{this.props.match.params.page}</h3></div>
                    <div style={{ display: 'table-cell', width: '50%', float: 'right', textAlign : 'right', verticalAlign: 'middle' }}>
                        <input className="board-search" type='text' ref={(mount) => {this.searchdiv = mount}} placeholder='Search : ' onKeyUp={this.search_tag}/>
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
                                <button className="board-apply btn-style selector-deep" style={{ textAlign : 'center', width : '70px' , height : '50%'}} onClick={this.clickApply}>글쓰기</button>
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
        if(this.state.redirect !== 'none') {
            return (<Redirect push to={this.state.redirect}/>);
        }
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
        checklogin()
        .then((res) => {
            if(res.userdata.data.level === 'admin') {
                self.setState({redirect : '/write'});
            }
            else {
                alert("관리자만 작성할 수 있습니다.");
            }
        })
        .catch((err) => {
            alert('로그인 페이지로 이동합니다.');
            self.setState({redirect : `/login?from=${"write"}`});
        })
    }

    componentDidMount () {
        window.addEventListener('resize', () => {setTimeout(this.resize.bind(this), 100)});
        this.resize();
    }
}

export default Board;