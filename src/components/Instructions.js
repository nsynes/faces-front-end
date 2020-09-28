import React from 'react';

import './Instructions.css';


const Instructions = (props) => {

    if ( props.tab === 'video') {
        return (
            <div className='instructions-container'>
                <ol type='A'>
                    <li>Use a Google account to login at the top right of this page.</li>
                    <li>Enter a YouTube URL into the textbox below and click 'Find faces'. It may take about a minute for the detection to get going.</li>
                    <li>As detection progresses, the faces will appear in the 'Faces' tab.</li>
                    <li>When the detection has finished, similar faces will be automatically clustered. Select the 'Faces' tab to start classifying.</li>
                </ol>
            </div>
        )
    } else if ( props.tab === 'faces' ) {
        return (
            <div className='instructions-container'>
                <ol type='A'>
                    <li>When face detection has completed, groups of similar faces will be shown below.</li>
                    <li>Classify an entire group by selecting 'Male', 'Female', or 'Unknown'.</li>
                    <li>If any faces have been incorrectly grouped together, you will need to individually classify them. To do this, left click on the face for female or right click on the face for male.</li>
                    <li>If multiple faces need to be individually classfied next to each other, click and drag.</li>
                    <li>When you have finished classifying, click the 'Results' tab.</li>
                </ol>
            </div>
        )
    }
    
}

export default Instructions;