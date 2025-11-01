import { useMemo, useState } from 'react';
import DeviceRow from './DeviceRow';
import './Devices.css';

function Devices() {
  const [sensorDevices] = useState([
    {
      id: 'sensor-01',
      name: 'sensor_01',
      type: 'CO2 Sensor',
      status: 'active',
      lastActiveTime: '09:32:12',
      lastActiveDate: '24/10/2025',
      calibration: 'OK',
      calibrationVariant: 'success',
      alert: '--',
      alertVariant: 'muted'
    },
    {
      id: 'sensor-03',
      name: 'sensor_03',
      type: 'CO2 Sensor',
      status: 'active',
      lastActiveTime: '09:30:11',
      lastActiveDate: '24/10/2025',
      calibration: 'OK',
      calibrationVariant: 'success',
      alert: '--',
      alertVariant: 'muted'
    },
    {
      id: 'sensor-05',
      name: 'sensor_05',
      type: 'CO2 Sensor',
      status: 'warning',
      lastActiveTime: '09:22:03',
      lastActiveDate: '24/10/2025',
      calibration: 'Sắp hết (26/10)',
      calibrationVariant: 'warning',
      alert: 'Lệch 3 phút',
      alertVariant: 'warning'
    },
    {
      id: 'sensor-07',
      name: 'sensor_07',
      type: 'CO2 Sensor',
      status: 'warning',
      lastActiveTime: '09:15:22',
      lastActiveDate: '24/10/2025',
      calibration: 'Hết hạn',
      calibrationVariant: 'danger',
      alert: 'Chưa upload batch B42',
      alertVariant: 'danger'
    }
  ]);

  const [edgeDevices] = useState([
    {
      id: 'edge-02',
      name: 'edge_02',
      type: 'Edge Agent',
      status: 'offline',
      lastActiveTime: '08:45:11',
      lastActiveDate: '24/10/2025',
      calibration: '--',
      calibrationVariant: 'muted',
      alert: 'Không gửi dữ liệu từ 5h sáng',
      alertVariant: 'danger'
    },
    {
      id: 'edge-03',
      name: 'edge_03',
      type: 'Edge Agent',
      status: 'active',
      lastActiveTime: '09:34:55',
      lastActiveDate: '24/10/2025',
      calibration: '--',
      calibrationVariant: 'muted',
      alert: '--',
      alertVariant: 'muted'
    }
  ]);

  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const allDevices = useMemo(() => [...sensorDevices, ...edgeDevices], [sensorDevices, edgeDevices]);

  const filteredDevices = useMemo(() => {
    const keywords = searchValue.trim().toLowerCase();

    return allDevices.filter((device) => {
      if (deviceTypeFilter !== 'all') {
        if (deviceTypeFilter === 'sensor' && device.type !== 'CO2 Sensor') {
          return false;
        }

        if (deviceTypeFilter === 'edge' && device.type !== 'Edge Agent') {
          return false;
        }
      }

      if (statusFilter !== 'all' && device.status !== statusFilter) {
        return false;
      }

      if (keywords.length === 0) {
        return true;
      }

      const haystack = `${device.name} ${device.type}`.toLowerCase();
      return haystack.includes(keywords);
    });
  }, [allDevices, deviceTypeFilter, searchValue, statusFilter]);

  return (
    <>
      <div className='page-header'>
        <h2 className='device-title'>Thiết bị</h2>
        <div>Quản lý và giám sát các thiết bị trong hệ thống</div>
      </div>
      <div className='devices-section'>
        <div className='devices-card'>
          <div className='devices-filter-bar'>
            <div className='filter-group'>
              <label htmlFor='device-type-filter'>Loại thiết bị</label>
              <select id='device-type-filter' value={deviceTypeFilter} onChange={(event) => setDeviceTypeFilter(event.target.value)}>
                <option value='all'>Tất cả</option>
                <option value='sensor'>CO2 Sensor</option>
                <option value='edge'>Edge Agent</option>
              </select>
            </div>

            <div className='filter-group status-filter'>
              <label>Trạng thái</label>
              <div className='status-tabs'>
                <button type='button' className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>
                  Tất cả
                </button>
                <button type='button' className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>
                  Đang hoạt động
                </button>
                <button type='button' className={statusFilter === 'offline' ? 'active' : ''} onClick={() => setStatusFilter('offline')}>
                  Mất kết nối
                </button>
                <button type='button' className={statusFilter === 'warning' ? 'active' : ''} onClick={() => setStatusFilter('warning')}>
                  Cảnh báo
                </button>
              </div>
            </div>

            <div className='filter-group search-group'>
              <label htmlFor='device-search'>Tìm kiếm</label>
              <div className='search-input-wrapper'>
                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                  <path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0' />
                </svg>
                <input
                  id='device-search'
                  type='text'
                  placeholder='Tìm theo tên thiết bị...'
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className='devices-table-wrapper'>
            <table className='devices-table'>
              <thead>
                <tr>
                  <th>Thiết bị</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>Lần hoạt động cuối</th>
                  <th>Hiệu chuẩn</th>
                  <th>Cảnh báo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <DeviceRow key={device.id} device={device} />
                ))}
              </tbody>
            </table>
          </div>

          <div className='devices-footer'>
            <span>Hiện thị 1-6 trong tổng số 6 thiết bị</span>
            <div className='devices-pagination'>
              <button type='button' disabled>
                &lt; Trước
              </button>
              <button type='button' disabled>
                Sau &gt;
              </button>
            </div>
          </div>
        </div>

        <div className='devices-actions'>
          <button type='button' className='add-device'>
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
              <path d='M8 1a.5.5 0 0 1 .5.5v6h6a.5.5 0 0 1 0 1h-6v6a.5.5 0 0 1-1 0v-6h-6a.5.5 0 0 1 0-1h6v-6A.5.5 0 0 1 8 1' />
            </svg>
            Thêm thiết bị
          </button>
          <button type='button' className='export-devices'>
            Xuất danh sách .csv
          </button>
        </div>
      </div>
    </>
  );
}

export default Devices;
