import React from 'react';
import './FaceControls.css';

function FaceControls(props) {

    return (
        <div className='face-controls-container'>
            <b>Face {props.groupID}: {parseInt(props.groupID) === -1 && '(unmatched faces)'}</b><br/>
            <button className={`face-button ${props.groupClassification[props.groupID] === 'female' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, 'female')}>Female</button>
            <button className={`face-button ${props.groupClassification[props.groupID] === 'male' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, 'male')}>Male</button>
            <button className={`face-button ${props.groupClassification[props.groupID] === 'unknown' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, 'unknown')}>Unknown</button>
        </div>
    );
}

export default FaceControls;
