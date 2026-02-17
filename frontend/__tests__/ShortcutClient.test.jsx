import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShortcutClient from '@/components/shortcut/ShortcutClient';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.restoreAllMocks();
});

describe('ShortcutClient', () => {
  it('renders the title and form', () => {
    render(<ShortcutClient />);
    expect(screen.getByText('ShortCut')).toBeInTheDocument();
    expect(screen.getByText('Enter URL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('shows error for URLs that are too long', async () => {
    render(<ShortcutClient />);
    const input = screen.getByRole('textbox');
    const longUrl = 'https://example.com/' + 'a'.repeat(2000);

    fireEvent.change(input, { target: { value: longUrl } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('URL must be under 2000 characters!')).toBeInTheDocument();
  });

  it('submits URL and displays shortened link', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ shortUrl: 'abc123' }),
      })
    );

    render(<ShortcutClient />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Your link:')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' }),
    });
  });

  it('shows error on network failure', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<ShortcutClient />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Network error - please try again')).toBeInTheDocument();
    });
  });
});
