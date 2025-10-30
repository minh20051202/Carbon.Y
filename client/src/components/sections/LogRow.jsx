const severityLabelMap = {
  warning: 'Warning',
  info: 'Info',
  error: 'Error'
};

function LogRow({ log }) {
  const renderIcon = () => {
    if (log.level === 'warning') {
      return (
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
          <path
            fill='currentColor'
            d='M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767z'
          />
          <path
            fill='#ffffff'
            d='M7.002 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0m.93-3.481-.35-3.5a.552.552 0 0 1 1.1 0l-.35 3.5a.552.552 0 0 1-1.1 0'
          />
        </svg>
      );
    }

    if (log.level === 'info') {
      return (
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
          <path fill='currentColor' d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
          <path
            fill='#ffffff'
            d='M8 5.5a1 1 0 1 0-1-1 1 1 0 0 0 1 1m-.9 2.225a.9.9 0 0 1 .9-.9h.1a.9.9 0 0 1 .9.9v3.15a.9.9 0 0 1-.9.9h-.1a.9.9 0 0 1-.9-.9z'
          />
        </svg>
      );
    }

    return (
      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <path fill='currentColor' d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0' />
        <path
          fill='#ffffff'
          d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 1 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708'
        />
      </svg>
    );
  };

  return (
    <tr className={`log-row ${log.level}`}>
      <td>{log.time}</td>
      <td>
        <div className='log-level'>
          {renderIcon()}
          <span>{severityLabelMap[log.level]}</span>
        </div>
      </td>
      <td>{log.eventType}</td>
      <td>{log.description}</td>
      <td>
        {log.actionVariant === 'muted' ? (
          <span className='log-link muted'>-</span>
        ) : (
          <a href='#!' className={`log-link ${log.actionVariant}`}>
            {log.actionLabel}
          </a>
        )}
      </td>
    </tr>
  );
}

export default LogRow;
