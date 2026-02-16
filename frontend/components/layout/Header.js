'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [menuDisplay, setMenuDisplay] = useState("none");

  function toggleMenu() {
    setMenuDisplay(prev => prev === "none" ? "flex" : "none");
  }

  return (
    <div className={styles['header-wrapper']}>
      <div className={styles['header-left']}><Link href="/"><strong>&lt;wtaylor.xyz&gt;</strong></Link></div>
      <div className={styles['header-right']}>
        <nav className={styles.nav}>
          <a href="https://github.com/w-taylor" className={styles['github-link']} target="_blank" rel="noopener noreferrer">
            <Image src="/images/github-mark.png" width={16} height={16} style={{ height: '1em', width: '1em' }} alt="GitHub" />
          </a> |
          <Link href="/#projects-header">&lt;Projects&gt;</Link> |
          <Link href="/#site-info-header">&lt;Site Info&gt;</Link> |
          <Link href="/#contact-header">&lt;Contact&gt;</Link>
        </nav>

        <div className={styles['mobile-only']}>
          <label className={styles.hamburger} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </label>

          <div className={styles['mobile-menu']} style={{ display: menuDisplay }}>
            <a href="https://github.com/w-taylor" className={styles['github-link']} target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
              <Image src="/images/github-mark.png" width={16} height={16} style={{ height: '1em', width: '1em' }} alt="GitHub" />
            </a>
            <Link href="/#projects-header" onClick={toggleMenu}>&lt;Projects&gt;</Link>
            <Link href="/#site-info-header" onClick={toggleMenu}>&lt;Site&nbsp;Info&gt;</Link>
            <Link href="/#contact-header" onClick={toggleMenu}>&lt;Contact&gt;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
