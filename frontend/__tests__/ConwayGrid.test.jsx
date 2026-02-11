import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ConwayGrid from '@/components/ConwayGrid';

beforeEach(() => {
  vi.useFakeTimers();
});

describe('ConwayGrid', () => {
  it('toggles a cell between alive and dead on click', () => {
    render(<ConwayGrid />);
    const cells = document.querySelectorAll('[class*="dead-cell"]');
    const cell = cells[0];

    fireEvent.click(cell);
    expect(cell.className).toMatch(/alive-cell/);

    fireEvent.click(cell);
    expect(cell.className).toMatch(/dead-cell/);
  });

  it('increments cycle counter on Step 1 Cycle click', () => {
    render(<ConwayGrid />);
    expect(screen.getByText('0 Cycles')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Step 1 Cycle' }));
    expect(screen.getByText('1 Cycles')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Step 1 Cycle' }));
    expect(screen.getByText('2 Cycles')).toBeInTheDocument();
  });

  it('resets grid and counter on Reset click', () => {
    render(<ConwayGrid />);
    const cells = document.querySelectorAll('[class*="dead-cell"]');

    // Toggle a cell and step forward
    fireEvent.click(cells[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Step 1 Cycle' }));
    expect(screen.getByText('1 Cycles')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('0 Cycles')).toBeInTheDocument();

    const allDead = document.querySelectorAll('[class*="alive-cell"]');
    expect(allDead.length).toBe(0);
  });

  it('toggles button text between Start and Stop', () => {
    render(<ConwayGrid />);
    const startBtn = screen.getByRole('button', { name: 'Start' });

    fireEvent.click(startBtn);
    expect(startBtn).toHaveTextContent('Stop');

    fireEvent.click(startBtn);
    expect(startBtn).toHaveTextContent('Start');
  });

  it('Step 1 Cycle does nothing while running', () => {
    render(<ConwayGrid />);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Step 1 Cycle' }));

    // Counter should still be 0 — the step button is ignored while running
    // (interval hasn't fired because we're using fake timers)
    expect(screen.getByText('0 Cycles')).toBeInTheDocument();
  });

  it('Reset does nothing while running', () => {
    render(<ConwayGrid />);

    // Step once to get counter to 1, then start
    fireEvent.click(screen.getByRole('button', { name: 'Step 1 Cycle' }));
    expect(screen.getByText('1 Cycles')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    // Counter should still be 1 — reset is ignored while running
    expect(screen.getByText('1 Cycles')).toBeInTheDocument();
  });

  it('auto-advances cycles while running', () => {
    render(<ConwayGrid />);
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByText('1 Cycles')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByText('2 Cycles')).toBeInTheDocument();
  });
});
