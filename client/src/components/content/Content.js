import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'styled-css-grid';
import s from './content.css';

class Content extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    render() {
        const { children } = this.props;

        return (
            <Cell area="content" className={s.content}>
                { children }
            </Cell>
        );
    }
}

export default Content;
