# Supabase IPv4 Connection Fix for Render

## Quick Fix - Update DATABASE_URL in Render

### 1. Get Your Pooler Connection String

Go to your Supabase Dashboard:
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection pooling** section
5. Make sure **Pool mode** is set to **Transaction**
6. Copy the **Connection string**

### 2. Format for Render

The pooler connection string should look like this:
```
postgresql://postgres.kzsfexkobshtffdwdpmb:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

For your project, with your password, it should be:
```
postgresql://postgres.kzsfexkobshtffdwdpmb:10715Royal!@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 3. Update Render Environment Variable

1. Go to your Render Dashboard
2. Select your web service
3. Go to **Environment** tab
4. Update `DATABASE_URL` to the pooler connection string above
5. Click **Save Changes**
6. **Deploy** → **Manual Deploy** → **Deploy latest commit**

### 4. Expected Result

You should see in the logs:
```
Attempting to connect to Supabase PostgreSQL...
DATABASE_URL format: postgresql://postgres....
✅ Connected to PostgreSQL successfully
Database tables created/verified
```

No more IPv6 errors or "Tenant not found" errors! 