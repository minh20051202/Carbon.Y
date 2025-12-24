const statusLabelMap = {
  submitted: { label: 'Đã nộp', className: 'status-pill submitted' },
  review: { label: 'Chờ kiểm tra', className: 'status-pill review' },
  rejected: { label: 'Bị từ chối', className: 'status-pill rejected' }
};

const formatTimeToGMT7 = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  });
};

const formatDateToGMT7 = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
};

function EmissionTableRow({ entry, status}) {

  return (
    <tr className={`emission-row ${entry.status}`}>
      <td>{entry.batchId}</td>
      <td>{formatDateToGMT7(entry.windowStart)}</td>
      <td>{formatTimeToGMT7(entry.windowStart) + " - " + formatTimeToGMT7(entry.windowEnd)}</td>
      <td>{entry.sensorId}</td>
      <td>{(entry.tco2e * 10).toFixed(3)}</td>
      <td>{entry.dqi.toFixed(2)}</td>
      <td>
        <span className={statusLabelMap[status].className}>{statusLabelMap[status].label}</span>
      </td>
      <td>
        {status === 'submitted' ? (
          <button type='button' className='link-action'>Xem ProofPack</button>
        ) : status === 'rejected' ? (
          <button type='button' className='danger-action'>
            Tải lại
          </button>
        ) : (
          <span className='muted-action'>Đang xử lý</span>
        )}
      </td>
    </tr>
  );
}

export default EmissionTableRow;
