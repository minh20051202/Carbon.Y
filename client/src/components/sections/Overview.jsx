import { useState, useEffect } from 'react';
import './Overview.css';

function Overview() {
    const [batchesToday, setBatchesToday] = useState(0);
    const [errorBatches, setErrorBatches] = useState(0);
    const [totalEmissions, setTotalEmissions] = useState(0);
    const [lastUploadTime, setLastUploadTime] = useState({ time: '--:--:--', date: '--/--/----' });
    const [loading, setLoading] = useState(true);
    const [errorBatchList, setErrorBatchList] = useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const fetchBatchData = async () => {
        try {
            setLoading(true);
            let allBatches = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(`http://localhost:3000/api/v1/batches/get/?limit=1000&page=${page}`);
                const result = await response.json();
                
                if (result.data && result.data.length > 0) {
                    allBatches = [...allBatches, ...result.data];
                    if (allBatches.length >= result.total) {
                        hasMore = false;
                    } else {
                        page++;
                    }
                } else {
                    hasMore = false;
                }
            }

            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            const todayBatches = allBatches.filter(batch => {
                const batchDate = new Date(batch.windowStart);
                return batchDate >= startOfDay && batchDate < endOfDay;
            });

            setBatchesToday(todayBatches.length);

            const errorBatchesData = todayBatches.filter(batch => batch.randStatus === 0);
            setErrorBatches(errorBatchesData.length);
            setErrorBatchList(errorBatchesData);

            const totalTco2e = todayBatches.reduce((sum, batch) => {
                return sum + (batch.tco2e || 0);
            }, 0);
            setTotalEmissions(totalTco2e.toFixed(2));

            if (allBatches.length > 0) {
                const sortedBatches = [...allBatches].sort((a, b) => 
                    new Date(b.windowStart) - new Date(a.windowStart)
                );
                const latestBatch = sortedBatches[0];
                const latestDate = new Date(latestBatch.windowStart);
                
                const timeStr = latestDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                const dateStr = latestDate.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                });
                
                setLastUploadTime({ time: timeStr, date: dateStr });
            }

        } catch (error) {
            console.error('Error fetching batch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatchData();

        const interval = setInterval(() => {
            fetchBatchData();
        }, 120000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="overview-header">
                <h2>Tổng quan</h2>
                <div className="overview-controls">
                    <select className="site-select">
                        <option>Site: Hanoi University of Science and Technology</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16" onClick={fetchBatchData} style={{ cursor: 'pointer' }}>
                        <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                    </svg>
                </div>
            </div>

            <hr />

            <div className='overview-main'>
                <div className='container'>
                    <div className='con-1'>
                        <div className='con-header'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-diagram-2-fill green" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 5 7h2.5V6A1.5 1.5 0 0 1 6 4.5zm-3 8A1.5 1.5 0 0 1 4.5 10h1A1.5 1.5 0 0 1 7 11.5v1A1.5 1.5 0 0 1 5.5 14h-1A1.5 1.5 0 0 1 3 12.5zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 9 12.5z" />
                            </svg>
                            <h4>Thiết bị đang hoạt động</h4>
                        </div>
                        <h2 className='main-number'>1 / 8</h2>
                        <div className='percentage-active-number'>12.5% hoạt động</div>
                    </div>

                    <div className='con-2'>
                        <div className='con-header'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-archive-fill blue" viewBox="0 0 16 16">
                                <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                            </svg>
                            <h4>Số lô đã tạo hôm nay</h4>
                        </div>
                        <h2 className='main-number'>{loading ? '...' : batchesToday}</h2>
                        <div className="status-tags">
                            <div className="tag tag-success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z" />
                                </svg>
                                {loading ? '...' : batchesToday - errorBatches} đã tải lên
                            </div>
                            <div className="tag tag-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square-fill" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                </svg>
                                {loading ? '...' : errorBatches} sẵn sàng
                            </div>
                        </div>
                    </div>

                    <div className='con-3'>
                        <div className='con-header'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle-fill red" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                            </svg>
                            <h4>Số lô lỗi</h4>
                        </div>
                        <h2 className='main-number'>{loading ? '...' : errorBatches}</h2>
                        <div className='view-detail-error' onClick={() => setShowErrorModal(true)} style={{ cursor: 'pointer' }}>Xem chi tiết →</div>
                    </div>
                </div>

                <div className='container'>
                    <div className='con-4'>
                        <div className='con-header'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-leaf-fill leaf" viewBox="0 0 16 16">
                                <path d="M1.4 1.7c.217.289.65.84 1.725 1.274 1.093.44 2.885.774 5.834.528 2.02-.168 3.431.51 4.326 1.556C14.161 6.082 14.5 7.41 14.5 8.5q0 .344-.027.734C13.387 8.252 11.877 7.76 10.39 7.5c-2.016-.288-4.188-.445-5.59-2.045-.142-.162-.402-.102-.379.112.108.985 1.104 1.82 1.844 2.308 2.37 1.566 5.772-.118 7.6 3.071.505.8 1.374 2.7 1.75 4.292.07.298-.066.611-.354.715a.7.7 0 0 1-.161.042 1 1 0 0 1-1.08-.794c-.13-.97-.396-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.124-.887-1.889-2.095-2.39-3.383-1-2.562-1-5.536-.65-7.28L.73.806z" />
                            </svg>
                            <h4>Tổng phát thải hôm nay</h4>
                        </div>
                        <h2 className='main-number'>{loading ? '...' : totalEmissions}</h2>
                        <p className="percentage-active-number">
                            tCO<sub>2</sub>e
                        </p>
                    </div>

                    <div className='con-5'>
                        <div className='con-header'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-up-fill darker-blue" viewBox="0 0 16 16">
                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
                            </svg>
                            <h4>Lần tải lên gần nhất</h4>
                        </div>
                        <h2 className='main-number'>{loading ? '...' : lastUploadTime.time}</h2>
                        <div className='percentage-active-number'>{loading ? '...' : lastUploadTime.date}</div>
                    </div>
                    <div className='con-6'>
                        <div className='con-header'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill orange" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                            <h4>Cảnh báo hiện tại</h4>
                        </div>
                        <br />
                        <div className="alert-list">
                            <div className="alert-item warning">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                </svg>
                                Hết hạn hiệu chuẩn: <span>sensor_03, sensor_07</span>
                            </div>
                            <div className="alert-item time">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stopwatch-fill" viewBox="0 0 16 16">
                                    <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
                                </svg>
                                Độ lệch thời gian &gt; 2 phút: <span>sensor_05</span>
                            </div>
                            <div className="alert-item error">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                </svg>
                                Lô <span>B2025102407</span> không tải lên được
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showErrorModal && (
                <div className="error-modal-overlay" onClick={() => setShowErrorModal(false)}>
                    <div className="error-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="error-modal-header">
                            <h3>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                </svg>
                                Danh sách lô lỗi hôm nay ({errorBatchList.length})
                            </h3>
                            <button className="close-modal-btn" onClick={() => setShowErrorModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="error-modal-body">
                            {errorBatchList.length === 0 ? (
                                <div className="no-errors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                    </svg>
                                    <p>Không có lô lỗi nào hôm nay!</p>
                                </div>
                            ) : (
                                <ul className="error-batch-list">
                                    {errorBatchList.map((batch, index) => (
                                        <li key={batch.batchId || index} className="error-batch-item">
                                            <div className="error-batch-info">
                                                <span className="batch-id">{batch.batchId}</span>
                                                <span className="batch-sensor">{batch.sensorId}</span>
                                            </div>
                                            <div className="error-batch-details">
                                                <span className="batch-time">
                                                    {new Date(batch.windowStart).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(batch.windowEnd).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="batch-emission">{(batch.tco2e || 0).toFixed(4)} tCO₂e</span>
                                            </div>
                                            <span className="error-status">Lỗi</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default Overview;