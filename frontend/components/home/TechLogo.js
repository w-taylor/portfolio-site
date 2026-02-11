import Image from 'next/image';
import styles from './TechLogo.module.css';

export default function TechLogo({ imgName, imgTxt }) {
  const imgSrc = `/images/${imgName}`;
  return (
    <div className={styles['tech-logo-cont']}>
      <Image src={imgSrc} className={styles['tech-logo-img']} alt={imgTxt} width={56} height={56} />
      <p className={styles['tech-logo-caption']}>{imgTxt}</p>
    </div>
  );
}
