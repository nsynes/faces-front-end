import React from 'react';

import './LandingPage.css';


const LandingPage = (props) => {

    return (
        <div className='landing-page'>
            <div className='overlay'>
                <div align='center' className='intro-text'>
                    <p style={{fontSize: '30pt'}}>Hi</p>
                    <p>This face detection and representation tool was developed by me (<a href='http://nicksynes.com'>Nick Synes</a>) and featured on <a href='https://audioboom.com/posts/7679857-kelly-anne-smith-women-on-screen-bonus'>The Influential Women Podcast</a>.</p>
                    <p>Feel free to try it out - you get 10 minutes of processing time - but just let me know if you need more.</p>
                    <p>Bear in mind that this is a prototype built on a limited budget. There is much that could be achieved with it, i.e. racial representation, a higher detection frequency, storage of results, etc.</p>
                    <p>If you have any questions or are interested in working together, please <a href='http://nicksynes.com/contact'>get in touch</a>.</p>
                    <p>Enjoy!</p>
                    <br />
                    <button className='get-started' onClick={props.leaveLandingPage}>Get started</button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;