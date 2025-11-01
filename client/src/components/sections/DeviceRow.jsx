const statusLabelMap = {
  active: { label: 'Hoạt động', className: 'status-pill active' },
  offline: { label: 'Mất kết nối', className: 'status-pill offline' },
  warning: { label: 'Cảnh báo', className: 'status-pill warning' }
};

function DeviceRow({ device }) {
  const statusConfig = statusLabelMap[device.status] ?? statusLabelMap.active;

  return (
    <tr className={`device-row ${device.status}`}>
      <td>
        <div className='device-name'>
          <span className={`status-dot ${device.status}`} />
          {device.name}
        </div>
      </td>
      <td>{device.type}</td>
      <td>
        <span className={statusConfig.className}>{statusConfig.label}</span>
      </td>
      <td>
        <div className='device-last-active'>
          <span>{device.lastActiveTime}</span>
          <small>{device.lastActiveDate}</small>
        </div>
      </td>
      <td>
        <span className={`device-chip ${device.calibrationVariant}`}>{device.calibration}</span>
      </td>
      <td>
        <span className={`device-chip ${device.alertVariant}`}>{device.alert}</span>
      </td>
      <td>
        <div className='device-actions'>
          <button type='button' className='detail'>
            Xem chi tiết
          </button>
          <button type='button' className='disable'>
            Vô hiệu hóa
          </button>
        </div>
      </td>
    </tr>
  );
}

export default DeviceRow;
