import React, { useEffect, useState} from 'react';
import "./App.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
function App() {

  // Calendar 
  const [calendar, setCalendar] = useState(new Date());

  const [countTSP, setCountTSP] = React.useState(null);
  const [CountTSPByPOPI, setCountTSPByPOPI] = React.useState(null);

  const [allDepot, setAllDepot] = useState([]);
  const [depot, setDepot] = useState(null);
  const [allRoutesByDepot, setAllRoutesByDepot] = useState([]);
  const [route, setRoute] = useState(null);

  const fetchCountTSP = () => {
    fetch("/countTSP")
    .then((res) => res.json())
    .then((data) => {    
      setCountTSP(data[0].enabled);
      // console.log(data);
    });
  }

  // fetch count with & without TSP
  const fetchCountTSPByPOPI = () => {
    fetch("/countTSPByPOPI",{
      route : route,
      depot : depot
    }
    )
    .then((res) => res.json())
    .then((data) => {
      setCountTSPByPOPI(data);
      console.log(data);
    });
  }  

  const fetchAllRoutesByDepot = () => {
    fetch("/fetchAllRoutesByDepot",{
      depot : depot
    }
    )
    .then((res) => res.json())
    .then((data) => {
      setAllRoutesByDepot(data);
      console.log(data);
    });
  }
  
  const depotSelect = (depot) => {
                return <option value={depot}>{depot}</option>;
  };


  // re-render data 
  useEffect(() => {
  }, [countTSP, CountTSPByPOPI])

  useEffect((value, initialValue) => {
    console.log(value, initialValue)
    
  }, [calendar]);

    
  // Fetch all depots
  useEffect(() => {
    fetch("/allDepot")
    .then((res) => res.json())
    .then((data) => {    
      console.log(data);
    });
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h2 className='countTSP'># of TSP enabled Buses:   <span className='green'>{countTSP? " " + countTSP : ""}</span></h2>
        <div className='calendar'><Calendar onChange={setCalendar} value={calendar}/></div>
        <button onClick={fetchCountTSP}>countTSP</button>
        <button onClick={fetchCountTSPByPOPI}>countTSPByPOPI</button>
        <button onClick={setAllDepot}>AllDepot</button>
      </header>
      {allDepot?
      <select id="selectDepot" onchange={setDepot}>
        {
          allDepot.map(depotSelect)
        }
      </select> : <></>}

    </div>
  );
}

export default App;