import React, { Component} from 'react';
import '../css/style.css';

class Footer extends Component 
{
    render() {
        return (
            <footer className="footer">
                <div className="all-middle-text" style={{ marginTop : '20px', }}>- Contact -<br/>
                    E-mail ▶ u1326@hotmail.com<br/>
                    github ▶ https://github.com/kwt1326<br/>
                    Actor ▶ Kimwontae<br/>
                </div>
            </footer>
        )
    }
}

export default Footer;