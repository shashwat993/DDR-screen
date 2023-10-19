import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';


function getCurrentDateTimeFormatted() {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');

  const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

const DRRScreen = () => {
  const formattedDateTime = getCurrentDateTimeFormatted();

  const [tuples, setTuples] = useState([]);
  const [tupleIdCounter, setTupleIdCounter] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [excludedDates, setExcludedDates] = useState([]);
  const [leadCount, setLeadCount] = useState(0);
  const [expectedDDR, setExpectedDDR] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(formattedDateTime);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateNumberOfDays = (start, end, excludedDates) => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    let numberOfDays = 0;

    for (let currentDate = startTime; currentDate <= endTime; currentDate += 24 * 60 * 60 * 1000) {
      const currentDateObj = new Date(currentDate);
      const currentDateStr = formatDate(currentDateObj);
      if (!excludedDates.some((date) => formatDate(date) === currentDateStr)) {
        numberOfDays++;
      }
    }

    return numberOfDays;
  };

  const handleCancle =()=>{
    setStartDate(new Date());
    setEndDate(new Date());
    setExcludedDates([]);
    setLeadCount(0);
    setExpectedDDR(0);
    setLastUpdate('');
    setCurrentDateTime(new Date().toLocaleString());

  }

  const addTuple = () => {
    const newTuple = {
      id: tupleIdCounter,
      startDate,
      endDate,
      excludedDates: [...excludedDates], // Clone the excludedDates array
      leadCount,
      expectedDDR,
      lastUpdate: currentDateTime,
    };
    setTuples([newTuple, ...tuples]);
    setTupleIdCounter(tupleIdCounter + 1);
    setStartDate(new Date());
    setEndDate(new Date());
    setExcludedDates([]);
    setLeadCount(0);
    setExpectedDDR(0);
    setLastUpdate('');
    setCurrentDateTime(new Date().toLocaleString());
  };

  const handleExcludeDate = (date) => {
    if (date >= startDate && date <= endDate) {
      if (!excludedDates.some((d) => formatDate(d) === formatDate(date))) {
        setExcludedDates([...excludedDates, date]);
      }
    }
  };

  return (
    <div >
      <table>
        <thead>
          <tr>
          
            <th className='col-sm-0'>Action</th>
            <th className='col-sm-1'>ID</th>
            <th className='col-sm-2'>Start Date</th>
            <th className='col-sm-2'>End Date</th>
            <th className='col-sm-1'>Month/Year</th>
            <th className='col-sm-2'>Date Excluded</th>
            <th className='col-sm-1'>Number of Days</th>
            <th className='col-sm-1'>Lead Count</th>
            <th className='col-sm-1'>Expected DDR</th>
            <th className='col-sm-1'>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='col-sm-0'>N/A</td>
            <td className='col-sm-1'>{tupleIdCounter}</td>
            <td className='col-sm-2'>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className='input-date' />
            </td>
            <td className='col-sm-2'>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className='input-date' />
            </td>
            <td className='col-sm-1'>
              {endDate.toLocaleString('default', { month: 'long' })}/{endDate.getFullYear()}
            </td>
            <td className='col-sm-2'>
              <DatePicker
                selected={null}
                onChange={(date) => handleExcludeDate(date)}
                minDate={startDate}
                maxDate={endDate}
                className='input-date'
                
              />
              <div>{excludedDates.map((date) => formatDate(date)).join(', ')}</div>
            </td >
            <td className='col-sm-1'>{calculateNumberOfDays(startDate, endDate, excludedDates)}</td>
            <td className='col-sm-1'>
              <input type="number" value={leadCount} onChange={(e) => setLeadCount(e.target.value)} className="input-field" />
            </td>
            <td className='col-sm-1'>
              <input
                type="number"
                value={expectedDDR}
                onChange={(e) => setExpectedDDR(e.target.value)}
                className="input-field" 
              />
            </td>
            <td className='col-sm-1'>

              <button onClick={addTuple} className='btn btn-info m-1' >Save</button>
              <button onClick={handleCancle} className='btn btn-danger m-1' >Cancel</button>
            </td>
          </tr>
          {tuples.map((tuple) => (
            <tr key={tuple.id}>
              <td className='col-lg-0' >SAVE</td>
              <td className='col-lg-1'>{tuple.id}</td>
              <td className='col-lg-2'>{formatDate(tuple.startDate)}</td>
              <td className='col-lg-2'>{formatDate(tuple.endDate)}</td>
              <td className='col-lg-1'>{tuple.endDate.toLocaleString('default', { month: 'long' })}/{tuple.endDate.getFullYear()}</td>
              <td className='col-lg-2' >{tuple.excludedDates.map((date) => formatDate(date)).join(', ')}</td>
              <td className='col-lg-1'>{calculateNumberOfDays(tuple.startDate, tuple.endDate, tuple.excludedDates)}</td>
              <td className='col-lg-1'>{tuple.leadCount}</td>
              <td className='col-lg-1'>{tuple.expectedDDR}</td>
              <td className='col-lg-1'>{tuple.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DRRScreen;