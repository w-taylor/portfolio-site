import styles from './loading.module.css';

function SkeletonPanel() {
  return (
    <div className={styles['skeleton-panel']}>
      <div className={styles['skeleton-title']} />
      <div className={styles['skeleton-line']} style={{ width: '80%', marginBottom: '0.5em' }} />
      <div className={styles['skeleton-line']} style={{ width: '60%', marginBottom: '0.5em' }} />
      <div className={styles['skeleton-line']} style={{ width: '50%', marginBottom: '0.5em' }} />
      <div className={styles['skeleton-line']} style={{ width: '45%' }} />
    </div>
  );
}

export default function PingboardLoading() {
  return (
    <div style={{ maxWidth: 'min(70ch, 100% - 4rem)', marginInline: 'auto' }}>
      <div style={{ fontSize: '5em', display: 'flex', justifyContent: 'center', color: '#333' }}>
        Pingboard
      </div>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={styles['skeleton-btn']} />
      </div>
      <SkeletonPanel />
      <SkeletonPanel />
      <SkeletonPanel />
    </div>
  );
}
