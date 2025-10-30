import { useMemo, useState } from 'react';
import LogRow from './LogRow';
import './Logs.css';

function Logs() {
  const [warningLogs] = useState([
    {
      id: 'warn-1',
      level: 'warning',
      time: '2025-10-24 09:31:00',
      sortValue: '2025-10-24T09:31:00',
      eventType: 'Sensor',
      description: 'sensor_03 drift vượt ngưỡng 2.5%',
      actionLabel: 'Chi tiết sensor',
      actionVariant: 'positive'
    },
    {
      id: 'warn-2',
      level: 'warning',
      time: '2025-10-24 08:55:18',
      sortValue: '2025-10-24T08:55:18',
      eventType: 'Sensor',
      description: 'sensor_05 hiệu chuẩn đã hết hạn',
      actionLabel: 'Chi tiết sensor',
      actionVariant: 'positive'
    },
    {
      id: 'warn-3',
      level: 'warning',
      time: '2025-10-24 08:21:50',
      sortValue: '2025-10-24T08:21:50',
      eventType: 'Edge',
      description: 'edge_02 mất tín hiệu Wi-Fi',
      actionLabel: 'Chi tiết edge',
      actionVariant: 'positive'
    },
    {
      id: 'warn-4',
      level: 'warning',
      time: '2025-10-24 07:40:22',
      sortValue: '2025-10-24T07:40:22',
      eventType: 'Sensor',
      description: 'sensor_09 có dữ liệu lệch 1.8%',
      actionLabel: 'Chi tiết sensor',
      actionVariant: 'positive'
    }
  ]);

  const [infoLogs] = useState([
    {
      id: 'info-1',
      level: 'info',
      time: '2025-10-24 09:25:44',
      sortValue: '2025-10-24T09:25:44',
      eventType: 'Upload',
      description: 'Batch B2025102408 đã tải thành công',
      actionLabel: 'Xem batch',
      actionVariant: 'positive'
    },
    {
      id: 'info-2',
      level: 'info',
      time: '2025-10-24 09:10:00',
      sortValue: '2025-10-24T09:10:00',
      eventType: 'Edge',
      description: 'edge_01 heartbeat OK',
      actionLabel: '-',
      actionVariant: 'muted'
    },
    {
      id: 'info-3',
      level: 'info',
      time: '2025-10-24 08:31:31',
      sortValue: '2025-10-24T08:31:31',
      eventType: 'API',
      description: 'Token refreshed thành công',
      actionLabel: '-',
      actionVariant: 'muted'
    },
    {
      id: 'info-4',
      level: 'info',
      time: '2025-10-24 07:55:00',
      sortValue: '2025-10-24T07:55:00',
      eventType: 'System',
      description: 'Phiên kiểm tra bắt đầu',
      actionLabel: '-',
      actionVariant: 'muted'
    }
  ]);

  const [errorLogs] = useState([
    {
      id: 'error-1',
      level: 'error',
      time: '2025-10-24 09:20:12',
      sortValue: '2025-10-24T09:20:12',
      eventType: 'API',
      description: 'S3 PUT failed: thiếu metadata x-amz-meta-dek',
      actionLabel: 'Thử lại',
      actionVariant: 'danger'
    },
    {
      id: 'error-2',
      level: 'error',
      time: '2025-10-24 08:42:09',
      sortValue: '2025-10-24T08:42:09',
      eventType: 'Upload',
      description: 'Batch B2025102403 bị lỗi TSA',
      actionLabel: 'Thử lại',
      actionVariant: 'danger'
    },
    {
      id: 'error-3',
      level: 'error',
      time: '2025-10-24 08:11:12',
      sortValue: '2025-10-24T08:11:12',
      eventType: 'Upload',
      description: 'Batch B2025102402 không tạo Merkle được',
      actionLabel: 'Thử lại',
      actionVariant: 'danger'
    },
    {
      id: 'error-4',
      level: 'error',
      time: '2025-10-24 07:22:13',
      sortValue: '2025-10-24T07:22:13',
      eventType: 'API',
      description: 'Lỗi xác thực chữ ký tại batch B2025102401',
      actionLabel: 'Xem batch',
      actionVariant: 'positive'
    }
  ]);

  const [severityFilter, setSeverityFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const allLogs = useMemo(() => {
    const merged = [...warningLogs, ...infoLogs, ...errorLogs];
    merged.sort((a, b) => (a.sortValue < b.sortValue ? 1 : -1));
    return merged;
  }, [warningLogs, infoLogs, errorLogs]);

  const filteredLogs = useMemo(() => {
    const keywords = searchValue.trim().toLowerCase();

    return allLogs.filter((log) => {
      if (severityFilter !== 'all' && log.level !== severityFilter) {
        return false;
      }

      if (eventTypeFilter !== 'all' && log.eventType !== eventTypeFilter) {
        return false;
      }

      if (keywords.length === 0) {
        return true;
      }

      const haystack = `${log.description} ${log.eventType} ${log.actionLabel}`.toLowerCase();
      return haystack.includes(keywords);
    });
  }, [allLogs, eventTypeFilter, searchValue, severityFilter]);

  return (
    <div className='logs-section'>
      <h2 className='logs-title'>Nhật ký hệ thống</h2>

      <div className='logs-card'>
        <div className='logs-filter-bar'>
          <div className='filter-group'>
            <label htmlFor='severity-filter'>Mức độ log</label>
            <select
              id='severity-filter'
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
            >
              <option value='all'>Tất cả</option>
              <option value='warning'>Warning</option>
              <option value='info'>Info</option>
              <option value='error'>Error</option>
            </select>
          </div>

          <div className='filter-group'>
            <label htmlFor='event-type-filter'>Loại sự kiện</label>
            <select
              id='event-type-filter'
              value={eventTypeFilter}
              onChange={(event) => setEventTypeFilter(event.target.value)}
            >
              <option value='all'>Tất cả</option>
              <option value='Sensor'>Sensor</option>
              <option value='Upload'>Upload</option>
              <option value='API'>API</option>
              <option value='Edge'>Edge</option>
              <option value='System'>System</option>
            </select>
          </div>

          <div className='filter-group search-group'>
            <label htmlFor='log-search'>Tìm kiếm</label>
            <div className='search-input-wrapper'>
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
                <path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0' />
              </svg>
              <input
                id='log-search'
                type='text'
                placeholder='Tìm theo Batch ID hoặc Sensor ID'
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className='logs-table-wrapper'>
          <table className='logs-table'>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Mức độ</th>
                <th>Loại sự kiện</th>
                <th>Mô tả</th>
                <th>Liên kết</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <LogRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Logs;
