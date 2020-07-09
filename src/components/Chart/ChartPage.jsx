import React, { useEffect, useState } from 'react';
import BarChart from '../../charts/d3';

const datas = [
    [10, 30, 40, 20],
    [10, 40, 30, 20, 50, 10],
    [60, 30, 40, 20, 30]
]
var i = 0;

function Chart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        changeData();
    }, []);

    const changeData = () => {
        setData(datas[i++]);
        if(i === datas.length) i = 0;
    }


    return (
        <div className="ch">
            <h2>D3 Graphs with React</h2>
            <button onClick={changeData}>Change Data</button>
            <BarChart width={600} height={400} data={data} />
        </div>
    );
}

export default Chart;