import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock next/image to render a plain <img>
vi.mock('next/image', () => ({
  default: (props) => React.createElement('img', props),
}));

// Mock next/link to render a plain <a>
vi.mock('next/link', () => ({
  default: ({ children, ...props }) => React.createElement('a', props, children),
}));
