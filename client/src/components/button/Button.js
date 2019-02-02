import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './button.css';

class Button extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        onClick: null,
        disabled: false,
    }

    render() {
        const { children } = this.props;

        return (
            <button type="submit" {...this.props} className={s.button}>
                { children }
            </button>
        );
    }
}

export default Button;
