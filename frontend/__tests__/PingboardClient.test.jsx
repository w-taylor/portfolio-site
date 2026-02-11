import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import PingboardClient from '@/components/PingboardClient';

function makeService(id, overrides = {}) {
    return {
        id: id,
        name: `Test Service - ${id}`,
        url: `https://example.com/${id}`,
        base_url: 'https://example.com/',
        description: `Test service number ${id}`,
        uptime_percentage: 99.1234,
        first_check: '2025-11-13T03:00:00Z',
        last_check: '2025-11-13T05:00:00Z',
        avg_response_time: 200.1234,
        total_checks: 20,
        ...overrides,
    };
}

describe('PingboardClient', () => {

    it('renders pingboard service panels', () => {
        render(<PingboardClient 
            loadedServices={[makeService(1), makeService(2, {uptime_percentage: 100, avg_response_time: 1234.9, total_checks: 30})]} 
            loadError={null}
        />);

        const panel_one = screen.getByText('Test service number 1').closest('[class*="pingboard-panel"]');
        expect(within(panel_one).getByText('Uptime Percentage: 99.123%')).toBeInTheDocument();
        expect(within(panel_one).getByText('Average Response Time: 200 ms')).toBeInTheDocument();
        expect(within(panel_one).getByText('Total Checks Logged: 20')).toBeInTheDocument();
        expect(within(panel_one).getByRole('button', { name: 'Detail View' })).toBeInTheDocument()

        const panel_two = screen.getByText('Test service number 2').closest('[class*="pingboard-panel"]');
        expect(within(panel_two).getByText('Uptime Percentage: 100.000%')).toBeInTheDocument();
        expect(within(panel_two).getByText('Average Response Time: 1235 ms')).toBeInTheDocument();
        expect(within(panel_two).getByText('Total Checks Logged: 30')).toBeInTheDocument();
        expect(within(panel_two).getByRole('button', { name: 'Detail View' })).toBeInTheDocument()
    })

    it('shows error message if services do not load', () => {
        render(<PingboardClient 
            loadedServices={null} 
            loadError={"Error"}
        />);

        expect(screen.getByText('Error getting data from server, please try again.')).toBeInTheDocument();
        expect(screen.queryByText(/Detail View/)).not.toBeInTheDocument();
    })

    it('shows loading text while waiting on services or error', () => {
        render(<PingboardClient 
            loadedServices={null} 
            loadError={null}
        />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText(/Detail View/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Error getting data from server, please try again./)).not.toBeInTheDocument();
    })

    it('opens detail modal with check data on Detail View click', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
             json: () => Promise.resolve([
                { id: 1, checked_at: '2025-11-13T03:00:00Z', status_code: 200, response_time: 150, status: 'up' },
                { id: 2, checked_at: '2025-11-13T04:00:00Z', status_code: 200, response_time: 5000, status: 'slow' },
                { id: 3, checked_at: '2025-11-13T05:00:00Z', status_code: null, response_time: 10150, status: 'down' }
            ]),
        }));

        render(<PingboardClient loadedServices={[makeService(1)]} loadError={null} />);
        fireEvent.click(screen.getByRole('button', { name: 'Detail View' }));

        await waitFor(() => {
            expect(screen.getByText('2025-11-13 03:00')).toBeInTheDocument();
        });

        const up_row = screen.getByText('2025-11-13 03:00').closest('tr');
        expect(up_row).toHaveStyle({ color: 'rgb(0, 128, 0)' }); // Check row is green
        expect(within(up_row).getByText('up')).toBeInTheDocument();
        expect(within(up_row).getByText('200')).toBeInTheDocument();
        expect(within(up_row).getByText('150')).toBeInTheDocument();

        const slow_row = screen.getByText('2025-11-13 04:00').closest('tr');
        expect(slow_row).toHaveStyle({ color: 'rgb(255, 165, 0)' }); // Check row is orange
        expect(within(slow_row).getByText('slow')).toBeInTheDocument();
        expect(within(slow_row).getByText('200')).toBeInTheDocument();
        expect(within(slow_row).getByText('5000')).toBeInTheDocument();

        const down_row = screen.getByText('2025-11-13 05:00').closest('tr');
        expect(down_row).toHaveStyle({ color: 'rgb(255, 0, 0)' }); // Check row is red
        expect(within(down_row).getByText('down')).toBeInTheDocument();
        expect(within(down_row).getByText('-')).toBeInTheDocument();
        expect(within(down_row).getByText('10150')).toBeInTheDocument();
    });

    it('shows error on Detail View fetch failure', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

        render(<PingboardClient loadedServices={[makeService(1)]} loadError={null} />);
        fireEvent.click(screen.getByRole('button', { name: 'Detail View' }));

        await waitFor(() => {
            expect(screen.getByText('Failed to get Detail View, please try again.')).toBeInTheDocument();
        });
    });
})

