import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import rootReducer from './reducer';
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';

export {default as login} from './routes/login';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, 
    document.getElementById('App')
);

serviceWorker.unregister();
