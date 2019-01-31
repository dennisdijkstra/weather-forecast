import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import history from './history';

const container = document.getElementById('root');

const render = async (location) => {
    try {
        ReactDOM.render(
            <div>
                <h1>Hello World</h1>
            </div>,
            container,
            () => document.title = 'hello world',
        );
    } catch (error) {
        console.error(error);
    }
};

history.listen(render);
render(history.location);
