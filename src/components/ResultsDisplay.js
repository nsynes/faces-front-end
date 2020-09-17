import React from 'react';
import { BarChart, Bar, Legend, Tooltip, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';

import MainPage from './MainPage';
import Video from './Video';
import ChartToolTip from './ChartToolTip';

const ResultsDisplay = (props) => {

    const { faceGroupTS, faceTS, groupClassification, checksPerSecond } = props;
    var maleTotal = 0, femaleTotal = 0;
    var timeseries = [];
    var mCount, fCount;
    for ( var i = 0; i < faceGroupTS.length; i++ ) {
        if ( faceTS[i] && faceTS[i].length > 0 ) {
            mCount=0;
            fCount=0;
            for ( var j = 0; j < faceTS[i].length; j++ ) {
                if ( faceTS[i][j] === 'male' ) {
                    maleTotal += 1/checksPerSecond;
                    mCount -= 1
                }
                else if ( faceTS[i][j] === 'female' ) {
                    femaleTotal += 1/checksPerSecond;
                    fCount += 1;
                }
            }
            timeseries.push({time: i/checksPerSecond, male: mCount, female: fCount})
        }
        else if ( faceGroupTS[i] ) {
            mCount=0;
            fCount=0;
            for ( var jj = 0; jj < faceGroupTS[i].length; jj++ ) {
                if ( groupClassification[faceGroupTS[i][jj]] === 'male' ) {
                    maleTotal += 1/checksPerSecond;
                    mCount -= 1
                }
                else if ( groupClassification[faceGroupTS[i][jj]] === 'female' ) {
                    femaleTotal += 1/checksPerSecond;
                    fCount += 1;
                }
            }
            timeseries.push({time: i/checksPerSecond, male: mCount, female: fCount})
        }
    }
    // Add blank data after end of video time to ensure full graph is shown
    timeseries.push({time: props.totalFrames/props.fps+1, male: 0, female: 0})
    
    const malePercent = maleTotal/(maleTotal+femaleTotal)*100;
    const femalePercent = femaleTotal/(maleTotal+femaleTotal)*100;
    
    if ( faceGroupTS && faceGroupTS.length > 0 ) {
        return (
            <MainPage visible={props.visible}>
                <div align='center' style={{marginTop: '2em'}}>
                    <div className='video-top-container'>
                        <div className='video-container'>
                            <Video
                                videoURL={props.videoURL}
                                allFaceLocations={props.allFaceLocations}
                                faceGroupTS={props.faceGroupTS}
                                faceTS={props.faceTS}
                                groupClassification={props.groupClassification}
                                labelColours={props.labelColours}
                                checksPerSecond={props.checksPerSecond}
                                setVideoID={props.setVideoID} />
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <BarChart
                        width={730}
                        height={250}
                        data={timeseries}
                        stackOffset="sign"
                        margin={{top: 0, right: 0, left: 0, bottom: 0}}
                        barCategoryGap={0}>
                    <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="time" tickFormatter={timeStr => new Date(timeStr * 1000).toISOString().substr(14, 5)} />
                        <YAxis tickFormatter={(label) => Math.abs(label)}/>
                        <Legend />
                        <Tooltip content={<ChartToolTip chartName={'timeseries'}/>} />
                        <ReferenceLine y={0} stroke="#000" />
                        <Bar dataKey="male" fill={props.labelColours['male']} stackId="stack" />
                        <Bar dataKey="female" fill={props.labelColours['female']} stackId="stack" />
                    </BarChart>
                    <br />
                    <br />
                    <br />
                    <BarChart width={730} height={250} data={[{name: '', male: malePercent, female: femalePercent}]}>
                    <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(label) => `${label}%`}/>
                        <Tooltip content={<ChartToolTip chartName={'summary'}/>} />
                        <Legend />
                        <Bar dataKey="male" fill={props.labelColours['male']} />
                        <Bar dataKey="female" fill={props.labelColours['female']} />
                    </BarChart>
                </div>
            </MainPage>
        )
    } else {
        return (
            <MainPage visible={props.visible}>
                <div align='center'>
                    <br />
                    No results yet.
                </div>
            </MainPage>
        )
    }
    
}

export default ResultsDisplay;