import React, { Component} from 'react';
import axios from 'axios';
import DomPurify from 'dompurify'; // HTML XSS Security
//import ThreeComp from './threeCreator';
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
            render_rows : null,
        }

        this.style_width_left = { minWidth : '100px', width : '20%' };
        this.style_width_right = { width : '80%' };
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
                self.setState({render_rows : res});
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
            await arr.push(
                <div className="box-child-archive">
                    <table>
                        <tbody>
                            <tr>
                                <td rowspan="3" style={this.style_width_left}>
                                    <img src={img} alt="unknown" 
                                    onError={(e) => {
                                        e.target.onerror = null; e.target.src=filedef;
                                        }} />
                                </td>
                                <td style={this.style_width_right}>
                                    <div style={{fontStyle : "bold"}}><h3>{row.title}</h3></div>
                                </td>
                            </tr>
                            <tr>
                                <td style={this.style_width_right}>
                                    <div>{row.createdAt + " (수정)" + (row.updatedAt) ? row.updatedAt : ""}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style={this.style_width_right}>
                                    <div dangerouslySetInnerHTML={{__html: DomPurify.sanitize(row.content)}}></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }    
        return arr;
    }

    render () {
        return (
            <div id="archive" className="box-vertical">
                <div style={this.style_title}><h2>A/ Q/ U/ A/ -Archive-</h2></div>
                {this.state.render_rows}
            </div>
        )
    }

    componentDidMount () {
        this.catchSession();
    }

}

export default Main;