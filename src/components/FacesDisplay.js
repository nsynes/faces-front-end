import React from 'react';

import MainPage from './MainPage';
import Instructions from './Instructions';
import FacesUnclustered from './FacesUnclustered';
import FacesClustered from './FacesClustered';

const FaceDisplay = (props) => {

    const clustered = Object.keys(props.clusteredFaceImages).length > 0;

    return (
        <MainPage visible={props.visible}>
            <Instructions tab='faces' />
            <div align='center'>
                {!props.loading && props.faceImages.length === 0 && 
                'No faces detected yet.'}
                {!clustered && props.loading &&
                <div>Detecting faces...
                    <FacesUnclustered
                        faceImages={props.faceImages}
                        videoID={props.videoID}
                        model={props.model} />
                </div>}
                { clustered &&
                <FacesClustered
                    clusteredFaceImages={props.clusteredFaceImages}
                    groupClassification={props.groupClassification}
                    faceTS={props.faceTS}
                    faceGroup={props.faceGroup}
                    videoID={props.videoID}
                    model={props.model}
                    checksPerSecond={props.checksPerSecond} 
                    incrementFaceGroup={props.incrementFaceGroup}
                    decrementFaceGroup={props.decrementFaceGroup}
                    classifyGroup={props.classifyGroup}
                    clickClassifyFace={props.clickClassifyFace}
                    hoverClassifyFace={props.hoverClassifyFace} />}
            </div>
        </MainPage>
    )
}

export default FaceDisplay;