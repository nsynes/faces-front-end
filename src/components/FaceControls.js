import React from 'react';
import './FaceControls.css';

function FaceControls(props) {

    var groupNumber = props.groupID === -1 ? props.totalFaceGroups : props.groupID + 1;

    return (
        <div className='face-controls-container'>
            <b>Face {groupNumber} of {props.totalFaceGroups} {parseInt(props.groupID) === -1 && '(unmatched)'}</b><br/>
            <button className={`button ${props.groupClassification[props.groupID] === 'female' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, 'female')}>Female</button>
            <button className={`button ${props.groupClassification[props.groupID] === 'male' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, 'male')}>Male</button>
            <button className={`button ${props.groupClassification[props.groupID] === 'unknown' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, null)}>Unknown</button>
        </div>
    );
}

export default FaceControls;
