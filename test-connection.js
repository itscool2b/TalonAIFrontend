require('dotenv').config();
const { Pool } = require('pg');
const { URL } = require('url');

// Function to convert IPv6 URL to IPv4 pooler URL
const convertToIPv4PoolerURL = (databaseUrl) => {
  try {
    const url = new URL(databaseUrl);
    
    // Check if the host is an IPv6 address (contains colons)
    if (url.hostname.includes(':') || url.hostname.startsWith('[')) {
      console.log('🔄 Detected IPv6 address, converting to IPv4 pooler URL...');
      
      // Extract the project reference from the username
      const projectRef = url.username.split('.')[1] || 'kzsfexkobshtffdwdpmb';
      
      // Construct the IPv4 pooler URL
      const ipv4Url = `postgres://postgres.${projectRef}:${url.password}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
      console.log('✅ Converted to IPv4 pooler URL');
      return ipv4Url;
    }
    
    return databaseUrl;
  } catch (error) {
    console.error('Error converting URL:', error);
    return databaseUrl;
  }
};

async function testConnection() {
  console.log('Testing database connection...\n');
  
  // Test with IPv6 URL
  const ipv6Url = 'postgres://postgres.kzsfexkobshtffdwdpmb:10715Royal!@2600:1f16:1cd0:3308:93f3:7335:e30b:8665:6543/postgres';
  console.log('Original IPv6 URL:', ipv6Url.substring(0, 50) + '...');
  
  const convertedUrl = convertToIPv4PoolerURL(ipv6Url);
  console.log('Converted URL:', convertedUrl.substring(0, 50) + '...\n');
  
  // Test actual connection
  try {
    const connectionString = process.env.SUPABASE_POOLER_URL || 
                           process.env.DATABASE_URL || 
                           'postgres://postgres.kzsfexkobshtffdwdpmb:10715Royal!@aws-0-us-west-1.pooler.supabase.com:6543/postgres';
    
    console.log('Testing connection with:', connectionString.substring(0, 50) + '...');
    
    const pool = new Pool({
      connectionString: convertToIPv4PoolerURL(connectionString),
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });
    
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    console.log('\n✅ Connection successful!');
    console.log('Database time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].db_version.split(' ')[0]);
    
    await pool.end();
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    if (error.code === 'ENETUNREACH') {
      console.error('\n💡 This is the IPv6 issue. The code fix will handle this automatically.');
    }
  }
}

testConnection(); 