import Image from 'next/image';
import styles from './ProjectEntry.module.css';

export default function ProjectEntry({ imgSrc, projTitle, descText, projLink, linkText }) {
  const isExternal = linkText !== 'Live Project';
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <div className={styles['project-container']}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href={projLink} {...linkProps}>
          <Image src={imgSrc} className={styles['preview-img']} alt={projTitle} width={192} height={192} />
        </a>
      </div>

      <div className={styles['description-box']}>
        <div className={styles['project-title']}>
          <b dangerouslySetInnerHTML={{ __html: projTitle }} />
        </div>
        <br />
        <div className={styles['description-text']} dangerouslySetInnerHTML={{ __html: descText }} />
        <br />
        <div className={styles['project-link']}>
          <a href={projLink} {...linkProps}>&lt;{linkText}&gt;</a>
        </div>
      </div>
    </div>
  );
}
