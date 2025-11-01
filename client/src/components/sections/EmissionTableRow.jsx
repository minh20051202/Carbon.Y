const statusLabelMap = {
  submitted: { label: 'Đã nộp', className: 'status-pill submitted' },
  review: { label: 'Chờ kiểm tra', className: 'status-pill review' },
  rejected: { label: 'Bị từ chối', className: 'status-pill rejected' }
};

function EmissionTableRow({ entry }) {
  const statusConfig = statusLabelMap[entry.status] ?? statusLabelMap.submitted;

  return (
    <tr className={`emission-row ${entry.status}`}>
      <td>{entry.id}</td>
      <td>{entry.timeRange}</td>
      <td>{entry.device}</td>
      <td>{entry.tc02e.toFixed(2)}</td>
      <td>{entry.dqi.toFixed(2)}</td>
      <td>
        <span className={statusConfig.className}>{statusConfig.label}</span>
      </td>
      <td>
        {entry.actionVariant === 'link' ? (
          <button type='button' className='link-action'>
            {entry.actionLabel}
          </button>
        ) : entry.actionVariant === 'danger' ? (
          <button type='button' className='danger-action'>
            {entry.actionLabel}
          </button>
        ) : (
          <span className='muted-action'>{entry.actionLabel}</span>
        )}
      </td>
    </tr>
  );
}

export default EmissionTableRow;
