import React from 'react';
import { BarChart, Bar, Legend, Tooltip, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';

import MainPage from './MainPage';

const ResultsDisplay = (props) => {
    const data1 = [
        {
          name: '', male: 54, female: 40,
        }]
    const data2 = [
        {
            time: 1.25, male: -1, female: 0
        },
        {
            time: 1.5, male: -3, female: 0
        },
        {
            time: 1.75, male: -3, female: 0
        },
        {
            time: 2, male: 0, female: 0,
        },
        {
            time: 3, male: -1, female: 1,
        },
        {
            time: 4, male: -1, female: 2,
        },
        {
            time: 5, male: -2, female: 0,
        }]
    return (
        <MainPage visible={props.visible}>
            <div align='center'>
                <BarChart width={730} height={250} data={data1}>
                <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(label) => `${label}%`}/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="male" fill="#0000ff" />
                    <Bar dataKey="female" fill="#ff1493" />
                </BarChart>
                <br />
                <br />
                <br />
                <BarChart
                    width={730}
                    height={250}
                    data={data2}
                    stackOffset="sign"
                    barCategoryGap={0}>
                <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis tickFormatter={(label) => Math.abs(label)}/>
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={0} stroke="#000" />
                    <Bar dataKey="male" fill="#0000ff" stackId="stack" />
                    <Bar dataKey="female" fill="#ff1493" stackId="stack" />
                </BarChart>
            </div>
        </MainPage>
    )
}

export default ResultsDisplay;