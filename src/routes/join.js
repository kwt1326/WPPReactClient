import React, { Component} from 'react';
import { checklogin, islive, api } from '../custom/custom'
import '../css/style.css';

class Join extends Component 
{
    constructor(props) {
        super(props);
    }

    render () {
        const path = (islive()) ? api + "/api/auth/login" : "/api/auth/login";
        return (
            <div className="Join">
                <table style={{ backgroundColor : "white" , borderTop: "0px", borderBottom: "0px"}}>
                    <thead>
                        <tr>
                            <td colSpan="2">
                                <div className="join-title" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>A/ Q/ U/ A Join</div>
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="2">
                                <div style={{float : "left", width : "50%", textAlign : "left"}}>E-mail Join Form is here.</div>
                                <div style={{float : "right", width : "50%", textAlign : "right"}}>Your SNS Account Join is here.</div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '50%' }}>
                                <div className="join-email" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-email" type='email' placeholder="E-mail : " />
                                    </div>
                                </div>
                            </td>
                            <td rowSpan="2">
                                <div className="join-facebook" style={{ display: 'table' , width : '100%'}}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' , textAlign : 'center'}}>facebook</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="join-password" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-password" type='password' placeholder="Password : " />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="join-rePassword" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-rePassword" type='password' placeholder="Re-Password : " />
                                    </div>
                                </div>
                            </td>
                            <td rowSpan="2">
                                <div className="join-google" style={{ display: 'table' , width : '100%'}}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign : 'center' }}>google</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="join-name" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <input id="join-name" type='text'  placeholder="Your Name : "/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="join-nickname" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }} placeholder="NickName">
                                        <input id="join-nickname" type='text' placeholder="NickName : "/>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='2' style={{ textAlign : 'right', paddingRight : '0%'}}>
                                <div className="join-footer" style={{ display: 'table' }}>
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>If you have any questions, please send them to my u1326@hotmail.com.</div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
};

export default Join;