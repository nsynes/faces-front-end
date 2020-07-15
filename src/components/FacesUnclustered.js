import React from 'react';

import FaceImage from './FaceImage';
import './FacesUnclustered.css';

const FacesUnclustered = (props) => {

    var faces = props.faceImages.map((img,i) => 
      <FaceImage
        imagePath={`https://face-images.s3.eu-west-2.amazonaws.com/youtube/faces/${props.videoID}/${props.model}/${img}`}
        key={i} />
    )

    return (
        <div className='face-container'>
            {faces}
        </div>
    )
}

export default FacesUnclustered;