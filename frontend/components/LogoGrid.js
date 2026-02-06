import TechLogo from './TechLogo';
import styles from './LogoGrid.module.css';

export default function LogoGrid() {
  return (
    <div className={styles['logo-grid']}>
      <TechLogo imgName="HTML5.png" imgTxt="HTML" />
      <TechLogo imgName="CSS3.png" imgTxt="CSS" />
      <TechLogo imgName="JavaScript.png" imgTxt="JavaScript" />
      <TechLogo imgName="Python.png" imgTxt="Python" />
      <TechLogo imgName="Svelte.png" imgTxt="Svelte" />
      <TechLogo imgName="Vue.js.png" imgTxt="Vue.js" />
      <TechLogo imgName="Node.js.png" imgTxt="Node.js" />
      <TechLogo imgName="Bash.png" imgTxt="Bash" />
      <TechLogo imgName="PostgresSQL.png" imgTxt="Postgres" />
      <TechLogo imgName="Docker.png" imgTxt="Docker" />
      <TechLogo imgName="Linux.png" imgTxt="Linux" />
      <TechLogo imgName="Git.png" imgTxt="Git" />
    </div>
  );
}
