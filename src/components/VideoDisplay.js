import React from 'react';
import ReactPlayer from 'react-player'

import MainPage from './MainPage';
import './VideoDisplay.css';

var videoInterval;

class VideoDisplay extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      validVideo: true,
      player: null,
      n: null,
      faceLocations: [] // top, right, bottom, left
    };

    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
  }

  onPlayVideo() {
    videoInterval = setInterval(() => {
        if ( this.props.checksPerSecond ) {
          const n = Math.floor(this.player.getCurrentTime() * this.props.checksPerSecond)
          this.setState({ faceLocations: this.props.allFaceLocations[n], n: n })
        }
    }, 100)
  }

  onPauseVideo() {
    clearInterval(videoInterval);
  }

  onReady = (e) => {
    console.log('onReady', e)
    this.setState({validVideo: true})
  }

  onError = (error) => {
    console.log('onError', error)
    this.setState({validVideo: false})
  }

  ref = player => {
    this.player = player
  }

  render() {

    const { allFaceGroups, groupClassification, labelColours } = this.props;
    const { n, faceLocations } = this.state;
    var boxColour;
    if ( faceLocations ) {
      var faceBoxes = faceLocations.map((loc, ix) => {
        boxColour = allFaceGroups[n] && allFaceGroups[n][ix] && groupClassification[allFaceGroups[n][ix]] ? labelColours[groupClassification[allFaceGroups[n][ix]]] : '#ffffff';
        return <div className='face-box' key={`${loc}`}
                  style={{top: `${loc[0]}%`, left: `${loc[3]}%`, width: `${(loc[1]-loc[3])}%`, height: `${(loc[2]-loc[0])}%`, color: boxColour}} />
      })
    }

    if ( this.props.videoID ) {
      return (
        <MainPage visible={this.props.visible}>
          <div className='video-top-container'>
            <div className='video-container'>
              <ReactPlayer
                className='react-player'
                ref={this.ref}
                url={`https://www.youtube.com/watch?v=${this.props.videoID}`}
                width='100%'
                height='100%'
                controls={true}
                onReady={this.onReady}
                onPlay={this.onPlayVideo}
                onPause={this.onPauseVideo}
                onError={this.onError} />
              {this.state.faceLocations && this.state.faceLocations.length > 0 && faceBoxes}
            </div>
            <div className='video-details'>
              <div className='percentage-box'>
                <div style={{position: 'absolute', left: 0, backgroundColor: 'red', width: this.props.percentageComplete+'%', height: 5}} />
              </div>
              Face detection: {this.props.percentageComplete}%
            </div>
          </div>
        </MainPage>
      );
    }
    return <div>Invalid video selected</div>    
  }
}

export default VideoDisplay;