import React from 'react';

import './MainPage.css';


const MainPage = (props) => {

    return(
        <div className={`main-page ${props.visible ? 'visible' : 'hidden'}`}>
            {props.children}
        </div>
    )

}

export default MainPage;