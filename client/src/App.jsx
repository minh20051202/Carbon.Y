import { useState } from 'react'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './components/sections/Overview';
import Devices from './components/sections/Devices';
import Emission from './components/sections/Emission';
import Logs from './components/sections/Logs';
import './App.css'

function App() {

  const [tab, setTab] = useState('overview');
  // overview, devices, emissions, logs

  return (
    <>
      <div className='layout'>
        <Header companyName={"Site ABC - Manufacturing"} />
        <Sidebar tab={tab} setTab={setTab} />
        <div className="main-content">
          {tab === "overview" && <Overview />}
          {tab === "devices" && <Devices />}
          {tab === "emission" && <Emission />}
          {tab === "logs" && <Logs />}
        </div>
      </div>
    </>
  )
}

export default App
