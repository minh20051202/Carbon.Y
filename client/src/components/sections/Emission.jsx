import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import EmissionTableRow from './EmissionTableRow';
import './Emission.css';

function Emission() {
  const [emissionEntries] = useState([
    {
      id: 'B2025102401',
      timeRange: '00:00-01:00',
      device: 'sensor_01',
      tc02e: 1.23,
      dqi: 0.98,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    },
    {
      id: 'B2025102402',
      timeRange: '01:00-02:00',
      device: 'sensor_03',
      tc02e: 2.01,
      dqi: 0.91,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    },
    {
      id: 'B2025102403',
      timeRange: '02:00-03:00',
      device: 'sensor_03',
      tc02e: 1.75,
      dqi: 0.78,
      status: 'rejected',
      actionLabel: 'Tải lại',
      actionVariant: 'danger'
    },
    {
      id: 'B2025102404',
      timeRange: '03:00-04:00',
      device: 'sensor_01',
      tc02e: 3.22,
      dqi: 0.85,
      status: 'review',
      actionLabel: 'Đang xử lý',
      actionVariant: 'muted'
    },
    {
      id: 'B2025102405',
      timeRange: '04:00-05:00',
      device: 'sensor_06',
      tc02e: 0.95,
      dqi: 0.93,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    },
    {
      id: 'B2025102406',
      timeRange: '05:00-06:00',
      device: 'sensor_06',
      tc02e: 1.10,
      dqi: 0.88,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    },
    {
      id: 'B2025102407',
      timeRange: '06:00-07:00',
      device: 'sensor_09',
      tc02e: 1.95,
      dqi: 0.82,
      status: 'rejected',
      actionLabel: 'Tải lại',
      actionVariant: 'danger'
    },
    {
      id: 'B2025102408',
      timeRange: '07:00-08:00',
      device: 'sensor_01',
      tc02e: 1.45,
      dqi: 0.87,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    },
    {
      id: 'B2025102409',
      timeRange: '08:00-09:00',
      device: 'sensor_06',
      tc02e: 2.45,
      dqi: 0.89,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    },
    {
      id: 'B2025102410',
      timeRange: '09:00-10:00',
      device: 'sensor_01',
      tc02e: 1.23,
      dqi: 0.76,
      status: 'review',
      actionLabel: 'Đang xử lý',
      actionVariant: 'muted'
    },
    {
      id: 'B2025102411',
      timeRange: '10:00-11:00',
      device: 'sensor_03',
      tc02e: 2.33,
      dqi: 0.99,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    },
    {
      id: 'B2025102412',
      timeRange: '11:00-12:00',
      device: 'sensor_09',
      tc02e: 2.00,
      dqi: 0.87,
      status: 'submitted',
      actionLabel: 'Xem ProofPack',
      actionVariant: 'link'
    }
  ]);

  const [dateFilter, setDateFilter] = useState('today');
  const [searchValue, setSearchValue] = useState('');

  const filteredEntries = useMemo(() => {
    const keywords = searchValue.trim().toLowerCase();

    return emissionEntries.filter((entry) => {
      if (keywords.length === 0) {
        return true;
      }

      const haystack = `${entry.id} ${entry.device}`.toLowerCase();
      return haystack.includes(keywords);
    });
  }, [emissionEntries, searchValue]);

  const hourlyEmissionData = useMemo(
    () => [
      { hour: '00h', value: 1.2 },
      { hour: '01h', value: 1.5 },
      { hour: '02h', value: 2.4 },
      { hour: '03h', value: 1.9 },
      { hour: '04h', value: 2.7 },
      { hour: '05h', value: 1.6 },
      { hour: '06h', value: 2.2 },
      { hour: '07h', value: 2.0 },
      { hour: '08h', value: 1.4 },
      { hour: '09h', value: 1.9 },
      { hour: '10h', value: 2.1 },
      { hour: '11h', value: 1.8 },
      { hour: '12h', value: 2.5 }
    ],
    []
  );

  const emissionByDeviceData = useMemo(
    () => [
      { device: 'sensor_01', value: 3.8 },
      { device: 'sensor_03', value: 3.1 },
      { device: 'sensor_06', value: 2.7 },
      { device: 'sensor_09', value: 2.2 }
    ],
    []
  );

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
            <option value='custom'>Tùy chỉnh...</option>
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
                <h4>Tổng phát thải CO2 theo giờ</h4>
                <span className='legend'>
                  <span className='legend-dot green' />
                  Phát thải CO2
                </span>
              </div>
              <div className='chart-body'>
                <ResponsiveContainer width='100%' height={200}>
                  <LineChart data={hourlyEmissionData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='hour' />
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
            </div>
            <div className='table-wrapper'>
              <table className='emission-table'>
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Khoảng thời gian</th>
                    <th>Thiết bị</th>
                    <th>tCO2e</th>
                    <th>DQI</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <EmissionTableRow key={entry.id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className='emission-sidebar'>
          <div className='sidebar-card highlight'>
            <span className='sidebar-label'>Tổng phát thải hôm nay</span>
            <h3>21.51 tCO2e</h3>
          </div>
          <div className='sidebar-card'>
            <span className='sidebar-label'>DQI trung bình</span>
            <h3>0.87</h3>
          </div>
          <div className='sidebar-card'>
            <span className='sidebar-label'>Batch đã nộp / Tổng</span>
            <h3>8 / 12</h3>
          </div>
          <div className='sidebar-card status-summary'>
            <h4>Phân tích trạng thái</h4>
            <ul>
              <li>
                <span>Đã nộp</span>
                <strong>8</strong>
              </li>
              <li>
                <span>Cho kiểm tra</span>
                <strong>2</strong>
              </li>
              <li>
                <span>Bị từ chối</span>
                <strong>2</strong>
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
