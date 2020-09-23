import React from 'react';

import FaceImage from './FaceImage';
import FaceControls from './FaceControls';
import KeyboardArrowLeftRounded from '@material-ui/icons/KeyboardArrowLeftRounded';
import KeyboardArrowRightRounded from '@material-ui/icons/KeyboardArrowRightRounded';
import './FacesClustered.css';

const FacesClustered = (props) => {
    
    var numberPattern = /[\d.]+/g;
    var time, faceN, index;
    
    var totalFaceGroups = Object.keys(props.clusteredFaceImages).length;

    
    return (
        <div>
            <FaceControls 
                groupID={props.faceGroup}
                totalFaceGroups={totalFaceGroups}
                classifyGroup={props.classifyGroup}
                groupClassification={props.groupClassification} />
            {props.faceGroup !== 0 && Object.keys(props.clusteredFaceImages).length > 1 &&
            <button
                className='button faces-left'
                onClick={props.decrementFaceGroup}>
                    <KeyboardArrowLeftRounded fontSize='large' />
            </button>}
            {props.faceGroup !== -1 && Object.keys(props.clusteredFaceImages).length > 1 && 
            <button
                className='button faces-right'
                onClick={props.incrementFaceGroup}>
                    <KeyboardArrowRightRounded fontSize='large' />
            </button>}
            <div className='face-container'>
                <div className='face-group-container' key={`face${props.faceGroup}`}>
                    {props.clusteredFaceImages[props.faceGroup].map((img) => {
                        [time, faceN] = img.match(numberPattern);
                        index = time * props.checksPerSecond;
                        return <FaceImage
                            clustered={true}
                            groupID={props.faceGroup}
                            currentClassification={props.faceTS[index] && props.faceTS[index].length > 0 && props.faceTS[index][parseInt(faceN)] ? props.faceTS[index][parseInt(faceN)] : props.groupClassification[props.faceGroup] }
                            imagePath={`https://face-images.s3.eu-west-2.amazonaws.com/youtube/faces/${props.videoID}/${props.model}/${img}`}
                            key={img}
                            clickClassifyFace={props.clickClassifyFace}
                            hoverClassifyFace={props.hoverClassifyFace} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default FacesClustered;