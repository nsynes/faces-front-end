import React from 'react';

import KeyboardArrowRightRounded from '@material-ui/icons/KeyboardArrowRightRounded';

import './NextButton.css';


const NextButton = (props) => {

    return (
        <button
            className='button next'
            onClick={props.nextTab}>Next <b>&gt;</b></button>
    )
}


export default NextButton;