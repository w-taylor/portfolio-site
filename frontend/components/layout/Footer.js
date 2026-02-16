import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles['footer-wrapper']}>
      <div className={styles['footer-left']}>
        <div className={styles['footer-left-text']}>
          <div style={{ fontSize: '3em' }}><Link href="/"><strong>&lt;wtaylor.xyz&gt;</strong></Link></div>
          <div>&copy; 2026 William Taylor</div>
        </div>
      </div>
      <div className={styles['footer-right']}>
        <div className={styles['footer-link']}><Link href="/#projects-header">&lt;Projects&gt;</Link></div>
        <div className={styles['footer-link']}><Link href="/#site-info-header">&lt;Site Info&gt;</Link></div>
        <div className={styles['footer-link']}><Link href="/#contact-header">&lt;Contact&gt;</Link></div>
      </div>
    </div>
  );
}
