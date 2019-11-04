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
        }

        this.row = null;
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
            self.create_row(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    create_row = async (res) => 
    {
        const self = this;
        try {
            const arr = [];
            async function process () {
                for(const row of res) {
                    await arr.push(
                        <div className="box-child">
                            <table>
                                <tbody>
                                    <tr rowspan="3">
                                        <td>
                                            <img src={row.frontimg} alt="front-img" onError={(e)=>{e.target.onerror = null; e.target.src=filedef}} />
                                        </td>
                                        <td>
                                            <div style={{fontStyle : "bold"}}><h3>{row.title}</h3></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div>{row.createdAt + " (수정)" + (row.updatedAt) ? row.updatedAt : ""}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="ql-editor" dangerouslySetInnerHTML={{__html: DomPurify.sanitize(row.content)}}></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                }    
            }    
            process()
            .then (result => {
                self.setState({ready : true}, () => {self.row = arr});
            })
            .catch(err => {
                throw new Error("create row failed");
            })
        }
        catch (err) {
            alert("데이터를 가져오는데 실패하였습니다.");
        }
    }

    render () {
        return (
            // <ThreeComp/>
            <div id="archive" className="box">
                {this.row}
            </div>
        )
    }

    componentDidMount () {
        this.catchSession();
    }
}

export default Main;