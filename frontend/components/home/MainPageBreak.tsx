import styles from './MainPageBreak.module.css';

export default function MainPageBreak() {
  return (
    <div className={styles['main-page-break']}>
      <pre>{`# # # # # # # # # # # # # # # # # # # # # # # # # # # #
 # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # `}</pre>
    </div>
  );
}
