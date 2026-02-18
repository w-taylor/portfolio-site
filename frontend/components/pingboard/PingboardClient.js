'use client';

import { useState, useRef } from 'react';
import styles from './PingboardClient.module.css';
import Sparkline from './Sparkline';

const colorMap = {
  "up": "green",
  "down": "red",
  "slow": "orange"
};

function formatTimestamp(utcTimestamp) {
  if (!utcTimestamp) return "-";
  const date = new Date(utcTimestamp);
  if (isNaN(date.getTime())) return "-";
  return date.toISOString().replace('T', ' ').slice(0, 16);
}

function relativeTime(utcTimestamp) {
  try {
    const date = new Date(utcTimestamp);
    if (isNaN(date.getTime())) return "";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  } catch {
    return "";
  }
}

function statusColor(checkStatus) {
  if (checkStatus in colorMap) {
    return colorMap[checkStatus];
  }
  return "white";
}

export default function PingboardClient({ loadedServices, loadError }) {
  const [modalDisplay, setModalDisplay] = useState("none");
  const [modalChecks, setModalChecks] = useState([]);
  const [modalService, setModalService] = useState({});
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [detailErrors, setDetailErrors] = useState({});
  const savedChecksRef = useRef({});

  function toggleModal() {
    if (modalDisplay === "none") {
      setModalDisplay("block");
    } else {
      setModalDisplay("none");
      setShowAppInfo(false);
    }
  }

  async function getDetailInfo(service) {
    const sid = service.id;
    setDetailErrors(prev => ({ ...prev, [sid]: false }));

    if (!(sid in savedChecksRef.current)) {
      try {
        const checkRes = await fetch(`/api/pingboard/${sid}/checks`);
        savedChecksRef.current[sid] = await checkRes.json();
      } catch (error) {
        console.error(`Error getting checks for service with id ${sid}:`, error);
        setDetailErrors(prev => ({ ...prev, [sid]: true }));
        return;
      }
    }
    setModalChecks(savedChecksRef.current[sid]);
    setModalService(service);
    toggleModal();
  }

  function toggleAppInfoModal() {
    setShowAppInfo(true);
    toggleModal();
  }

  return (
    <div className={styles['pingboard-content']}>
      <div className={styles['pb-modal']} style={{ display: modalDisplay }}>
        <div className={styles['pb-modal-content']}>
          <div onClick={toggleModal} style={{ float: 'right', fontSize: '2em', cursor: 'pointer' }}>&times;</div>

          {showAppInfo ? (
            <>
              <div className={`${styles['info-modal-title']} ${styles['flex-center']}`}>Pingboard Info</div>
              <div>
                Pingboard is an application that tracks the perfomance and uptime of services over time. Once per hour, the server sends a request to each service and logs in the database the response time and whether the request was successful. If a request takes longer than 2 seconds, that request is additionally noted as being slow.
                <br /><br />
                Below you can find a panel for each service tracked that includes a description, uptime percentage, average response time, and the total number of checks that have been logged for the service. Click the &quot;Detail View&quot; button next to any service to bring up a window that will show a table with information from the last 50 individual checks that were performed on that service.
              </div>
            </>
          ) : (
            <>
              <div className={`${styles['modal-name']} ${styles['flex-center']}`}>
                <span className={`${styles['status-dot']} ${styles[statusColor(modalService.latest_status)]}`}></span>
                {modalService.name}
              </div>
              <div className={styles['modal-metrics']}>
                <div className={styles.metric}>
                  <span className={styles['metric-label']}>Uptime</span>
                  <span className={styles['metric-value']}>{Number(modalService.uptime_percentage).toFixed(3)}%</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles['metric-label']}>Total Checks</span>
                  <span className={styles['metric-value']}>{modalService.total_checks}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles['metric-label']}>Avg Response Time</span>
                  <span className={styles['metric-value']}>{Number(modalService.avg_response_time).toFixed(0)} ms</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles['metric-label']}>First Check (UTC)</span>
                  <span className={styles['metric-value']}>
                    {formatTimestamp(modalService.first_check)}
                    <span className={styles['relative-time']}>({relativeTime(modalService.first_check)})</span>
                  </span>
                </div>
                <div className={styles.metric}>
                  <span className={styles['metric-label']}>Last Check (UTC)</span>
                  <span className={styles['metric-value']}>
                    {formatTimestamp(modalService.last_check)}
                    <span className={styles['relative-time']}>({relativeTime(modalService.last_check)})</span>
                  </span>
                </div>
              </div>
              {modalChecks.length > 0 && (
                <div className={styles['sparkline-container-large']}>
                  <div className={styles['sparkline-label']}>Response Times (last {modalChecks.length} checks)</div>
                  <Sparkline
                    data={[...modalChecks].reverse().map(c => c.response_time)}
                    width={500}
                    height={80}
                    color="#00b300"
                    showAxes
                  />
                </div>
              )}

              <table className={styles['checks-table']}>
                <thead>
                  <tr>
                    <th>Checked At (UTC)</th>
                    <th>Status Code</th>
                    <th>Response Time (ms)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modalChecks.map((mCheck) => (
                    <tr key={mCheck.id} style={{ color: statusColor(mCheck.status) }}>
                      <td>{formatTimestamp(mCheck.checked_at)}</td>
                      <td>{mCheck.status_code || '-'}</td>
                      <td>{mCheck.response_time}</td>
                      <td>{mCheck.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      <div className={`${styles['pingboard-title']} ${styles['flex-center']}`}>
        <div className={`${styles['pulse-light']} ${styles.green}`}></div>
        Pingboard
        <div className={`${styles['pulse-light']} ${styles.red}`}></div>
      </div>
      <div className={`${styles['flex-center']} ${styles['info-button']}`}>
        <button onClick={toggleAppInfoModal}>See Pingboard Info</button>
      </div>

      {loadError ? (
        <div className={styles['load-error']}>Error getting data from server, please try again.</div>
      ) : loadedServices ? (
        loadedServices.map((service) => (
          <div className={styles['pingboard-panel']} key={service.id}>
            <div className={`${styles['panel-name']} ${styles['flex-center']}`}>
              <span className={`${styles['status-dot']} ${styles[statusColor(service.latest_status)]}`}></span>
              &lt;<a href={service.base_url} rel="noopener noreferrer" target="_blank">{service.name}</a>&gt;
            </div>
            <div className={styles['panel-desc']}>{service.description}</div>
            <div className={styles['panel-metrics']}>
              <div className={styles.metric}>
                <span className={styles['metric-label']}>Uptime</span>
                <span className={styles['metric-value']}>{Number(service.uptime_percentage).toFixed(3)}%</span>
              </div>
              <div className={styles.metric}>
                <span className={styles['metric-label']}>Avg Response Time</span>
                <span className={styles['metric-value']}>{Number(service.avg_response_time).toFixed(0)} ms</span>
              </div>
              <div className={styles.metric}>
                <span className={styles['metric-label']}>Total Checks</span>
                <span className={styles['metric-value']}>{service.total_checks}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles['metric-label']}>Last Check</span>
                <span className={styles['metric-value']}>
                  {relativeTime(service.last_check)}
                </span>
              </div>
            </div>
            {service.recent_response_times && service.recent_response_times.length > 0 && (
              <div className={styles['sparkline-container']}>
                <div className={styles['sparkline-label']}>Response Times (last 24 hours)</div>
                <Sparkline data={service.recent_response_times} width={320} height={80} color="#00b300" showAxes />
              </div>
            )}
            <div className={`${styles['flex-center']} ${styles['panel-actions']}`}>
              <button onClick={() => getDetailInfo(service)}>Detail View</button>
            </div>
            {detailErrors[service.id] && (
              <div className={styles['detail-error']}>Failed to get Detail View, please try again.</div>
            )}
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
