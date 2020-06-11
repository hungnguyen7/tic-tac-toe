import React from 'react';
import './ResetButton.css';
export default class ResetButton extends React.Component{
    render(){
        return(
            <button onClick={this.props.reset}>Reset</button>
        )
    }
}