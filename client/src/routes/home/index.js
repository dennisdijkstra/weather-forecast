import React from 'react';
import Home from './Home';

const action = () => {
    return {
        chunks: ['home'],
        title: 'Home',
        component: (
            <Home />
        ),
    };
};


export default action;
