import React from 'react';
import '../css/style.css';

function Contact () {

    const github = "https://github.githubassets.com/images/modules/open_graph/github-mark.png";
    const outlook = "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/outlook-512.png";
    const navermail = "https://cdn0.iconfinder.com/data/icons/address-book-providers-in-colors/512/naver-2-512.png";

    return (
        <div className="box" style={{ backgroundColor : 'transparent', cursor : 'auto'}}>
            <ul style={{ padding : '20px'}}>
                <li className="box-child-contact" style={{ fontSize : '30px' }}>Contact</li>
                <div className="box-child" style={{ display : "flex", alignItems : 'center', justifyContent : 'center', minWidth : "350px" }}>
                    <img className="box-child" src={outlook} alt="E-mail-Outlook" style={{ maxWidth : '70px', maxHeight : '70px', border : 'none' }}/>
                    <div className="box-child-contact" >{" u1326@hotmail.com"}</div>
                </div>
                <div className="box-child" style={{ display : "flex", alignItems : 'center', justifyContent : 'center', minWidth : "350px" }}>
                    <img className="box-child" src={navermail} alt="E-mail-Naver" style={{ maxWidth : '70px', maxHeight : '70px', border : 'none' }}/>
                    <div className="box-child-contact" >{" kwt1326@naver.com"}</div>
                </div>
                <div className="box-child" style={{ display : "flex", alignItems : 'center', justifyContent : 'center', minWidth : "350px" }}>
                    <img className="box-child" src={github} alt="Github" style={{ width : '100px', height : '60px', border : 'none' }}/>
                    <div className="box-child-contact" ><a href="https://github.com/kwt1326" style={{ textDecoration : 'none' }}>{"https://github.com/kwt1326"}</a></div>
                </div>
                <li className="box-child-contact">Front-end : <a href="https://github.com/kwt1326/WPPReactClient" style={{ textDecoration : 'none' }}>https://github.com/kwt1326/WPPReactClient</a></li>
                <li className="box-child-contact">Back-end  : <a href="https://github.com/kwt1326/WPPNodeServer" style={{ textDecoration : 'none' }}>https://github.com/kwt1326/WPPNodeServer</a></li>
            </ul>
        </div>
    );
}

export default Contact;