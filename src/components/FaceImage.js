import React from 'react';
import './FaceImage.css';

function FaceImage(props) {

    return (
        <img
            className={`${props.faceClassification}`}
            src={props.imagePath}
            alt=""
            height="60"
            width="60" />
    );
}

export default FaceImage;
