# Phase 1: Authentication & Profile - Research

**Researched:** February 3, 2026
**Domain:** JWT-based authentication with MongoDB + React
**Confidence:** HIGH

## Summary

Phase 1 requires implementing secure user authentication and profile management. The standard approach uses JWT (JSON Web Tokens) with an access/refresh token pattern, bcrypt for password hashing, MongoDB with Mongoose for data persistence, and React with Axios for frontend integration.

**Primary recommendation:** Use JWT with access/refresh token rotation (access: 15min, refresh: 7 days) stored in HTTP-only cookies for security, bcrypt with 10-12 rounds for password hashing, and Mongoose schemas with validation for user and profile data.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| jsonwebtoken | Latest (v9.x) | JWT signing/verification | Auth0-maintained, RFC 7519 compliant, supports HS256/RS256 |
| bcrypt | Latest (v6.x) | Password hashing | Battle-tested, built-in salt, CPU-intensive resists brute force |
| mongoose | Latest (v9.x) | MongoDB ODM | Industry standard for MongoDB, built-in validation, middleware |
| nodemailer | Latest | Email sending | Zero dependencies, TLS support, Ethereal testing |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| multer | Latest (v2.x) | File upload (avatar) | Handles multipart/form-data, memory/disk storage |
| axios | v1.x | HTTP client | Already in frontend, interceptors for auth headers |
| cookie-parser | Latest | Cookie parsing | For HTTP-only cookie read/write in Express |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| bcrypt | argon2 | Argon2 more memory-hard, bcrypt simpler/sufficient for web |
| JWT access/refresh | Session-based | JWT stateless/scales better, session needs Redis/store |
| MongoDB | PostgreSQL | NoSQL flexible schema for profile prefs, SQL if ACID needed |

**Installation:**
```bash
# Backend (in backend/package.json when created)
npm install jsonwebtoken bcrypt mongoose nodemailer multer cookie-parser

# Frontend (already has axios, just adding react hooks)
npm install axios
```

## Architecture Patterns

### Recommended Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT verification middleware
│   │   └── errorHandler.js     # Centralized error handling
│   ├── models/
│   │   ├── User.js            # User schema with password hash
│   │   └── Profile.js          # Profile schema (or embedded)
│   ├── routes/
│   │   ├── auth.js            # /api/auth routes
│   │   ├── profile.js         # /api/profile routes
│   │   └── upload.js           # Avatar upload route
│   ├── controllers/
│   │   ├── authController.js
│   │   └── profileController.js
│   ├── services/
│   │   ├── emailService.js     # Nodemailer wrapper
│   │   └── tokenService.js     # JWT generation/verification
│   └── app.js                 # Express app setup
frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.js     # React Context for auth state
│   ├── hooks/
│   │   └── useAuth.js         # Custom auth hook
│   ├── services/
│   │   └── api.js             # Axios instance with interceptors
│   ├── components/
│   │   └── auth/
│   │       ├── LoginForm.js
│   │       ├── SignupForm.js
│   │       └── PasswordReset.js
│   └── pages/
│       ├── Profile.js
│       └── VerifyEmail.js
```

### Pattern 1: JWT Access/Refresh Token Rotation

**What:** Access tokens expire quickly (15min), refresh tokens persist longer (7 days). On refresh, generate new refresh token and invalidate old one.

**When to use:** Any app requiring secure persistent login with revocation capability.

**Example:**

```javascript
// Source: https://github.com/auth0/node-jsonwebtoken
const jwt = require('jsonwebtoken');

// Generate access token (15min expiry)
const accessToken = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Generate refresh token (7 days expiry)
const refreshToken = jwt.sign(
  { userId: user._id, tokenVersion: user.tokenVersion },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Store refresh token in database for revocation
await RefreshToken.create({
  token: refreshToken,
  userId: user._id,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

// Refresh token rotation on renewal
async function refreshAccessToken(refreshToken) {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId);
  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken || storedToken.revoked) {
    throw new Error('Invalid refresh token');
  }

  // Revoke old token, issue new pair
  await RefreshToken.deleteOne({ _id: storedToken._id });
  user.tokenVersion += 1;
  await user.save();

  return generateTokens(user);
}
```

### Pattern 2: HTTP-Only Cookies for JWT Storage

**What:** Store JWTs in httpOnly cookies (inaccessible to JavaScript) to prevent XSS attacks.

**When to use:** All web apps requiring CSRF protection token or same-site cookies.

**Example:**

```javascript
// Source: https://github.com/expressjs/cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Set access token cookie on login
res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000 // 15 minutes
});

// Set refresh token cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Axios interceptor to include cookies automatically
axios.defaults.withCredentials = true;
```

### Pattern 3: Mongoose Schema with Virtuals & Middleware

**What:** Define User schema with password hashing middleware, virtual for profile.

**When to use:** All MongoDB applications requiring data consistency and validation.

**Example:**

```javascript
// Source: https://github.com/Automattic/mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  tokenVersion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for profile (can be embedded or separate)
userSchema.virtual('profile', {
  ref: 'Profile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 500
  },
  avatarUrl: String,
  synthesisPreferences: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);
```

### Pattern 4: React Context for Auth State

**What:** Centralize auth state and provide login/logout/refresh methods.

**When to use:** React apps needing auth state across multiple components.

**Example:**

```javascript
// Source: https://react.dev/reference/react
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data.user);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Anti-Patterns to Avoid

- **Storing JWTs in localStorage:** Vulnerable to XSS. Use httpOnly cookies instead.
- **Hardcoded JWT secrets:** Use environment variables. Rotate secrets periodically.
- **Sync bcrypt on server:** Blocks event loop. Use async `bcrypt.hash/compare`.
- **Sending passwords in URLs:** Use POST body, sensitive data never in URL.
- **Using MD5/SHA1 for passwords:** These are fast, broken hashes. Use bcrypt/scrypt.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JWT signing/verification | Custom crypto code | jsonwebtoken | Handles encoding, signing, verification, expiration checks |
| Password hashing | Custom salt/hash | bcrypt | Handles salt generation, rounds, timing attack resistance |
| Email sending | Custom SMTP code | nodemailer | Zero dependencies, TLS, attachment handling, testing |
| File upload parsing | Custom multipart parser | multer | Handles multipart/form-data, validation, storage abstraction |
| Form validation | Custom if-checks | express-validator/joi | Comprehensive validation, error formatting |

**Key insight:** Hand-rolling crypto or email handling inevitably introduces security vulnerabilities. Battle-tested libraries have addressed edge cases you haven't considered.

## Common Pitfalls

### Pitfall 1: Token Leak Through Error Responses

**What goes wrong:** Including JWT or sensitive data in error responses or stack traces exposed to clients.

**Why it happens:** Poor error handling middleware, debug mode in production.

**How to avoid:** Sanitize all error responses. Never include JWT, passwords, or internal paths in client-facing errors.

```javascript
// BAD - leaks internal details
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack // LEAKS INTERNAL STATE
  });
});

// GOOD - sanitized error
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      ...(isDev && { stack: err.stack }) // Only in dev
    }
  });
});
```

**Warning signs:** Seeing JWTs in browser console/network tab beyond initial login response.

### Pitfall 2: Race Condition in Token Refresh

**What goes wrong:** Multiple concurrent requests trigger multiple refresh attempts, causing token invalidation.

**Why it happens:** Client-side race condition, no request queuing during refresh.

**How to avoid:** Implement request queuing or use a single in-flight refresh promise.

```javascript
// Frontend - prevent concurrent refreshes
let refreshPromise = null;

async function getValidAccessToken() {
  if (refreshPromise) {
    return refreshPromise; // Return existing promise
  }

  refreshPromise = axios.post('/api/auth/refresh').finally(() => {
    refreshPromise = null; // Clear after complete
  });

  return refreshPromise;
}
```

**Warning signs:** Frequent "Invalid token" errors despite having valid refresh token.

### Pitfall 3: MongoDB Connection Buffering Issues

**What goes wrong:** Operations queued but never execute if connection never established.

**Why it happens:** Mongoose buffers commands until connection, but silent failures can occur.

**How to avoid:** Explicit connection error handling and connection monitoring.

```javascript
// GOOD - proper connection handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Monitor connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
```

**Warning signs:** No errors but database writes never complete.

### Pitfall 4: Email Verification Token Reuse

**What goes wrong:** Using same verification token for multiple requests or not expiring tokens.

**Why it happens:** Not generating fresh tokens per request, no expiration on token.

**How to avoid:** Generate unique token per request, set expiration.

```javascript
// GOOD - unique token per request
const crypto = require('crypto');

function generateEmailToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Store with expiration
user.emailVerificationToken = generateEmailToken();
user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
await user.save();
```

**Warning signs:** Email verification links work indefinitely or for any user.

## Code Examples

### Signing Up with Email Verification

```javascript
// backend/controllers/authController.js
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');

async function signup(req, res) {
  const { email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  // Create user (password hashed in pre-save middleware)
  const user = new User({ email, password });
  user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  // Send verification email
  await emailService.sendVerificationEmail(user.email, user.emailVerificationToken);

  res.status(201).json({
    message: 'Signup successful. Please check your email to verify.'
  });
}

// backend/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Verify your email',
    html: `
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `
  });
}
```

### Password Reset Flow

```javascript
// Request password reset
async function requestPasswordReset(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal whether email exists (security)
    return res.json({ message: 'If email exists, reset link sent.' });
  }

  user.passwordResetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  await user.save();

  await emailService.sendPasswordResetEmail(user.email, user.passwordResetToken);

  res.json({ message: 'Password reset link sent if email exists.' });
}

// Reset password with token
async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  user.password = newPassword; // Will be hashed by pre-save middleware
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful.' });
}
```

### Avatar Upload with Multer

```javascript
// backend/routes/upload.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route
router.post('/avatar',
  requireAuth, // Custom middleware to verify JWT
  upload.single('avatar'),
  async (req, res) => {
    const userId = req.user._id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await Profile.findOneAndUpdate(
      { userId },
      { avatarUrl },
      { upsert: true }
    );

    res.json({ avatarUrl });
  }
);
```

### Axios Interceptor for Automatic Token Refresh

```javascript
// frontend/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true // Include cookies
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        isRefreshing = false;
        onRefreshed(data.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Redirect to login or dispatch logout action
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-----------------|--------------|--------|
| bcrypt v4.x | bcrypt v6.x | 2023 | Native pre-built binaries, better Node 18+ support |
| mongoose v5.x | mongoose v9.x | 2025 | Better TypeScript support, removed deprecated APIs |
| nodemailer (v6) | nodemailer v6+ | Ongoing | Zero runtime dependencies since v3 |
| Multer v1.x | Multer v2.x | 2025 | Enhanced error handling, better ESM support |

**Deprecated/outdated:**
- **express-session:** Use JWT + httpOnly cookies instead for better scalability
- **cookie-session:** Same as above, JWT is more flexible for SPA/mobile
- **md5/sha1 hashing:** Replaced by bcrypt/scrypt for password hashing
- **jsonwebtoken v8.x:** Upgrade to v9.x for latest security patches

## Open Questions

Things that couldn't be fully resolved:

1. **Email Provider Choice**
   - What we know: Nodemailer supports any SMTP server
   - What's unclear: Which email provider (SendGrid, Mailgun, AWS SES, etc.)
   - Recommendation: Use Ethereal for development, defer production choice to deployment phase

2. **Image Storage for Avatars**
   - What we know: Multer handles upload, can store locally
   - What's unclear: Use local disk storage or cloud storage (S3, Cloudinary)?
   - Recommendation: Start with local storage for MVP, consider cloud storage for production

3. **CSRF Protection**
   - What we know: httpOnly cookies + sameSite=strict provides basic protection
   - What's unclear: Implement CSRF token for double-submit cookie pattern?
   - Recommendation: Implement CSRF tokens as secondary protection measure

## Sources

### Primary (HIGH confidence)

- **jsonwebtoken (GitHub: auth0/node-jsonwebtoken)** - JWT signing, verification, expiration handling, token examples
- **bcrypt (GitHub: kelektiv/node.bcrypt.js)** - Password hashing, async API, salt rounds, security considerations
- **nodemailer (nodemailer.com)** - Email sending, SMTP configuration, Ethereal testing, attachment handling
- **multer (GitHub: expressjs/multer)** - File upload handling, storage engines, file filtering
- **mongoose (GitHub: Automattic/mongoose)** - Schema definition, validation, middleware, virtuals
- **MongoDB Node.js Driver (GitHub: mongodb/node-mongodb-native)** - Connection handling, error types
- **Express API Reference (expressjs.com)** - Middleware, routing, error handling
- **JWT Introduction (jwt.io)** - JWT structure, best practices, security considerations
- **React Docs (react.dev)** - Conditional rendering, Context API, hooks
- **Vite Docs (vitejs.dev)** - Build setup, configuration
- **Axios (GitHub: axios/axios)** - Interceptors, request config, error handling

### Secondary (MEDIUM confidence)

None - all findings from official sources.

### Tertiary (LOW confidence)

None - all findings from official sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All from official documentation and GitHub repositories
- Architecture: HIGH - Patterns based on official docs and widely-adopted practices
- Pitfalls: HIGH - All verified against official sources and security best practices

**Research date:** February 3, 2026
**Valid until:** March 5, 2026 (30 days - stable domain, unlikely major changes)
