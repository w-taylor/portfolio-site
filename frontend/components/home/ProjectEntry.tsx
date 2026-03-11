import Image from 'next/image';
import Link from 'next/link';
import styles from './ProjectEntry.module.css';

interface ProjectEntryProps {
  imgSrc: string;
  projTitle: string;
  descText: string;
  projLink: string;
  linkText: string;
}

export default function ProjectEntry({ imgSrc, projTitle, descText, projLink, linkText }: ProjectEntryProps) {
  const isExternal = linkText !== 'Live Project';
  const linkProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
  const LinkTag: typeof Link | 'a' = isExternal ? 'a' : Link;

  return (
    <div className={styles['project-container']}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LinkTag href={projLink} {...linkProps}>
          <Image src={imgSrc} className={styles['preview-img']} alt={projTitle} width={192} height={192} />
        </LinkTag>
      </div>

      <div className={styles['description-box']}>
        <div className={styles['project-title']}>
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: hardcoded content, no XSS risk */}
          <b dangerouslySetInnerHTML={{ __html: projTitle }} />
        </div>
        <br />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: hardcoded content, no XSS risk */}
        <div className={styles['description-text']} dangerouslySetInnerHTML={{ __html: descText }} />
        <br />
        <div className={styles['project-link']}>
          <LinkTag href={projLink} {...linkProps}>&lt;{linkText}&gt;</LinkTag>
        </div>
      </div>
    </div>
  );
}
