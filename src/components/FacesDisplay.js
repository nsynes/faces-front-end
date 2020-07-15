import React from 'react';

import MainPage from './MainPage';
import FacesUnclustered from './FacesUnclustered';
import FacesClustered from './FacesClustered';

const FaceDisplay = (props) => {

    return (
        <MainPage visible={props.visible}>
            <div align='center'>
                {props.faceImages.length === 0 && 
                'No faces detected yet...'}
                {props.complete &&
                <button onClick={props.clusterFaces}>Cluster</button>}
                {!props.clustered &&
                <FacesUnclustered
                    faceImages={props.faceImages}
                    videoID={props.videoID}
                    model={props.model} />}
                {props.clustered &&
                <FacesClustered
                    clusteredFaceImages={props.clusteredFaceImages}
                    faceClassification={props.faceClassification}
                    groupClassification={props.groupClassification}
                    videoID={props.videoID}
                    model={props.model}
                    classifyGroup={props.classifyGroup}/>}
            </div>
        </MainPage>
    )
}

export default FaceDisplay;