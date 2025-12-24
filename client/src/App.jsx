import { useState, useEffect } from 'react'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './components/sections/Overview';
import Devices from './components/sections/Devices';
import Emission from './components/sections/Emission';
import Logs from './components/sections/Logs';
import './App.css'

const validTabs = ['overview', 'devices', 'emission', 'logs'];

const getTabFromHash = () => {
  const hash = window.location.hash.replace('#', '');
  return validTabs.includes(hash) ? hash : 'overview';
};

function App() {

  const [tab, setTab] = useState(getTabFromHash);
  // overview, devices, emissions, logs

  useEffect(() => {
    window.location.hash = tab;
  }, [tab]);

  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getTabFromHash();
      setTab(newTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <div className='layout'>
        <Header companyName={"Site: Hanoi University of Science and Technology"} />
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
