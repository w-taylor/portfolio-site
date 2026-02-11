import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header', () => {
  it('toggles mobile menu on hamburger click', () => {
    render(<Header />);
    const mobileMenu = document.querySelector('[class*="mobile-menu"]');
    expect(mobileMenu).toHaveStyle({ display: 'none' });

    const hamburger = document.querySelector('[class*="hamburger"]');
    fireEvent.click(hamburger);
    expect(mobileMenu).toHaveStyle({ display: 'flex' });

    fireEvent.click(hamburger);
    expect(mobileMenu).toHaveStyle({ display: 'none' });
  });
});
