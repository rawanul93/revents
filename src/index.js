import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './app/store/configureStore';
import ScrollToTop from './app/common/util/ScrollToTop';
import { loadEvents } from './features/event/eventActions';

const rootEl = document.getElementById('root');
const store = configureStore();
store.dispatch(loadEvents()); //can use the store to dispatch actions as well. Here we're loading the events by dispatching the loadEvents() actions

let render = () => {
    ReactDOM.render(
        // this way all of our router functionality is passed onto App
        // And we configure the routes in the App.jsx file
        <Provider store={store}>
            <BrowserRouter>
              <ScrollToTop>
                <App/>
             </ScrollToTop>   
            </BrowserRouter>
        </Provider>,
        rootEl
    );
}

if (module.hot) {
    module.hot.accept('./app/layout/App', () => {
        setTimeout(render);
    })
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
