'use client';

import { useState, useEffect } from 'react';
import styles from './ShortcutClient.module.css';

const MAX_URL_LEN = 2000;

export default function ShortcutClient() {
  const [shortUrl, setShortUrl] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [recentLinks, setRecentLinks] = useState([]);
  const [clickCounts, setClickCounts] = useState({});
  const [baseUrl, setBaseUrl] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");

  function copyToClipboard(url) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(prev => prev === url ? "" : prev), 1500);
  }

  useEffect(() => {
    setBaseUrl(`${window.location.origin}/link/`);
    const saved = localStorage.getItem('recentLinks');
    if (saved) {
      const links = JSON.parse(saved);
      setRecentLinks(links);
      fetchClickCounts(links);
    }
  }, []);

  async function fetchClickCounts(links) {
    if (!links.length) return;
    const codes = links.map(l => l.shortUrl.split('/link/')[1]).filter(Boolean);
    if (!codes.length) return;
    try {
      const res = await fetch('/api/shorten/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codes }),
      });
      if (res.ok) {
        setClickCounts(await res.json());
      }
    } catch {
      // click counts are non-critical, fail silently
    }
  }

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
        setClickCounts(prev => ({ ...prev, [data.shortUrl]: { clicks: 0 } }));

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
            <div className={styles['shortcut-error-display']}>{errorMsg}</div>
          )}

          <form className={styles['shorten-form']} onSubmit={getCode}>
            <label className={styles['label']}>
              Enter URL
              <input
                type="text"
                className={styles['input']}
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </form>

          {shortUrl && (
            <div className={styles['shortcut-result']}>
              <span className={styles['result-label']}>Your link:</span>
              <a
                href={shortUrl}
                target="_blank"
                className={styles['result-link']}
                rel="noopener noreferrer"
              >
                {shortUrl}
              </a>
              <button
                className={`${styles['copy-btn']} ${copiedUrl === shortUrl ? styles['copy-btn-copied'] : ''}`}
                onClick={() => copyToClipboard(shortUrl)}
              >
                {copiedUrl === shortUrl ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>
      {recentLinks.length > 0 && (
        <div className={styles['recent-links-section']}>
          <div className={styles['recent-links-title']}>Recent Links</div>
          <div className={styles['recent-links']}>
            {recentLinks.map((link) => {
              const code = link.shortUrl.split('/link/')[1];
              const count = clickCounts[code]?.clicks;
              return (
                <div className={styles['link-card']} key={link.shortUrl}>
                  <div className={styles['link-card-left']}>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      className={styles['short-link']}
                      rel="noopener noreferrer"
                    >
                      /link/{code}
                    </a>
                    <div className={styles['original-url']} title={link.originalUrl}>
                      {link.originalUrl}
                    </div>
                    <span className={styles['link-meta']}>
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={styles['link-card-right']}>
                    {count != null && (
                      <span className={styles['click-badge']}>
                        {count} {count === 1 ? 'click' : 'clicks'}
                      </span>
                    )}
                    <button
                      className={`${styles['copy-btn']} ${copiedUrl === link.shortUrl ? styles['copy-btn-copied'] : ''}`}
                      onClick={() => copyToClipboard(link.shortUrl)}
                    >
                      {copiedUrl === link.shortUrl ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
