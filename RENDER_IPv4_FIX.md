# Supabase IPv4 Connection Fix for Render

## Quick Fix - Update DATABASE_URL in Render

### 1. Use the Correct Pooler Connection String

For Render deployment, you need the **Transaction Mode Pooler** connection string. 

The correct format is:
```
postgres://postgres.kzsfexkobshtffdwdpmb:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

For your project:
```
postgres://postgres.kzsfexkobshtffdwdpmb:10715Royal!@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Important Notes:**
- Use port `6543` for transaction mode (best for serverless)
- Username format: `postgres.YOUR_PROJECT_REF` (note the dot)
- NO `?pgbouncer=true` parameter needed
- Use `postgres://` not `postgresql://`

### 2. Update Render Environment Variable

1. Go to your Render Dashboard
2. Select your web service
3. Go to **Environment** tab
4. Update `DATABASE_URL` to:
   ```
   postgres://postgres.kzsfexkobshtffdwdpmb:10715Royal!@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
5. Click **Save Changes**
6. **Deploy** → **Manual Deploy** → **Deploy latest commit**

### 3. Expected Result

You should see in the logs:
```
Attempting to connect to Supabase PostgreSQL...
DATABASE_URL format: postgres://postgres.kzs...
✅ Connected to PostgreSQL successfully
Database tables created/verified
```

No more "Tenant or user not found" errors! 