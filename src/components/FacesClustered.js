import React from 'react';

import FaceImage from './FaceImage';
import FaceControls from './FaceControls';
import './FacesClustered.css';

const FacesClustered = (props) => {
    
    var FaceGroups = []
    for (var groupID in props.clusteredFaceImages) {
        FaceGroups.push(
            <div className='face-group-container' key={`face${groupID}`}>
                {props.clusteredFaceImages[groupID].map((img) => 
                    <FaceImage
                        clustered={true}
                        groupID={groupID}
                        faceClassification={props.faceClassification[img] ? props.faceClassification[img] : props.groupClassification[groupID]}
                        groupClassification={props.groupClassification[groupID]}
                        imagePath={`https://face-images.s3.eu-west-2.amazonaws.com/youtube/faces/${props.videoID}/${props.model}/${img}`}
                        key={img} />)
                }
                <FaceControls 
                    groupID={groupID}
                    classifyGroup={props.classifyGroup}
                    groupClassification={props.groupClassification}
                    />
            </div>
        )
    }

    return (
        <div className='face-container'>
            {FaceGroups}
        </div>
    )
}

export default FacesClustered;