const statusLabelMap = {
  submitted: { label: 'Đã nộp', className: 'status-pill submitted' },
  review: { label: 'Chờ kiểm tra', className: 'status-pill review' },
  rejected: { label: 'Bị từ chối', className: 'status-pill rejected' }
};

function EmissionTableRow({ entry, status}) {

  return (
    <tr className={`emission-row ${entry.status}`}>
      <td>{entry.batchId}</td>
      <td>{entry.windowStart.slice(0, 10)}</td>
      <td>{entry.windowStart.slice(11, 16) + " - " + entry.windowEnd.slice(11, 16)}</td>
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
