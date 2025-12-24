import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import EmissionTableRow from './EmissionTableRow';
import './Emission.css';

function Emission() {
  const [emissionEntries, SetEmissionEntries] = useState([]);
  const [allBatches, setAllBatches] = useState([]);

  const [numPage, setNumPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const [dateFilter, setDateFilter] = useState('today');
  const [searchValue, setSearchValue] = useState('');

  const getStatusFromRandStatus = (randStatus) => {
    if (randStatus === 2) return 'submitted';
    if (randStatus === 1) return 'review';
    return 'rejected';
  };

  const getDateRange = (filter) => {
    const now = new Date();
    let startDate, endDate;

    switch (filter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }

    return { startDate, endDate };
  };

  const filteredBatches = useMemo(() => {
    const { startDate, endDate } = getDateRange(dateFilter);
    return allBatches.filter(batch => {
      const batchDate = new Date(batch.windowStart);
      return batchDate >= startDate && batchDate < endDate;
    });
  }, [allBatches, dateFilter]);

  const fetchBatch = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/batches/get/?limit=10&page=${numPage}`);
      const data = await response.json();
      console.log('Fetched batch data:', data.data);
      setTotalData(data.total);
      SetEmissionEntries(data.data);
    } catch (error) {
      console.error('Error fetching batch data:', error);
    }
  };

  const fetchAllBatches = async () => {
    try {
      let fetchedBatches = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`http://localhost:3000/api/v1/batches/get/?limit=1000&page=${page}`);
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          fetchedBatches = [...fetchedBatches, ...result.data];
          if (fetchedBatches.length >= result.total) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      setAllBatches(fetchedBatches);
    } catch (error) {
      console.error('Error fetching all batches:', error);
    }
  };

  useEffect(() => {
    fetchBatch();
    fetchAllBatches();

    const interval = setInterval(() => {
      fetchBatch();
      fetchAllBatches();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // {
  //   id: 'B2025102401',
  //   timeRange: '00:00-01:00',
  //   device: 'sensor_01',
  //   tc02e: 1.23,
  //   dqi: 0.98,
  //   status: 'submitted',
  //   actionLabel: 'Xem ProofPack',
  //   actionVariant: 'link'
  // }

  const paginatedEntries = useMemo(() => {
    const keywords = searchValue.trim().toLowerCase();
    
    let filtered = filteredBatches;
    if (keywords.length > 0) {
      filtered = filteredBatches.filter((entry) => {
        const haystack = `${entry.batchId} ${entry.sensorId}`.toLowerCase();
        return haystack.includes(keywords);
      });
    }
    
    const startIndex = (numPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filtered.slice(startIndex, endIndex);
  }, [filteredBatches, searchValue, numPage]);

  const filteredTotalCount = useMemo(() => {
    const keywords = searchValue.trim().toLowerCase();
    
    if (keywords.length === 0) {
      return filteredBatches.length;
    }
    
    return filteredBatches.filter((entry) => {
      const haystack = `${entry.batchId} ${entry.sensorId}`.toLowerCase();
      return haystack.includes(keywords);
    }).length;
  }, [filteredBatches, searchValue]);

  const filteredEntries = useMemo(() => {
    const keywords = searchValue.trim().toLowerCase();
    const { startDate, endDate } = getDateRange(dateFilter);

    return emissionEntries.filter((entry) => {
      const entryDate = new Date(entry.windowStart);
      const inDateRange = entryDate >= startDate && entryDate < endDate;
      
      if (keywords.length === 0) {
        return inDateRange;
      }

      const haystack = `${entry.batchId} ${entry.sensorId}`.toLowerCase();
      return inDateRange && haystack.includes(keywords);
    });
  }, [emissionEntries, searchValue, dateFilter]);

  const emissionChartData = useMemo(() => {
    if (dateFilter === 'today' || dateFilter === 'yesterday') {
      const hourlyMap = {};
      for (let i = 0; i < 24; i++) {
        const hourKey = `${i.toString().padStart(2, '0')}h`;
        hourlyMap[hourKey] = 0;
      }
      
      filteredBatches.forEach(batch => {
        const batchDate = new Date(batch.windowStart);
        const hour = batchDate.getHours();
        const hourKey = `${hour.toString().padStart(2, '0')}h`;
        hourlyMap[hourKey] += batch.tco2e || 0;
      });
      
      return Object.entries(hourlyMap).map(([label, value]) => ({
        label,
        value: parseFloat(value.toFixed(4))
      }));
    } else if (dateFilter === 'thisMonth' || dateFilter === 'lastMonth') {
      const { startDate, endDate } = getDateRange(dateFilter);
      const daysInRange = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const dailyMap = {};
      
      for (let i = 1; i <= daysInRange; i++) {
        dailyMap[`${i}`] = 0;
      }
      
      filteredBatches.forEach(batch => {
        const batchDate = new Date(batch.windowStart);
        const day = batchDate.getDate().toString();
        if (dailyMap[day] !== undefined) {
          dailyMap[day] += batch.tco2e || 0;
        }
      });
      
      return Object.entries(dailyMap).map(([label, value]) => ({
        label: `${label}`,
        value: parseFloat(value.toFixed(4))
      }));
    } else {
      const monthlyMap = {};
      const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      
      for (let i = 0; i < 12; i++) {
        monthlyMap[monthNames[i]] = 0;
      }
      
      filteredBatches.forEach(batch => {
        const batchDate = new Date(batch.windowStart);
        const month = monthNames[batchDate.getMonth()];
        monthlyMap[month] += batch.tco2e || 0;
      });
      
      return Object.entries(monthlyMap).map(([label, value]) => ({
        label,
        value: parseFloat(value.toFixed(4))
      }));
    }
  }, [filteredBatches, dateFilter]);

  const emissionByDeviceData = useMemo(() => {
    const deviceMap = {
      'sensor_01': 0,
      'sensor_02': 0,
      'sensor_03': 0
    };
    
    filteredBatches.forEach(batch => {
      const device = batch.sensorId;
      if (!deviceMap[device]) {
        deviceMap[device] = 0;
      }
      deviceMap[device] += batch.tco2e || 0;
    });
    
    return Object.entries(deviceMap).map(([device, value]) => ({
      device,
      value: parseFloat(value.toFixed(4))
    })).sort((a, b) => b.value - a.value);
  }, [filteredBatches]);

  const sidebarStats = useMemo(() => {
    const totalEmissions = filteredBatches.reduce((sum, batch) => sum + (batch.tco2e || 0), 0);
    const avgDqi = filteredBatches.length > 0 
      ? filteredBatches.reduce((sum, batch) => sum + (batch.dqi || 0), 0) / filteredBatches.length 
      : 0;
    
    const submittedCount = filteredBatches.filter(b => b.randStatus === 2).length;
    const reviewCount = filteredBatches.filter(b => b.randStatus === 1).length;
    const rejectedCount = filteredBatches.filter(b => b.randStatus === 0).length;
    const totalBatches = filteredBatches.length;

    return {
      totalEmissions: totalEmissions.toFixed(2),
      avgDqi: avgDqi.toFixed(2),
      submittedCount,
      reviewCount,
      rejectedCount,
      totalBatches
    };
  }, [filteredBatches]);

  const getSidebarLabel = () => {
    switch (dateFilter) {
      case 'today': return 'hôm nay';
      case 'yesterday': return 'hôm qua';
      case 'thisMonth': return 'tháng này';
      case 'lastMonth': return 'tháng trước';
      case 'thisYear': return 'năm nay';
      default: return 'hôm nay';
    }
  };

  const getChartTitle = () => {
    switch (dateFilter) {
      case 'today':
      case 'yesterday':
        return 'Tổng phát thải CO2 theo giờ';
      case 'thisMonth':
      case 'lastMonth':
        return 'Tổng phát thải CO2 theo ngày';
      case 'thisYear':
        return 'Tổng phát thải CO2 theo tháng';
      default:
        return 'Tổng phát thải CO2 theo giờ';
    }
  };

  const handlePreviousPage = () => {
    if (numPage > 1) {
      setNumPage(numPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredTotalCount / 10);
    if (numPage < totalPages) {
      setNumPage(numPage + 1);
    }
  };

  useEffect(() => {
    setNumPage(1);
  }, [dateFilter, searchValue]);

  return (
    <div className='emission-section'>
      <div className='emission-header'>
        <div>
          <h2>Lượng phát thải</h2>
          <p>Theo dõi và quản lý dữ liệu phát thải CO2e</p>
        </div>
      </div>

      <div className='emission-toolbar'>
        <div className='toolbar-left'>
          <label htmlFor='date-filter'>Chọn ngày</label>
          <select id='date-filter' value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
            <option value='today'>Hôm nay</option>
            <option value='yesterday'>Hôm qua</option>
            <option value='thisMonth'>Tháng này</option>
            <option value='lastMonth'>Tháng trước</option>
            <option value='thisYear'>Năm nay</option>
          </select>
        </div>

        <div className='toolbar-right'>
          <input
            type='text'
            placeholder='Batch ID hoặc Thiết bị'
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
      </div>

      <div className='emission-content'>
        <div className='emission-main'>
          <div className='emission-charts'>
            <div className='chart-card'>
              <div className='chart-header'>
                <h4>{getChartTitle()}</h4>
                <span className='legend'>
                  <span className='legend-dot green' />
                  Phát thải CO2
                </span>
              </div>
              <div className='chart-body'>
                <ResponsiveContainer width='100%' height={200}>
                  <LineChart data={emissionChartData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='label' />
                    <YAxis />
                    <Tooltip />
                    <Line type='monotone' dataKey='value' stroke='#22c55e' strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='chart-card'>
              <div className='chart-header'>
                <h4>Phát thải theo thiết bị</h4>
                <span className='legend'>
                  <span className='legend-dot blue' />
                  Phát thải
                </span>
              </div>
              <div className='chart-body'>
                <ResponsiveContainer width='100%' height={200}>
                  <BarChart data={emissionByDeviceData} barSize={60} >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='device' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='value' fill='#2563eb' radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className='emission-table-card'>
            <div className='table-header'>
              <h3>Bảng dữ liệu phát thải</h3>
              <div className='page-indicator'>{numPage} / {Math.max(1, Math.ceil(filteredTotalCount / 10))}</div>
              <div className='nav-buttons'>
                <button className='nav-btn' onClick={handlePreviousPage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                  </svg>
                </button>
                <button className='nav-btn' onClick={handleNextPage}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
                </button>
              </div>
            </div>
            <div className='table-wrapper'>
              <table className='emission-table'>
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Ngày</th>
                    <th>Khoảng thời gian</th>
                    <th>Thiết bị</th>
                    <th>tCO2e</th>
                    <th>DQI</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((entry) => (
                    <EmissionTableRow key={entry.batchId} entry={entry} status={getStatusFromRandStatus(entry.randStatus)} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className='emission-sidebar'>
          <div className='sidebar-card highlight'>
            <span className='sidebar-label'>Tổng phát thải {getSidebarLabel()}</span>
            <h3>{sidebarStats.totalEmissions} tCO2e</h3>
          </div>
          <div className='sidebar-card'>
            <span className='sidebar-label'>DQI trung bình</span>
            <h3>{sidebarStats.avgDqi}</h3>
          </div>
          <div className='sidebar-card'>
            <span className='sidebar-label'>Batch đã nộp / Tổng</span>
            <h3>{sidebarStats.submittedCount} / {sidebarStats.totalBatches}</h3>
          </div>
          <div className='sidebar-card status-summary'>
            <h4>Phân tích trạng thái</h4>
            <ul>
              <li>
                <span>Đã nộp</span>
                <strong>{sidebarStats.submittedCount}</strong>
              </li>
              <li>
                <span>Cho kiểm tra</span>
                <strong>{sidebarStats.reviewCount}</strong>
              </li>
              <li>
                <span>Bị từ chối</span>
                <strong>{sidebarStats.rejectedCount}</strong>
              </li>
            </ul>
          </div>

          <div className='sidebar-card quick-actions'>
            <h4>Hành động nhanh</h4>
            <button type='button' className='primary'>
              Xuất báo cáo
            </button>
            <button type='button' className='secondary'>
              Đồng bộ dữ liệu
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Emission;
