import React from 'react';

import Header from './components/Header';
import Loading from './components/Loading';
import VideoDisplay from './components/VideoDisplay';
import FacesDisplay from './components/FacesDisplay';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';
import { API_URL_startDetection, API_URL_getFaceLocations, API_URL_clusterFaces } from './config.js';
import { handleResponse } from './helpers';

var collectInterval;

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      user: {
        loggedIn: false,
        name: null,
        givenName: null,
        familyName: null,
        ID: null,
        authorization: null,
        secondsRemaining: null
      },
      loading: false,
      videoTextBox: 'dIBsEtQyKcA',//'iYZbQIXoVMY',
      videoID: 'dIBsEtQyKcA',//'iYZbQIXoVMY',
      videoType: 'youtube',
      faceMaxTime: 0,
      percentageComplete: 0,
      complete: false,
      checksPerSecond: 4,
      allFaceLocations: [],
      allFaceGroups: [],
      labelColours: {'male':'#0000ff', 'female':'#ff1493'},
      faceImages: [],
      clusteredFaceImages: {},
      groupClassification: {},
      faceClassification: {},
      allClassified: false,
      videoMetadata: {},
      faceListLength: 0,
      model: 'cnn',
      view: 'results',
      clustered: false
    }
  }

  classifyGroup = (id, classification) => {
    var groupClassification = this.state.groupClassification;
    groupClassification[id] = groupClassification[id] === classification ? "" : classification;
    const allClassified = Object.values(groupClassification).every((val) => val !== "")
    this.setState({ groupClassification: groupClassification, allClassified: allClassified })
}

  handleVideoTextBoxChange = (e) => {
    this.setState({videoTextBox: e.target.value});
  }

  setVideo = () => {
    const { videoTextBox } = this.state
    this.setState({
      videoID: videoTextBox,
      allFaceLocations: [],
      allFaceGroups: [],
      faceMaxTime: 0,
      percentageComplete: 0});
  }

  responseGoogleSuccess = (response) => {
    const user = {
      loggedIn: true,
      name: response.profileObj.name,
      givenName: response.profileObj.givenName,
      familyName: response.profileObj.familyName,
      ID: `google:${response.profileObj.googleId}`,
      authorization: response.tokenObj.id_token
    }
    this.setState({ user })
  }

  responseGoogleLogout = (response) => {
    const user = {
      loggedIn: false,
      name: null,
      givenName: null,
      familyName: null,
      authorization: null
    }
    this.setState({ user })
  }

  responseGoogleFailure = (response) => {
    const user = {
      loggedIn: false,
      name: null,
      givenName: null,
      familyName: null,
      authorization: null
    }
    this.setState({ user })
  }

  startDetection = () => {
    this.setState({loading: true})

    const authHeader = new Headers({ 'Authorization': this.state.user.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };
    
    fetch(`${API_URL_startDetection}?userID=${this.state.user.ID}&videoID=${this.state.videoID}&model=${this.state.model}&checksPerSecond=${this.state.checksPerSecond}`, options)
    .then(handleResponse)
    .then((result) => {
      console.log('started', result)
      const videoMetadata = result.data;
      const faceListLength = parseFloat(videoMetadata.totalFrames) / (parseFloat(videoMetadata.fps) / parseFloat(videoMetadata.checksPerSecond) ) + 1;
    
      var { user } = this.state;
      user.secondsRemaining = result.user.secondsRemaining;
      this.setState({ user: user, videoMetadata: videoMetadata, faceListLength: faceListLength })
      
      if ( result.complete ) {
        this.getFaceLocations();
      } else {
        collectInterval = setInterval(() => {
          this.getFaceLocations();
        }, 5000);
      }
    })
    .catch((error) => {
      console.log('Error:', error)
    });
  }

  getFaceLocations = () => {

    const authHeader = new Headers({ 'Authorization': this.state.user.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };

    fetch(`${API_URL_getFaceLocations}?userID=${this.state.user.ID}&videoID=${this.state.videoID}&model=${this.state.model}&checksPerSecond=${this.state.checksPerSecond}&from=${this.state.faceMaxTime}`, options)
    .then(handleResponse)
    .then((result) => {
      
      const apiData = result.data;

      var { allFaceLocations, allFaceGroups, faceImages, faceListLength, videoMetadata } = this.state;
      var maxTime = 0;
      
      var time = 0;
      for (var i = 0; i < faceListLength; i++) {
        if ( apiData.hasOwnProperty(time) ) {
          maxTime = Math.max(parseFloat(time), maxTime)
          allFaceLocations[i] = apiData[time];
        }
        time += 1/parseFloat(videoMetadata.checksPerSecond)
      }

      for (i=0; i < result.images.length; i++) {
        if ( faceImages.indexOf(result.images[i]) === -1 )
          faceImages.push(result.images[i])
      }
      
      var loading = true;
      if ( result.complete || result.user.secondsRemaining === 0 ){
        clearInterval(collectInterval);
        loading = false;
      }

      var { user } = this.state;
      user.secondsRemaining = result.user.secondsRemaining;

      const percentageComplete = result.complete ? 100 : Math.round(maxTime / (videoMetadata.totalFrames / videoMetadata.fps) * 100);
      this.setState({ user: user, allFaceLocations: allFaceLocations, faceMaxTime: maxTime, percentageComplete: percentageComplete, loading: loading, complete: result.complete })
      
    })
    .catch((error) => {
        console.log('Error:', error)
    });

  }

  clusterFaces = () => {

    const authHeader = new Headers({ 'Authorization': this.state.user.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };
    
    fetch(`${API_URL_clusterFaces}?userID=${this.state.user.ID}&videoID=${this.state.videoID}&model=${this.state.model}`, options)
    .then(handleResponse)
    .then((result) => {
      console.log('cluster result', result)
      var { faceListLength, allFaceGroups, videoMetadata } = this.state;

      var numberPattern = /[\d.]+/g;
      var time, faceN, index;
      for (var groupID in result.clusters) {
        for (var i=0; i < result.clusters[groupID].length; i++) {
          [time, faceN] = result.clusters[groupID][i].match(numberPattern);
          console.log(result.clusters[groupID][i], time, faceN)
          index = time * videoMetadata.checksPerSecond;
          if ( typeof(allFaceGroups[index]) == 'undefined' ) {
            allFaceGroups[index] = []
          }
          allFaceGroups[index][parseInt(faceN)] = groupID
        }
      }
      console.log('allFaceGroups',allFaceGroups)
      

      this.setState({clustered: true, clusteredFaceImages: result.clusters, allFaceGroups: allFaceGroups})
    })
    .catch((error) => {
      console.log('Error:', error)
    });
  }

  handleViewClick = (e) => {
    this.setState({ view: e.target.innerHTML.toLowerCase() })
  }

  render() {

    return (
      <div className='App'>
        <Header 
          user={this.state.user}
          loading={this.state.loading}
          videoTextBox={this.state.videoTextBox}
          videoID={this.state.videoID}
          responseGoogleSuccess={this.responseGoogleSuccess}
          responseGoogleFailure={this.responseGoogleFailure}
          responseGoogleLogout={this.responseGoogleLogout}
          handleVideoTextBoxChange={this.handleVideoTextBoxChange}
          setVideo={this.setVideo}
          startDetection={this.startDetection}
          handleViewClick={this.handleViewClick} />
        {this.state.loading && <Loading size='medium'/>}
        <VideoDisplay
          visible={this.state.view === 'video'}
          videoID={this.state.videoID}
          videoType={this.state.videoType}
          allFaceLocations={this.state.allFaceLocations}
          allFaceGroups={this.state.allFaceGroups}
          groupClassification={this.state.groupClassification}
          labelColours={this.state.labelColours}
          height={this.state.videoMetadata.height}
          width={this.state.videoMetadata.width}
          checksPerSecond={this.state.videoMetadata.checksPerSecond}
          percentageComplete={this.state.percentageComplete}
          loading={this.state.loading} />
        <FacesDisplay
          visible={this.state.view === 'faces'}
          complete={this.state.complete}
          groupClassification={this.state.groupClassification}
          faceClassification={this.state.faceClassification}
          clustered={this.state.clustered}
          videoID={this.state.videoID}
          model={this.state.model}
          faceImages={this.state.faceImages}
          clusteredFaceImages={this.state.clusteredFaceImages}
          classifyGroup={this.classifyGroup}
          clusterFaces={this.clusterFaces} />
        <ResultsDisplay
          visible={this.state.view === 'results'} />
      </div>
    );
  }
  
}

export default App;
