import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'styled-css-grid';
import s from './weatherResults.css';

class weatherResults extends Component {
    static propTypes = {
        weather: PropTypes.shape({
            currently: PropTypes.object,
        }),
    };

    static defaultProps = {
        weather: null,
    }

    render() {
        const { weather } = this.props;
        const temperature = weather?.currently?.temperature;

        return (
            <Cell area="content" className={s.content}>
                {weather ? (
                    <p>Temperature: {temperature} &#8451;</p>
                ) : (
                    <p>No weather results yet ..</p>
                )}
            </Cell>
        );
    }
}

export default weatherResults;
