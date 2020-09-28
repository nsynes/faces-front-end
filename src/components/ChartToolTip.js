import React from 'react';

const ChartToolTip = (props) => {
    
    if ( props.active ) {
        if ( props.chartName === 'timeseries') {
            return (
                <div style={{textAlign: 'left', backgroundColor: 'white', border: '1px solid rgb(200,200,200)', padding: '.25em'}}>
                  <p>Time: {new Date(props.label * 1000).toISOString().substr(14, 5)}</p>
                  <p style={{color: props.payload[1].fill}}>{props.payload[1].name}s: {`${Math.abs(props.payload[1].value)}`}</p>
                  <p style={{color: props.payload[0].fill}}>{props.payload[0].name}s: {`${Math.abs(props.payload[0].value)}`}</p>
                </div>
            );
        }
        else if ( props.chartName === 'summary') {
            return (
                <div style={{textAlign: 'left', backgroundColor: 'white', border: '1px solid rgb(200,200,200)', padding: '.25em'}}>
                  <p style={{color: props.payload[1].fill}}>{props.payload[1].name}: {`${Math.round(props.payload[1].value * 10) / 10}`}%</p>
                  <p style={{color: props.payload[0].fill}}>{props.payload[0].name}: {`${Math.round(props.payload[0].value * 10) / 10}`}%</p>
                </div>
            );
        }
    }
    return null;
}

export default ChartToolTip;