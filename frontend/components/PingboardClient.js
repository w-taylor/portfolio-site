'use client';

import { useState, useRef } from 'react';
import styles from './PingboardClient.module.css';

const colorMap = {
  "up": "green",
  "down": "red",
  "slow": "orange"
};

function formatTimestamp(utcTimestamp) {
  try {
    const date = new Date(utcTimestamp);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    return date.toISOString().replace('T', ' ').slice(0, 16);
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return "-";
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
              <br /><div className={`${styles['info-modal-title']} ${styles['flex-center']}`}>Pingboard Info</div><br />
              <div>
                Pingboard is an application that tracks the perfomance and uptime of services over time. Once per hour, the server sends a request to each service and logs in the database the response time and whether the request was successful. If a request takes longer than 2 seconds, that request is additionally noted as being slow.
                <br /><br />
                Below you can find a panel for each service tracked that includes a description, uptime percentage, average response time, and the total number of checks that have been logged for the service. Click the &quot;Detail View&quot; button next to any service to bring up a window that will show a table with information from the last 50 individual checks that were performed on that service.
              </div>
            </>
          ) : (
            <>
              <div className={`${styles['modal-name']} ${styles['flex-center']}`}>{modalService.name}</div><br />
              <div>Uptime Percentage: {Number(modalService.uptime_percentage).toFixed(3)}%</div>
              <div>Total Checks Logged: {modalService.total_checks}</div>
              <div>Average Response Time: {Number(modalService.avg_response_time).toFixed(0)} ms</div>
              <div>First Check (UTC): {formatTimestamp(modalService.first_check)}</div>
              <div>Last Check (UTC): {formatTimestamp(modalService.last_check)}</div><br />

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
      <br />
      <div className={styles['flex-center']}><button onClick={toggleAppInfoModal}>See Pingboard Info</button></div>

      {loadError ? (
        <div className={styles['load-error']} style={{ color: 'red' }}>Error getting data from server, please try again.</div>
      ) : loadedServices ? (
        loadedServices.map((service) => (
          <div className={styles['pingboard-panel']} key={service.id}>
            <div className={`${styles['panel-name']} ${styles['flex-center']}`}>&lt;<a href={service.base_url} rel="noopener noreferrer" target="_blank">{service.name}</a>&gt;</div><br />
            <div className={styles['panel-desc']}>{service.description}</div><br />
            <div>Uptime Percentage: {Number(service.uptime_percentage).toFixed(3)}%</div>
            <div>Average Response Time: {Number(service.avg_response_time).toFixed(0)} ms</div>
            <div>Total Checks Logged: {service.total_checks}</div><br />
            <div className={styles['flex-center']}><button onClick={() => getDetailInfo(service)}>Detail View</button></div>
            {detailErrors[service.id] && (
              <div style={{ color: 'red' }}>Failed to get Detail View, please try again.</div>
            )}
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
