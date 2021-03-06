import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cell } from 'styled-css-grid';
import s from './sidebar.css';

class SideBar extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    render() {
        const { children } = this.props;

        return (
            <Cell area="sidebar" className={s.sidebar}>
                { children }
            </Cell>
        );
    }
}

export default SideBar;
