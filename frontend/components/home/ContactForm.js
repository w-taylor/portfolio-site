'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ContactForm.module.css';

const ACCESS_KEY = '1f45d9ac-dac7-4e04-8987-9f2bac1b65b6'; // Fine to commit, basically the same as publishing my email address

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const mountedAt = useRef(Date.now());
  const cooldownTimer = useRef(null);

  useEffect(() => () => clearTimeout(cooldownTimer.current), []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (Date.now() - mountedAt.current < 3000) {
      return; // too fast to be human
    }

    setStatus('sending');

    const formData = new FormData(e.target);
    formData.append('access_key', ACCESS_KEY);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        e.target.reset();
        cooldownTimer.current = setTimeout(() => setStatus('idle'), 10000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="checkbox" name="botcheck" hidden style={{ display: 'none' }} />

      <label className={styles.label}>
        Name
        <input
          type="text"
          name="name"
          required
          className={styles.input}
          disabled={status === 'sending'}
        />
      </label>

      <label className={styles.label}>
        Email
        <input
          type="email"
          name="email"
          required
          className={styles.input}
          disabled={status === 'sending'}
        />
      </label>

      <label className={styles.label}>
        Message
        <textarea
          name="message"
          required
          rows={5}
          className={styles.textarea}
          disabled={status === 'sending'}
        />
      </label>

      <button type="submit" disabled={status === 'sending' || status === 'sent'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'sent' && (
        <p className={styles.success}>Message sent — thank you!</p>
      )}
      {status === 'error' && (
        <p className={styles.error}>Something went wrong. Please try again or email directly.</p>
      )}
    </form>
  );
}
