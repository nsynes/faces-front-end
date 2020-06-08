import React from 'react';
import GoogleLogin from 'react-google-login';

import Video from './components/Video';
import './App.css';

var collectInterval;

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      authorization: null,
      loading: false,
      loggedIn: false,
      videoTextBox: 'ivoPGxUBqxQ',//'iYZbQIXoVMY',
      videoID: 'ivoPGxUBqxQ',//'iYZbQIXoVMY',
      faceMaxTime: 0,
      percentageComplete: 0,
      allFaceLocations: [],
      videoMetadata: null,
      model: 'cnn'
    }
  }

  handleVideoTextBoxChange = (e) => {
    this.setState({videoTextBox: e.target.value});
  }

  setVideo = () => {
    const { videoTextBox } = this.state
    this.setState({videoID: videoTextBox, allFaceLocations: [], faceMaxTime: 0, percentageComplete: 0});
  }

  responseGoogleSuccess = (response) => {
    this.setState({ authorization: response.tokenObj.id_token, loggedIn: true })
  }

  responseGoogleFailure = (response) => {
    console.log('google failure response', response);
    this.setState({ authorization: '', loggedIn: false })
  }

  findFaces = () => {
    this.setState({loading: true})

    const authHeader = new Headers({ 'Authorization': this.state.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };
    
    fetch(`https://wnkv4uuq5f.execute-api.eu-west-2.amazonaws.com/development/?videoID=${this.state.videoID}&model=${this.state.model}`, options)
    .then((response) => {
      return response.json().then(json => {
          return response.ok ? json : Promise.reject(json);
      })})
    .then((result) => {
      setTimeout(() => {
        this.getMetadata();
      }, 1000);
      collectInterval = setInterval(() => {
        this.getFaces();
      }, 5000);
    })
    .catch((error) => {
      console.log('Error:', error)
    });
  }

  getFaces = () => {

    const authHeader = new Headers({ 'Authorization': this.state.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };

    //fetch(`https://c0elg3n3k0.execute-api.eu-west-2.amazonaws.com/development/?videoID=${this.state.videoID}&from=${this.state.faceMaxTime}`, options)
    fetch(`https://c0elg3n3k0.execute-api.eu-west-2.amazonaws.com/development/?videoID=${this.state.videoID}&model=${this.state.model}`, options)
    .then((response) => {
      return response.json().then(json => {
          return response.ok ? json : Promise.reject(json);
      })})
    .then((result) => {
      console.log('faces', result)
      const apiData = result.data;

      if ( result.complete === 'finished' ) clearInterval(collectInterval);

      if ( this.state.videoMetadata ) {
        const { videoMetadata } = this.state;
        const listLength = parseFloat(videoMetadata.totalFrames) / (parseFloat(videoMetadata.fps) / parseFloat(videoMetadata.checksPerSecond) ) + 1;
      
        var allFaceLocations = [];
        var maxTime = 0;
        
        var time = 0;
        for(var i = 0; i < listLength; i++) {
          if ( apiData.hasOwnProperty(time) ) {
            maxTime = Math.max(parseFloat(time), maxTime) // NEED TO WORK OUT THE MAX TIME OF CURRENTLY COLLECTED FACES
            allFaceLocations.push(apiData[time].map(x => x.map(y => parseFloat(y))));
          } else {
            allFaceLocations.push([])
          }
          time += 1/parseFloat(videoMetadata.checksPerSecond)
        }
        console.log('maxTime', maxTime)
        const percentageComplete = result.complete === 'finished' ? 100 : Math.round(maxTime / (videoMetadata.totalFrames / videoMetadata.fps) * 100);
        const loading = percentageComplete === 100 ? false : true;
        console.log('loading', loading)
        this.setState({ allFaceLocations: allFaceLocations, faceMaxTime: maxTime, percentageComplete: percentageComplete, loading: loading })
      }
      
    })
    .catch((error) => {
        console.log('Error:', error)
    });

  }

  getMetadata = () => {

    const authHeader = new Headers({ 'Authorization': this.state.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };

    fetch(`https://1l0ccewty2.execute-api.eu-west-2.amazonaws.com/development/?videoID=${this.state.videoID}`, options)
    .then((response) => {
      return response.json().then(json => {
          return response.ok ? json : Promise.reject(json);
      })})
    .then((result) => {
        const apiMetadata = result.data;
        console.log('apiMetadata', apiMetadata)
        this.setState({ videoMetadata: apiMetadata })
        
    })
    .catch((error) => {
        console.log('Error:', error)
    });


  }

  render() {
    return (
      <div className='App'>
        <br/>
        <GoogleLogin
          clientId="822628944241-25go8osgljjdaeu9fb03ibc7jofl917l.apps.googleusercontent.com"
          buttonText={this.state.loggedIn ? 'Logged in' : 'Login'}
          onSuccess={this.responseGoogleSuccess}
          onFailure={this.responseGoogleFailure}
          cookiePolicy={'single_host_origin'} />
        <br/>
        <br/>
        <input type="text" name="videoTextBox" value={this.state.videoTextBox} onChange={this.handleVideoTextBoxChange} />
        <button onClick={this.setVideo}>Set video</button>
        <br/>
        <br/>
        {this.state.videoID && this.state.authorization && <div>
          <button onClick={this.findFaces}>Find faces</button>
        </div>}
        <br/>
        <br/>
        {this.state.videoID &&
          <Video
            videoID={this.state.videoID}
            allFaceLocations={this.state.allFaceLocations}
            videoMetadata={this.state.videoMetadata}
            percentageComplete={this.state.percentageComplete}
            loading={this.state.loading} />}
      </div>
    );
  }
  
}

export default App;
