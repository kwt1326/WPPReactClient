import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/style.css';
import { islive , api } from '../custom/custom';
import filedef from '../image/file_default.png';
import { func } from 'prop-types';

class Main extends Component 
{
    constructor (props) {
        super(props);
        this.state = {
            page : 0,
            ready : false,
            isEnd : false,
            isActive : false,
            render_rows : [],
        }

        this.maindiv = React.createRef();
        this.style_width_left = { minWidth : '100px', width : '20%', border : 'none' };
        this.style_width_right = { width : '80%', border : 'none' };
        this.style_title = { textAlign : "center" , fontStyle : "bold", width : "100%", color : "whitesmoke" };
        this.create_archive();
    }

    catchSession = () =>
    {
        if(this.props.location) {
            const search = this.props.location.search;
            if(search !== undefined && search !== null && search !== "") {
                if(!window.sessionStorage.getItem('token')) {
                    window.sessionStorage.setItem('token', this.props.location.search.split('?token=')[1]);
                    window.location.reload();
                }
            }
        }
    }

    create_archive = () => {
        const self = this;
        axios({
            method : "get",
            url : (islive()) ? `${api}/api/post/archive` : `/api/post/archive`,
            params : {
                page : self.state.page
            }
        })
        .then(res => {
            self.create_row(res.data)
            .then(res => {
                self.setState({
                    render_rows : self.state.render_rows.concat(res),
                    isEnd : (res.length < 10) ? true : false,
                    isActive : true,
                });
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    create_row = async (res) => {
        const arr = [];
        for(const row of res) {
            const img = (row.frontimg) ? row.frontimg : filedef;
            const onlytext = row.content.replace(/(<([^>]+)>)/ig,"");
            await arr.push(
                <div key={"archive-row-" + row.title + String(row.guid)} className="box-child-archive">
                    <Link to={'/reading?post=' + String(row.guid)} style={{textDecoration : 'none', color : 'whitesmoke'}}>
                    <table style={{ borderCollapse: 'collapse' }} className="selector-main" >
                        <tbody>
                            <tr>
                                <td rowSpan="4" style={this.style_width_left}>
                                    <img src={img} alt="unknown" onError={(e) => { e.target.onerror = null; e.target.src=filedef; }} />
                                </td>
                                <td style={this.style_width_right}>
                                    <div style={{fontStyle : "bold"}}><h3>{row.title}</h3></div>
                                </td>
                            </tr>
                            <tr>
                                <td style={this.style_width_right}>
                                    <div>{row.createdAt.split("T")[0] + " / 조회 : " + String(row.views) + " / 추천 : " + String(row.hearts)}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style={this.style_width_right}>
                                    <div className="ellipsis-text">{onlytext}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style={this.style_width_right}>
                                    <div className="ellipsis-text">{this.pretty_hashtag(row.hashtag)}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </Link>
                </div>
            )
        }    
        return arr;
    }

    pretty_hashtag = (tagContents) => {
        if(tagContents) {
            const tags = tagContents.split(",");
            let rendertag = "";
    
            tags.forEach(element => {
                if(element) rendertag += "#" + element + " ";
            });
    
            return rendertag;
        }
    }

    render_row = () => {
        if(this.state.render_rows) { 
            return (this.state.render_rows);
        }
        else {
            return (<div style={{color : "white"}}><h3>Loading...</h3></div>)
        }
    }

    render () {
        return (
            <div id="archive" className="box-vertical" ref={(mount) => {this.maindiv = mount}}>
                <div style={this.style_title}><h2>A/ Q/ U/ A/ -Archive-</h2></div>
                {this.render_row()}
            </div>
        )
    }

    scroll = () => {
        if(this.state.isActive) {
            const doc_scH = document.scrollingElement.scrollHeight;  // 스크롤 창 전체 높이 (vertical)
            const doc_scT = document.scrollingElement.scrollTop;     // 스크롤 창 현재 위치 (vertical)
            const scroll_H = document.scrollingElement.clientHeight; // 스크롤바 크기 (vertical)
            const scroll_scope = doc_scH - scroll_H;
            const percent = doc_scT / scroll_scope;
            if(percent > 0.8 && !this.state.isEnd) {
                this.setState({page : this.state.page + 1, isActive : false}, () => {this.create_archive()});
            }
        }
    }

    handle_scroll = () => {
        setTimeout(this.scroll, 100);
    }

    componentDidMount () {
        this.catchSession();
        window.addEventListener('scroll', this.handle_scroll, false);
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.handle_scroll, false);
    }
}

export default Main;