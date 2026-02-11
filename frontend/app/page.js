import Image from 'next/image';
import LogoGrid from '@/components/home/LogoGrid';
import MainPageBreak from '@/components/home/MainPageBreak';
import ProjectEntry from '@/components/home/ProjectEntry';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles['main-page-content']}>
      <h2 className={styles['section-header']}><pre>{`__        _______ _     ____ ___  __  __ _____
\\ \\      / / ____| |   / ___/ _ \\|  \\/  | ____|
 \\ \\ /\\ / /|  _| | |  | |  | | | | |\\/| |  _|
  \\ V  V / | |___| |__| |__| |_| | |  | | |___
   \\_/\\_/  |_____|_____\\____\\___/|_|  |_|_____|`}</pre></h2>

      <div className={styles['intro-box']}>
        <div className={`${styles['intro-box-left']} ${styles['text-blurb']}`}>
          <p>Hi, I&apos;m William, a full-stack developer based in Austin.<br /><br />I build dynamic user interfaces, robust backend systems, and efficient databases. I strive to create applications that are as intuitive for the user as they are technically sound under the hood. You can find a selection of some of my recent projects below.</p>

          <div style={{ display: 'flex' }}>Here&apos;s a link to my <a href="https://github.com/w-taylor" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} target="_blank" rel="noopener noreferrer">&nbsp;&lt;<Image src="/images/github-mark-white.png" width={16} height={16} style={{ height: '1em', width: '1em', verticalAlign: 'middle' }} alt="GitHub" />&thinsp;Github&gt;</a></div>
          <br />
        </div>

        <div className={styles['intro-box-right']}>
          <LogoGrid />
        </div>
      </div>

      <MainPageBreak />

      <h2 className={styles['section-header']} id="projects-header"><pre>{` ____  ____   ___      _ _____ ____ _____ ____
|  _ \\|  _ \\ / _ \\    | | ____/ ___|_   _/ ___|
| |_) | |_) | | | |_  | |  _|| |     | | \\___ \\
|  __/|  _ <| |_| | |_| | |__| |___  | |  ___) |
|_|   |_| \\_\\\\___/ \\___/|_____\\____| |_| |____/`}</pre></h2>

      <ProjectEntry
        imgSrc="/images/port-site-preview.png"
        projTitle="Portable Site Template"
        descText="Template for quickly getting started with a simple SPA site. Dockerized with a Svelte frontend, Node.js API server, Postgres database, and Nginx reverse proxy. Includes a basic To-Do app as an example but intended to be used as a jumping off point."
        projLink="https://github.com/w-taylor/portable-template"
        linkText="Github Repo"
      />

      <ProjectEntry
        imgSrc="/images/pingboard-preview.png"
        projTitle="Pingboard"
        descText="Monitors performance of api endpoints by running scheduled requests and storing the results using React, FastAPI, and Postgres"
        projLink="/pingboard"
        linkText="Live Project"
      />

      <ProjectEntry
        imgSrc="/images/shortcut-preview.png"
        projTitle="ShortCut"
        descText="Creates shortened, usable redirect links to long URLs using React, FastAPI, and Postgres"
        projLink="/shortcut"
        linkText="Live Project"
      />

      <ProjectEntry
        imgSrc="/images/conway-preview.png"
        projTitle="Conway's <i>Game of Life</i>"
        descText="An implentation of Conway's <i>Game of Life</i> cellular automata simulation using React"
        projLink="/conway"
        linkText="Live Project"
      />

      <MainPageBreak />

      <h2 className={styles['section-header']} id="site-info-header"><pre>{` ____ ___ _____ _____   ___ _   _ _____ ___
/ ___|_ _|_   _| ____| |_ _| \\ | |  ___/ _ \\
\\___ \\| |  | | |  _|    | ||  \\| | |_ | | | |
 ___) | |  | | | |___   | || |\\  |  _|| |_| |
|____/___|_|_| |_____| |___|_| \\_|_|   \\___/`}</pre></h2>

      <p className={styles['text-blurb']}>
        This site uses a React/Next.js frontend, FastAPI api server, Postgres database, Nginx reverse-proxy, and deployed in a Docker container. <br /><br />
        A lot of what was used here is probably overkill for a simple site like this, it&apos;s mostly an excuse to play with these different technologies.<br /><br />
        HTTPS is set up for this site using <a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">&lt;Certbot&gt;</a>, huge thanks to <a href="https://www.eff.org/" target="_blank" rel="noopener noreferrer">&lt;EFF&gt;</a> for maintaining the utility and <a href="https://letsencrypt.org/" target="_blank" rel="noopener noreferrer">&lt;Let&apos;s Encrypt&gt;</a> for providing the certificates.<br /><br />
        You can find the code for this site <a href="https://github.com/w-taylor/portfolio-site" target="_blank" rel="noopener noreferrer">&lt;here&gt;</a>
      </p>

      <MainPageBreak />

      <h2 className={styles['section-header']} id="contact-header"><pre>{`  ____ ___  _   _ _____  _    ____ _____
 / ___/ _ \\| \\ | |_   _|/ \\  / ___|_   _|
| |  | | | |  \\| | | | / _ \\| |     | |
| |__| |_| | |\\  | | |/ ___ \\ |___  | |
 \\____\\___/|_| \\_| |_/_/   \\_\\____| |_|`}</pre></h2>

      <div style={{ display: 'flex', justifyContent: 'center' }}><p className={styles['text-blurb']}>If you&apos;d like to get in touch or want to recieve a resume, you can email me at&nbsp;<a href="mailto:william@wtaylor.xyz">&lt;william@wtaylor.xyz&gt;</a></p></div>

    </div>
  );
}
