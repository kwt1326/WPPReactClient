import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';

export {default as login} from './routes/login';

ReactDOM.render(<App/>, document.getElementById('App'));

serviceWorker.unregister();
