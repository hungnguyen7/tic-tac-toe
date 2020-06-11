import React from 'react';
import './Announcement.css'
export default class Announcement extends React.Component{
    render(){
        return(
            <div className={this.props.winner ? 'visible':'hidden'}>
                <h2>Game Over</h2>
                {<p>{this.props.winner} win!</p>}
            </div>
        )
    }
}