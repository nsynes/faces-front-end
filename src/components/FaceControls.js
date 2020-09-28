import React from 'react';
import './FaceControls.css';

function FaceControls(props) {

    var groupNumber = parseInt(props.groupID) === -1 ? props.totalFaceGroups : parseInt(props.groupID) + 1;
    console.log('props.groupClassification[props.groupID]', props.groupClassification[props.groupID])
    return (
        <div className='face-controls-container'>
            <b>Face {groupNumber} of {props.totalFaceGroups} {parseInt(props.groupID) === -1 && '(unmatched)'}</b><br/>
            <button className={`button ${props.groupClassification[props.groupID] === 'female' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, 'female')}>Female</button>
            <button className={`button ${props.groupClassification[props.groupID] === 'male' ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, 'male')}>Male</button>
            <button className={`button ${props.groupClassification[props.groupID] === null ? 'selected':''}`} onClick={() => props.classifyGroup(props.groupID, null)}>Unknown</button>
        </div>
    );
}

export default FaceControls;
