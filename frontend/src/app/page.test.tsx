import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Home from './page';

test('Page', () => {
    render(<Home />);
    expect(screen.findByText('Find in-depth information about Next.js features and API.')).toBeDefined();
});
