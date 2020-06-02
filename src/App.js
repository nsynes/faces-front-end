import React from 'react';
import GoogleLogin from 'react-google-login';

import Video from './components/Video';
import './App.css';

var collectInterval;

/*
Example face data:
"{"complete":true,"data":{"0":[["32.5","57.3","39.6","53.3"],["33.2","93.1","41.8","88.3"]],"1":[["32.5","57.3","39.6","53.3"]],"2":[["32.5","56.9","39.6","52.9"],["33.2","93.1","41.8","88.3"]],"3":[["33.1","56.4","39","53"],["30.7","93","41.1","87.2"]],"4":[["33.1","56.4","39","53"],["30.7","93","41.1","87.2"]],"5":[["33.1","56","39","52.7"],["32.5","92.4","39.6","88.4"]],"6":[["33.1","56","39","52.7"],["32.5","92.4","39.6","88.4"]],"7":[["33.1","56","39","52.7"],["31.2","93.1","40","88.3"]],"8":[["33.1","56","39","52.7"],["32.5","92.4","39.6","88.4"]],"9":[["33.1","55.6","39","52.3"],["31.8","93.7","42.2","87.8"]],"10":[["32.5","56","39.6","52"],["33.2","92.4","40.4","88.4"]],"11":[["32.5","56","39.6","52"]],"12":[["33.1","56","39","52.7"]],"13":[["32.5","56.5","39.6","52.4"],["32.2","93.1","40.8","88.3"]],"14":[["33.1","55.6","39","52.3"]],"15":[["32.5","56","39.6","52"],["32.2","93.7","40.8","88.8"]],"16":[["32.5","56.5","39.6","52.4"]],"17":[["33.1","56.4","39","53"],["33.2","92.4","40.4","88.4"]],"18":[["32.5","56.5","39.6","52.4"],["33.2","92.4","40.4","88.4"]],"20":[["33.1","56","39","52.7"],["31.2","93.1","40","88.3"]],"21":[["33.1","56","39","52.7"],["32.5","92.4","39.6","88.4"]],"22":[["33.1","56","39","52.7"],["33.2","92.4","40.4","88.4"]],"23":[["33.6","56","39.7","52.7"]],"24":[["33.1","55.6","39","52.3"],["32.5","92.4","39.6","88.4"]],"25":[["32.5","56","39.6","52"]],"26":[["32.5","56","39.6","52"],["32.5","92.4","39.6","88.4"]],"27":[["33.1","55.6","39","52.3"],["31.2","93.1","40","88.3"]],"28":[["33.1","55.6","39","52.3"]],"29":[["33.1","55.6","39","52.3"]],"30":[["33.6","55.6","39.7","52.3"],["32.2","93.1","40.8","88.3"]],"31":[["33.1","55.6","39","52.3"]],"32":[["33.6","55.6","39.7","52.3"],["34","92","41.2","88"]],"33":[["33.6","55.6","39.7","52.3"],["33.2","92.7","41.8","87.7"]],"34":[["33.6","55.6","39.7","52.3"],["31.8","93","42.2","87.2"]],"35":[["33.2","56","40.4","52"],["33.2","92.4","40.4","88.4"]],"36":[["33.6","55.6","39.7","52.3"],["33.2","92.4","40.4","88.4"]],"37":[["33.6","55.6","39.7","52.3"],["31.2","93.1","40","88.3"]],"38":[["33.6","55.6","39.7","52.3"]],"40":[["13.6","57.3","35.1","45.3"]],"41":[["11.2","56","32.8","43.9"]],"42":[["13.6","58.8","35.1","46.6"]],"43":[["11.2","56","32.8","43.9"]],"44":[["10.7","57.6","36.5","43"]],"45":[["13.6","57.3","35.1","45.3"]],"46":[["16.1","56","37.5","43.9"]],"47":[["11.2","57.3","32.8","45.3"]],"48":[["11.2","57.3","32.8","45.3"]],"49":[["10.7","57.6","36.5","43"]],"50":[["11.2","57.3","32.8","45.3"]],"51":[["10.7","57.6","36.5","43"]],"52":[["13.6","57.3","35.1","45.3"]],"53":[["13.6","56","35.1","43.9"]],"54":[["13.6","57.3","35.1","45.3"]],"55":[["10.7","57.6","36.5","43"]],"56":[["13.6","57.3","35.1","45.3"]],"57":[["10.7","55.9","36.5","41.5"]],"58":[["10.7","59.2","36.5","44.7"]],"60":[["10.7","59.2","36.5","44.7"]],"61":[["10.7","59.2","36.5","44.7"]],"62":[["13.6","57.3","35.1","45.3"]],"63":[["13.6","57.3","35.1","45.3"]],"64":[["10.7","57.6","36.5","43"]],"65":[["10.7","57.6","36.5","43"]],"66":[["10.7","57.6","36.5","43"]],"67":[["10.7","57.6","36.5","43"]],"68":[["11.2","57.3","32.8","45.3"]],"69":[["10.7","59.2","36.5","44.7"]],"70":[["13.6","57.3","35.1","45.3"]],"71":[["10.7","59.2","36.5","44.7"]],"72":[["13.6","57.6","39.4","43"]],"73":[["11.2","57.3","32.8","45.3"]],"74":[["13.6","56","35.1","43.9"]],"75":[["13.6","57.3","35.1","45.3"]],"76":[["7.9","59.2","33.6","44.7"]],"77":[["10.7","59.2","36.5","44.7"]],"78":[["11.2","57.3","32.8","45.3"]]}}"
"{"data":{"complete":true,"width":"1280","height":"720","fps":"25","videoID":"ivoPGxUBqxQ","checksPerSecond":"1","totalFrames":"2208"}}"
*/

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      authorization: null,
      loading: false,
      loggedIn: false,
      videoTextBox: 'ivoPGxUBqxQ',
      videoID: '',
      faceMaxTime: 0,
      percentageComplete: 0,
      allFaceLocations: [],
      videoMetadata: null
    }
  }

  handleVideoTextBoxChange = (e) => {
    this.setState({videoTextBox: e.target.value});
  }

  setVideo = () => {
    const { videoTextBox } = this.state
    this.setState({videoID: videoTextBox, allFaceLocations: []});
  }

  responseGoogleSuccess = (response) => {
    console.log('google success response', response);
    this.setState({ authorization: response.tokenObj.id_token, loggedIn: true })
  }

  responseGoogleFailure = (response) => {
    console.log('google failure response', response);
    this.setState({ authorization: '', loggedIn: false })
  }

  findFaces = () => {

    const authHeader = new Headers({ 'Authorization': this.state.authorization, 'Content-Type': 'application/json' });
    const options = { headers: authHeader };
    
    fetch(`https://wnkv4uuq5f.execute-api.eu-west-2.amazonaws.com/development/?videoID=${this.state.videoID}`, options)
    .then((response) => {
      return response.json().then(json => {
          return response.ok ? json : Promise.reject(json);
      })})
    .then((result) => {
      this.setState({loading: true})
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
    fetch(`https://c0elg3n3k0.execute-api.eu-west-2.amazonaws.com/development/?videoID=${this.state.videoID}`, options)
    .then((response) => {
      return response.json().then(json => {
          return response.ok ? json : Promise.reject(json);
      })})
    .then((result) => {
      console.log('faces', result)
      const apiData = result.data;

      if ( result.complete ) clearInterval(collectInterval);

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
        const percentageComplete = result.complete ? 100 : Math.round(maxTime / (videoMetadata.totalFrames / videoMetadata.fps) * 100);
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
