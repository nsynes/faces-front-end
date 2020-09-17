import React from 'react';
import './FaceImage.css';

function FaceImage(props) {
    return (
        <img
            className={`${props.currentClassification}`}
            src={props.imagePath}
            onMouseDown={(evt) => props.clustered && props.clickClassifyFace(evt, props.imagePath.replace(/^.*[\\/]/, ''), props.currentClassification)}
            onContextMenu={(evt) => props.clustered && props.clickClassifyFace(evt, props.imagePath.replace(/^.*[\\/]/, ''), props.currentClassification)}
            onMouseEnter={(evt) => props.clustered && props.hoverClassifyFace(evt, props.imagePath.replace(/^.*[\\/]/, ''), props.currentClassification)}
            alt="Face" />
    );
}

export default FaceImage;
