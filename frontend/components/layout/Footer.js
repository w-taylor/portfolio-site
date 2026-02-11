import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles['footer-wrapper']}>
      <div className={styles['footer-left']}>
        <div className={styles['footer-left-text']}>
          <div style={{ fontSize: '3em' }}><a href="/"><strong>&lt;wtaylor.xyz&gt;</strong></a></div>
          <div>&copy; 2026 William Taylor</div>
        </div>
      </div>
      <div className={styles['footer-right']}>
        <div className={styles['footer-link']}><a href="/#projects-header">&lt;Projects&gt;</a></div>
        <div className={styles['footer-link']}><a href="/#site-info-header">&lt;Site Info&gt;</a></div>
        <div className={styles['footer-link']}><a href="/#contact-header">&lt;Contact&gt;</a></div>
      </div>
    </div>
  );
}
