import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import queryString from 'query-string';
import history from './history';
import router from './router';
import s from './client.css';

const container = document.getElementById('root');

const render = async (location) => {
    try {
        const context = {
            pathname: location.pathname,
            query: queryString.parse(location.search),
        };
        const route = await router.resolve(context);

        if (route.redirect) {
            history.replace(route.redirect);
            return;
        }

        ReactDOM.render(
            <div className={s.wrapper}>
                {route.component}
            </div>,
            container,
            () => document.title = route.title,
        );
    } catch (error) {
        console.error(error);
    }
};

history.listen(render);
render(history.location);
