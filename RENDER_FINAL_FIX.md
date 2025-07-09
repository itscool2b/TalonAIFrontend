# RENDER FINAL DATABASE FIX

## ✅ USE THIS EXACT CONNECTION STRING IN RENDER:

```
DATABASE_URL=postgres://postgres:10715Royal!@db.kzsfexkobshtffdwdpmb.supabase.co:6543/postgres
```

## 🎯 Why This Will Work:

1. **Port 6543** - Same as local (which works perfectly)
2. **Direct connection** - No pooler complications
3. **Tables already created** - Connection has worked before

## 📋 Steps:

1. Go to **Render Dashboard**
2. **Environment** → Update `DATABASE_URL` to the string above
3. **Save Changes**
4. **Manual Deploy** → **Deploy latest commit**

## 🔧 If IPv6 Issues Persist:

Add this environment variable in Render:
```
NODE_OPTIONS=--dns-result-order=ipv4first
```

This forces Node.js to prefer IPv4 addresses.

## ✅ Success Indicators:

- No more `ENETUNREACH` errors
- Chat messages send successfully
- Database operations work

That's it. This is the final fix. 