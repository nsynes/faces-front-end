import React from 'react';

import Header from './components/Header';
import VideoDisplay from './components/VideoDisplay';
import FacesDisplay from './components/FacesDisplay';
import ResultsDisplay from './components/ResultsDisplay';
import LandingPage from './components/LandingPage';
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
      landingPage: true,
      loading: false,
      errorMsg: '',
      videoMetadata: {},
      videoURL: '',//'youtu.be/iYZbQIXoVMY',//'0_6AK52kSVQ',//'dIBsEtQyKcA',//'HsRX4myHr4o',
      videoID: '',
      faceMaxTime: 0,
      percentageComplete: 0,
      checksPerSecond: 2,
      allFaceLocations: [],
      faceGroupTS: [],
      faceGroup: null,
      faceTS: [],
      labelColours: {'male':'#0000ff', 'female':'#ff1493', '-': '#ffffff'},
      faceImages: [],
      clusteredFaceImages: {},
      groupClassification: {},
      faceListLength: null,
      model: 'cnn',
      view: 'video'
    }
  }

  classifyGroup = (id, classification) => {
    var { videoMetadata, groupClassification, faceTS } = this.state;
    
    groupClassification[id] = groupClassification[id] === classification ? null : classification;
    var numberPattern = /[\d.]+/g;
    var time, index;
    for (var i=0; i<this.state.clusteredFaceImages[id].length; i++) {
      time = this.state.clusteredFaceImages[id][i].match(numberPattern)[0];
      index = time * videoMetadata.checksPerSecond;
      faceTS[index] = [];
    }
      this.setState({ faceTS: faceTS , groupClassification: groupClassification });
    }


  handleVideoURLChange = (e) => {
    this.setVideoURL(e.target.value)
  }

  setVideoURL = (url) => {
    console.log('setVideoURL', url)
    this.setState({
      errorMsg: '',
      videoURL: url,
      videoID: '',
      allFaceLocations: [],
      faceGroupTS: [],
      faceGroup: null,
      faceTS: [],
      faceImages: [],
      clusteredFaceImages: {},
      groupClassification: {},
      videoMetadata: {},
      faceListLength: null,
      faceMaxTime: 0,
      percentageComplete: 0});
  }

  setVideoID = (id) => {
    this.setState({videoID: id})
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
    console.log('startDetection...')

    const authHeader = new Headers({ 'Authorization': this.state.user.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };
    
    fetch(`${API_URL_startDetection}?userID=${this.state.user.ID}&videoID=${this.state.videoID}&model=${this.state.model}&checksPerSecond=${this.state.checksPerSecond}`, options)
    .then(handleResponse)
    .then((result) => {
      console.log('startDetection', result)
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

      this.setState({loading: false, errorMsg: error.message})
    });
  }

  getFaceLocations = () => {
    console.log('getFaceLocations')

    const authHeader = new Headers({ 'Authorization': this.state.user.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };

    fetch(`${API_URL_getFaceLocations}?userID=${this.state.user.ID}&videoID=${this.state.videoID}&model=${this.state.model}&checksPerSecond=${this.state.checksPerSecond}&from=${this.state.faceMaxTime}`, options)
    .then(handleResponse)
    .then((result) => {
      
      const apiData = result.data;

      var { allFaceLocations, faceImages, faceListLength, videoMetadata } = this.state;
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
      
      if ( result.complete ) {
        this.clusterFaces();
      }

    })
    .catch((error) => {
        console.log('Error:', error)

        this.setState({loading: false})
    });

  }

  clusterFaces = () => {

    const authHeader = new Headers({ 'Authorization': this.state.user.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };
    
    fetch(`${API_URL_clusterFaces}?userID=${this.state.user.ID}&videoID=${this.state.videoID}&model=${this.state.model}`, options)
    .then(handleResponse)
    .then((result) => {
      
      var { faceGroupTS, faceTS, videoMetadata } = this.state;

      var numberPattern = /[\d.]+/g;
      var time, faceN, index;
      for (var groupID in result.clusters) {
        for (var i=0; i < result.clusters[groupID].length; i++) {
          [time, faceN] = result.clusters[groupID][i].match(numberPattern);
          index = time * videoMetadata.checksPerSecond;
          if ( typeof(faceGroupTS[index]) == 'undefined' ) {
            faceGroupTS[index] = []
            faceTS[index] = []
          }
          faceGroupTS[index][parseInt(faceN)] = groupID
        }
      }
      var faceGroup = Object.keys(result.clusters).length === 1 ? Object.keys(result.clusters)[0] : 0;
      this.setState({clusteredFaceImages: result.clusters, faceGroupTS: faceGroupTS, faceGroup: faceGroup, faceTS: faceTS});
    })
    .catch((error) => {
      console.log('Error:', error)

      this.setState({loading: false})
    });
  }

  hoverClassifyFace = (evt, imgName, currentClassification) => {
    if ( evt.type==='mouseenter' ) {
      var { videoMetadata, faceTS } = this.state;
      var updateTo = null;
      var numberPattern = /[\d.]+/g;
      var [time, faceN] = imgName.match(numberPattern);
      var index = time * videoMetadata.checksPerSecond;
        if ( evt.buttons === 1) {
          updateTo = currentClassification === 'female' ? null : 'female';
        } else if ( evt.buttons === 2) {
          updateTo = currentClassification === 'male' ? null : 'male';
        }
        if ( updateTo ) {
          faceTS[index][parseInt(faceN)] = updateTo;

          this.setState({ faceTS: faceTS});
        }
      }
  }

  clickClassifyFace = (evt, imgName, currentClassification) => {
      evt.preventDefault();
      if ( (evt.type=== 'mousedown' && evt.button === 0) || (evt.type==='contextmenu' && evt.button === 2) ) {
        var { videoMetadata, faceTS } = this.state;
        var updateTo = null;
        var numberPattern = /[\d.]+/g;
        var [time, faceN] = imgName.match(numberPattern);
        var index = time * videoMetadata.checksPerSecond;
        if ( evt.button === 0 ) {
          updateTo = currentClassification === 'female' ? '-' : 'female';
        } else if ( evt.button === 2 ) {
          updateTo = currentClassification === 'male' ? '-' : 'male';
        }
        faceTS[index][parseInt(faceN)] = updateTo;

        this.setState({ faceTS: faceTS})
      }
  }

  handleViewClick = (e) => {
    this.setState({ view: e.target.value })
  }

  incrementFaceGroup = () => {
    var { faceGroup } = this.state;
    if ( faceGroup !== -1 && Object.keys(this.state.clusteredFaceImages).indexOf(String(faceGroup + 1)) > -1 ) {
      this.setState({ faceGroup: faceGroup + 1});
    } else {
      this.setState({ faceGroup: -1});
    }
  }

  decrementFaceGroup = () => {
    var { faceGroup } = this.state
    if ( faceGroup > 0 ) {
      this.setState({ faceGroup: faceGroup-1});
    } else if ( faceGroup === -1 ) {
      this.setState({ faceGroup: Math.max(...Object.keys(this.state.clusteredFaceImages))});
    }
  }

  leaveLandingPage = () => {
    this.setState({landingPage: false})
  }

  render() {

    if ( this.state.landingPage ) {
      return (
        <LandingPage leaveLandingPage={this.leaveLandingPage} />
      )
    } else {
      return (
        <div className='App'>
          <Header 
            selectedTab={this.state.view}
            user={this.state.user}
            responseGoogleSuccess={this.responseGoogleSuccess}
            responseGoogleFailure={this.responseGoogleFailure}
            responseGoogleLogout={this.responseGoogleLogout}
            handleViewClick={this.handleViewClick} />
          <VideoDisplay
            visible={this.state.view === 'video'}
            user={this.state.user}
            errorMsg={this.state.errorMsg}
            videoURL={this.state.videoURL}
            videoID={this.state.videoID}
            videoType={this.state.videoType}
            allFaceLocations={this.state.allFaceLocations}
            faceGroupTS={this.state.faceGroupTS}
            faceTS={this.state.faceTS}
            groupClassification={this.state.groupClassification}
            labelColours={this.state.labelColours}
            height={this.state.videoMetadata.height}
            width={this.state.videoMetadata.width}
            checksPerSecond={this.state.videoMetadata.checksPerSecond}
            percentageComplete={this.state.percentageComplete}
            loading={this.state.loading}
            setVideoURL={this.setVideoURL}
            setVideoID={this.setVideoID}
            handleVideoURLChange={this.handleVideoURLChange}
            startDetection={this.startDetection} />
          <FacesDisplay
            visible={this.state.view === 'faces'}
            loading={this.state.loading}
            complete={this.state.percentageComplete === 100}
            groupClassification={this.state.groupClassification}
            faceTS={this.state.faceTS}
            faceGroup={this.state.faceGroup}
            videoID={this.state.videoID}
            model={this.state.model}
            faceImages={this.state.faceImages}
            clusteredFaceImages={this.state.clusteredFaceImages}
            checksPerSecond={this.state.checksPerSecond}
            incrementFaceGroup={this.incrementFaceGroup}
            decrementFaceGroup={this.decrementFaceGroup}
            classifyGroup={this.classifyGroup}
            clickClassifyFace={this.clickClassifyFace}
            hoverClassifyFace={this.hoverClassifyFace} />
          <ResultsDisplay
            videoURL={this.state.videoURL}
            allFaceLocations={this.state.allFaceLocations}
            faceGroupTS={this.state.faceGroupTS}
            faceTS={this.state.faceTS}
            groupClassification={this.state.groupClassification}
            labelColours={this.state.labelColours}
            checksPerSecond={this.state.checksPerSecond}
            totalFrames={this.state.videoMetadata.totalFrames}
            fps={this.state.videoMetadata.fps}
            setVideoID={this.setVideoID}
            visible={this.state.view === 'results'}
            labelColours={this.state.labelColours}
            groupClassification={this.state.groupClassification}
            faceGroupTS={this.state.faceGroupTS}
            faceTS={this.state.faceTS}
            checksPerSecond={this.state.checksPerSecond} />
          <br />
        </div>
      );
    }
  }
  
}

export default App;
