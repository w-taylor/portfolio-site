'use client';

import { useState, useEffect } from 'react';
import styles from './ShortcutClient.module.css';

const MAX_URL_LEN = 2000;

export default function ShortcutClient() {
  const [shortUrl, setShortUrl] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [recentLinks, setRecentLinks] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(`${window.location.origin}/link/`);
    const saved = localStorage.getItem('recentLinks');
    if (saved) {
      setRecentLinks(JSON.parse(saved));
    }
  }, []);

  async function getCode(event) {
    event.preventDefault();
    setErrorMsg("");

    if (longUrl.trim().length >= MAX_URL_LEN) {
      setErrorMsg('URL must be under 2000 characters!');
      setShortUrl('');
      return;
    }

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        const newShortUrl = baseUrl + data.shortUrl;
        setShortUrl(newShortUrl);

        const newLinks = [
          {
            shortUrl: newShortUrl,
            originalUrl: longUrl,
            createdAt: new Date().toISOString()
          },
          ...recentLinks.slice(0, 4)
        ];
        setRecentLinks(newLinks);
        localStorage.setItem('recentLinks', JSON.stringify(newLinks));

        setLongUrl('');
      } else {
        setErrorMsg(data.error || 'Failed to shorten URL - plesase try again');
        setShortUrl('');
      }
    } catch (err) {
      setErrorMsg('Network error - please try again');
      setShortUrl('');
    }
  }

  return (
    <div className={styles['shortcut-main-content']}>
      <div className={styles['shortcut-title']}>ShortCut</div>
      <div className={styles['shortcut-instructions']}>
        Use this tool to create a handy redirect link for a long URL.
        <br /><br />
        Paste your original URL below and hit &quot;Submit&quot; to get the new link, which will be six random characters put on the end of {baseUrl}
        <br /><br />
        For example, &lt;<a href={`${baseUrl}bp46j3`} target="_blank" rel="noopener noreferrer">{baseUrl}bp46j3</a>&gt; will redirect to https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s
      </div>
      <div className={styles['shortcut-panel']}>
        <div className={styles['panel-content']}>
          {errorMsg && (
            <><div className={styles['shortcut-error-display']}>{errorMsg}</div><br /></>
          )}

          <form onSubmit={getCode}>
            <div>Enter URL</div>
            <input type="text" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} />
            <button type="submit">Submit</button>
          </form>

          {shortUrl && (
            <>
              <br /><br />
              <div className={styles['shortcut-result']}>
                Your link is: {shortUrl}
                <br /><br />
                &lt;<a href={shortUrl} target="_blank" rel="noopener noreferrer">Try it out!</a>&gt;
              </div>
            </>
          )}
        </div>
      </div>
      {recentLinks.length > 0 && (
        <>
          <div className={styles['recent-links-title']}>Recent Links</div>
          <div className={styles['recent-links']}>
            {recentLinks.map((link) => (
              <div className={styles['link-item']} key={link.shortUrl}>
                &lt;<a
                  href={link.shortUrl}
                  target="_blank"
                  className={styles['short-link']}
                  rel="noopener noreferrer"
                >
                  {link.shortUrl}
                </a>&gt; redirects to:
                <br /><br />
                <div className={styles['original-url']} title={link.originalUrl}>
                  {link.originalUrl}
                </div>
                <br />
                <div className={styles['link-meta']}>
                  Created {new Date(link.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
