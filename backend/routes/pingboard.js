import express from 'express';
const router = express.Router();
import { query } from '../db.js';

// Check individual service endpoint
async function checkService(service) {
    const startTime = Date.now();

    console.log(`Checking: ${service.url}`);
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(service.url, { 
            signal: controller.signal,
            headers: {
                'User-Agent': 'API-Monitor/1.0' // Good practice for APIs
            }
        });

        console.log(`Response status: ${response.status}`);
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        let status = 'up';
        if (responseTime > 2000) status = 'slow'; // 2+ seconds = slow
        if (!response.ok) status = 'down';

        // Save successful check
        await query(
            `INSERT INTO service_checks 
             (service_id, status_code, response_time, status) 
             VALUES ($1, $2, $3, $4)`,
            [service.id, response.status, responseTime, status]
        );

        return { success: true, responseTime, status: response.status };

    } catch (error) {
        const responseTime = Date.now() - startTime;

        console.error(`Fetch error details:`, error);
        
        // Save failed check
        await query(
            `INSERT INTO service_checks 
             (service_id, status_code, response_time, status, error_message) 
             VALUES ($1, $2, $3, $4, $5)`,
            [service.id, null, responseTime, 'down', error.message]
        );

        return { success: false, error: error.message };
    }
}

// Return summary info on all registered services
router.get('/services', async (req, res) => {
    try {
        const services = await query(`
            SELECT ms.*, 
                COUNT(sc.id) as total_checks,
                AVG(CASE WHEN sc.status = 'up' THEN 1 ELSE 0 END) * 100 as uptime_percentage,
                AVG(sc.response_time) as avg_response_time,
                MIN(sc.checked_at) as first_check,
                MAX(sc.checked_at) as last_check
            FROM monitored_services ms
            LEFT JOIN service_checks sc ON ms.id = sc.service_id
            WHERE ms.is_active = true
            GROUP BY ms.id
            ORDER BY ms.id
        `);
        
        res.json(services.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Return info on individual checks for a service
router.get('/:id/checks', async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 50 } = req.query;
        
        const checks = await query(
            `SELECT * FROM service_checks 
             WHERE service_id = $1 
             ORDER BY checked_at DESC 
             LIMIT $2`,
            [id, limit]
        );
        
        res.json(checks.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check all registered services
export async function runAllChecks() {
    try {
        const services = await query(
            'SELECT * FROM monitored_services WHERE is_active = true'
        );
        
        for (const service of services.rows) {
            console.log(`Checking ${service.name}...`);
            await checkService(service);
            // Small delay between checks to be respectful
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.error('Error running checks:', error);
    }
}

export default router;
