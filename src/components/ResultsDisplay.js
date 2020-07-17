import React from 'react';
import moment from 'moment';
import { BarChart, Bar, Legend, Tooltip, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';

import MainPage from './MainPage';
import ChartToolTip from './ChartToolTip';

const ResultsDisplay = (props) => {

    const { allFaceGroups, groupClassification, checksPerSecond } = props;
    var maleTotal = 0, femaleTotal = 0;
    var timeseries = [];
    var mCount, fCount;
    for ( var i = 0; i < allFaceGroups.length; i++ ) {
        if ( allFaceGroups[i] ) {
            mCount=0;
            fCount=0;
            for ( var j = 0; j < allFaceGroups[i].length; j++ ) {
                if ( groupClassification[allFaceGroups[i][j]] === 'male' ) {
                    maleTotal += 1/checksPerSecond;
                    mCount -= 1
                }
                else if ( groupClassification[allFaceGroups[i][j]] === 'female' ) {
                    femaleTotal += 1/checksPerSecond;
                    fCount += 1;
                }
            }
            timeseries.push({time: i/checksPerSecond, male: mCount, female: fCount})
        }
    }
    const malePercent = maleTotal/(maleTotal+femaleTotal)*100;
    const femalePercent = femaleTotal/(maleTotal+femaleTotal)*100;
    
    if ( allFaceGroups && allFaceGroups.length > 0 ) {
        return (
            <MainPage visible={props.visible}>
                <div align='center'>
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
                    No results yet...
                </div>
            </MainPage>
        )
    }
    
}

export default ResultsDisplay;