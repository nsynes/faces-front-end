import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import Video from './components/Video';
import './App.css';
import { API_URL_startDetection, API_URL_getFaceLocations } from './config.js';
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
      videoTextBox: 'ivoPGxUBqxQ',//'iYZbQIXoVMY',
      videoID: 'ivoPGxUBqxQ',//'iYZbQIXoVMY',
      videoType: 'youtube',
      faceMaxTime: 0,
      percentageComplete: 0,
      checksPerSecond: 1,
      allFaceLocations: [],
      faceImages: [],
      videoMetadata: {},
      faceListLength: 0,
      model: 'hog',
      view: 'video'
    }
  }

  handleVideoTextBoxChange = (e) => {
    this.setState({videoTextBox: e.target.value});
  }

  setVideo = () => {
    const { videoTextBox } = this.state
    this.setState({
      videoID: videoTextBox,
      allFaceLocations: [],
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
      
      collectInterval = setInterval(() => {
        this.getFaceLocations();
      }, 5000);
    })
    .catch((error) => {
      console.log('Error:', error)
    });
  }

  getFaceLocations = () => {

    const authHeader = new Headers({ 'Authorization': this.state.user.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };

    fetch(`${API_URL_getFaceLocations}/?userID=${this.state.user.ID}&videoID=${this.state.videoID}&model=${this.state.model}&checksPerSecond=${this.state.checksPerSecond}&from=${this.state.faceMaxTime}`, options)
    .then(handleResponse)
    .then((result) => {
      console.log('faces result', result)
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
      this.setState({ user: user, allFaceLocations: allFaceLocations, faceMaxTime: maxTime, percentageComplete: percentageComplete, loading: loading })
      
    })
    .catch((error) => {
        console.log('Error:', error)
    });

  }

  handleViewClick = (e) => {
    this.setState({ view: e.target.innerHTML.toLowerCase() })
  }

  render() {

    const timeRemaining = `${Math.floor(this.state.user.secondsRemaining/3600)}:${("0" + Math.floor((this.state.user.secondsRemaining%3600)/60)).slice(-2)}:${("0" + Math.floor((this.state.user.secondsRemaining%3600)%60)).slice(-2)}`

    const faceImages = this.state.faceImages.map((img, i) => {
      return <img key={i}src={`https://face-images.s3.eu-west-2.amazonaws.com/youtube/faces/${this.state.videoID}/${this.state.model}/${img}`}></img>
    })

    return (
      <div className='App'>
        <div className='login-container'>
          <div className='login-status'>
            { this.state.user.loggedIn ? `Logged in as: ${this.state.user.name}`: 'Log in to use the tool' }
            <br/>
            { this.state.user.secondsRemaining ? `Time remaining (H:M:S): ${timeRemaining}`: ''}
          </div>
          <GoogleLogin
            className='google-button'
            clientId="822628944241-25go8osgljjdaeu9fb03ibc7jofl917l.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogleSuccess}
            onFailure={this.responseGoogleFailure}
            isSignedIn={true}
            cookiePolicy={'single_host_origin'} />
          <GoogleLogout
            className='google-button'
            clientId="822628944241-25go8osgljjdaeu9fb03ibc7jofl917l.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={this.responseGoogleLogout}
            onFailure={this.responseGoogleFailure}
            isSignedIn={true} />
          <div className='video-select-container'>
            <input
              type="text"
              name="videoTextBox"
              value={this.state.videoTextBox}
              placeholder={'Video URL'}
              onChange={this.handleVideoTextBoxChange} />
            <button onClick={this.setVideo}>Select video</button>
            <button
              onClick={this.startDetection}
              disabled={(this.state.videoID && this.state.user.loggedIn) ? false : true}>Find faces
            </button>
          </div>
          <div className='tab-buttons'>
            <button onClick={this.handleViewClick}>Video</button>
            <button onClick={this.handleViewClick}>Faces</button>
          </div>
        </div>
        <div style={{paddingTop: '8em', display: this.state.view === 'video'? 'block' : 'none'}}>
          {this.state.videoID &&
          <Video
            videoID={this.state.videoID}
            videoType={this.state.videoType}
            allFaceLocations={this.state.allFaceLocations}
            height={this.state.videoMetadata.height}
            width={this.state.videoMetadata.width}
            checksPerSecond={this.state.videoMetadata.checksPerSecond}
            percentageComplete={this.state.percentageComplete}
            loading={this.state.loading} />}
        </div>
        <div style={{paddingTop: '8em', display: this.state.view === 'faces'? 'block' : 'none'}}>
          Face images...
          {faceImages}
        </div>
      </div>
    );
  }
  
}

export default App;
