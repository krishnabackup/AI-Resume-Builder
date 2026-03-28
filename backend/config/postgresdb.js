import { Pool } from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';

// Force Node.js to prioritize IPv4 lookups. 
// This fixes the 'ETIMEDOUT 64:ff9b...' error when connecting to Supabase via IPv6.
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

export const pool = new Pool({
    connectionString : process.env.POSTGRESQL_URI,
    max: 10, // Limit active connections to prevent Supabase MaxClientsInSessionMode error
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 5000,
});


