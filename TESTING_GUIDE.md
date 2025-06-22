# How to Test Real Database Authentication

## 📱 **Testing the Mobile App with Real Database**

### **Prerequisites**
1. ✅ PostgreSQL database running
2. ✅ Database schema migrated (`npm run db:push` in `/apps/database`)
3. ✅ Mobile app running (`npm run ios` in `/apps/mobile`)

### **Test Scenarios**

#### **1. New User Registration**
1. Open the mobile app
2. Navigate to **Welcome Screen** → Choose "Patient" or "Dentist"
3. Fill out the registration form completely
4. Submit registration
5. **Expected Result:** 
   - User created in PostgreSQL database
   - Automatic login after registration
   - Redirect to role-specific dashboard

#### **2. Existing User Login**
1. Go to Login screen
2. Use test credentials:
   - **Patient:** `test-patient@example.com` / `testpassword123`
   - **Dentist:** `test-dentist@example.com` / `dentistpassword123`
3. **Expected Result:**
   - Successful authentication against database
   - JWT token generated
   - Role-based navigation

#### **3. Session Persistence**
1. Login to the app
2. Enable "Remember Me" option
3. Close and reopen the app
4. **Expected Result:**
   - Automatic login without credentials
   - User session restored from stored JWT

#### **4. Token Refresh**
1. Login to the app
2. Wait for token to approach expiry (or simulate)
3. **Expected Result:**
   - Automatic token refresh in background
   - No interruption to user experience

### **Database Verification**

#### **Check User Creation**
```bash
cd /apps/database
npm run db:studio
```
Open http://localhost:5555 and verify:
- New users appear in `User` table
- Patient profiles in `Patient` table
- Dentist profiles in `Dentist` table
- Passwords are hashed (not plain text)

#### **Monitor Real-Time Activity**
Check console logs for:
```
🔐 [REAL AUTH] Attempting login for: user@example.com
📊 Using real database for login
✅ [REAL AUTH] Login successful for: user@example.com
```

### **Troubleshooting**

#### **If Registration Fails:**
1. Check database connection: `npm run db:push` in `/apps/database`
2. Verify user doesn't already exist
3. Check console for specific error messages

#### **If Login Fails:**
1. Verify user exists in database (Prisma Studio)
2. Check password was hashed correctly
3. Ensure JWT_SECRET is set in environment

#### **If App Falls Back to Mock:**
- Check console for: "⚠️ Real database not available, will use API fallback"
- This means database connection failed
- Verify PostgreSQL is running and DATABASE_URL is correct

### **Advanced Testing**

#### **Password Security Test**
1. Register a new user
2. Check database - password should be `salt:hash` format
3. Login with correct password - should succeed
4. Login with wrong password - should fail

#### **Role-Based Features**
1. Register as Patient - check Patient dashboard features
2. Register as Dentist - check Dentist dashboard features
3. Verify role-specific navigation and permissions

#### **Network Resilience**
1. Stop PostgreSQL database
2. Try to login - should fallback to API/mock gracefully
3. Restart database - should automatically detect and use real database

## 🔧 **Developer Commands**

### **Database Management**
```bash
cd /apps/database

# View data
npm run db:studio

# Reset database (careful!)
npm run db:reset

# Update schema
npm run db:push

# Generate fresh types
npm run db:generate
```

### **App Development**
```bash
cd /apps/mobile

# Run app
npm run ios

# Type check
npx tsc --noEmit

# Clear cache and restart
npx expo start --clear
```

### **Testing Database Services**
```bash
cd /apps/database

# Run tests
npm test

# Check health
npm run health-check
```

## 📊 **Monitoring & Logs**

### **What to Look For:**
✅ **Successful Authentication:**
```
🔐 [REAL AUTH] Attempting login for: user@example.com
📊 Using real database for login
✅ [REAL AUTH] Login successful for: user@example.com
```

✅ **Database Health:**
```
✅ Real database is healthy
Database health: ✅ Healthy
```

✅ **Registration Success:**
```
📝 [REAL AUTH] Attempting registration for: user@example.com as patient
✅ [REAL AUTH] Registration successful for: user@example.com
```

❌ **Fallback to Mock:**
```
⚠️ Real database not available, will use API fallback
🎭 MOCK: Attempting login for: user@example.com
```

## 🎉 **Success Indicators**

Your real database authentication is working when you see:
1. ✅ Console shows "[REAL AUTH]" messages
2. ✅ New users appear in Prisma Studio
3. ✅ Passwords are hashed in database
4. ✅ JWT tokens are generated and validated
5. ✅ Role-based navigation works correctly
6. ✅ Session persistence across app restarts

## 🚀 **Next Development Steps**

Once authentication is verified working:
1. **Enhance Dashboards** - Connect to real user data
2. **Add Features** - Appointments, health records, file uploads
3. **Improve UX** - Loading states, error handling, offline support
4. **Security** - Rate limiting, account verification, password reset
