# Coding Conventions

**Analysis Date:** 2026-02-03

## Naming Patterns

**Files:**
- React Components: `PascalCase.jsx` (e.g., `Feed.jsx`, `FollowButton.jsx`, `Landing.jsx`)
- Utilities: `camelCase.js` (e.g., `safeGet.js`, `format.js`, `storage.js`)
- Services/Controllers: `camelCase.js` (e.g., `feed.service.js`, `feed.controller.js`)
- Models: `PascalCase.js` (e.g., `TopicSummary.js`, `FollowedTopic.js`, `Evidence.js`)
- Routes: `resource.routes.js` (e.g., `feed.routes.js`, `situation.routes.js`)
- Test files: `*.test.js` or `*.spec.js` (intended pattern, not yet implemented)

**Functions:**
- camelCase: `handleSearch()`, `loadFollowedTopics()`, `getFeedItems()`
- Async functions: camelCase with `async` keyword: `async function getTopicSynthesis(topic)`
- Event handlers: `handle` + action: `handleSubmit()`, `handleClick()`, `handleTopicSelect()`

**Variables:**
- camelCase: `searchQuery`, `followedTopics`, `loading`, `error`
- Boolean variables: `isFollowing`, `isActive`, `isVisible`
- Constants: `UPPER_SNAKE_CASE`: `API_BASE_URL`, `TARGET_DATE`

**Types:**
- No TypeScript used - JavaScript (ES6+)
- JSDoc comments provide type documentation
- Mongoose schemas define data structure for backend models

## Code Style

**Formatting:**
- Tool: ESLint (frontend only, `frontend/eslint.config.js`)
- No Prettier configuration found
- Indentation: 4 spaces (observed in most files)
- Line length: No strict limit, generally <120 chars

**Linting:**
- Frontend: ESLint with flat config (`eslint.config.js`)
  - Extends: `js.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
  - Custom rule: `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]`
  - Command: `npm run lint`
- Backend: No linting configured (missing from `package.json` scripts)
- Lint passes with minor React warnings about useEffect patterns and unused variables

## Import Organization

**Frontend (React):**
1. React hooks and imports from `react`
2. Third-party library imports (e.g., `axios`, `react-router-dom`)
3. Local component imports (from `./components`, `./pages`)
4. Local utility imports (from `./utils`, `./services`)
5. Asset imports (if any)

```javascript
// Typical import order in frontend/src/pages/Feed.jsx
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Local imports (usually with explicit .js or .jsx extensions)
```

**Backend (Node.js/Express):**
1. Node.js built-ins (e.g., `path`, `fs`)
2. Third-party packages (e.g., `express`, `mongoose`, `dotenv`)
3. Local imports with relative paths and explicit `.js` extensions
4. ES module syntax: `import ... from '...'` (type: "module" in package.json)

```javascript
// Typical import order in backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import config from './config/config.js';
import routes from './routes/index.js';
```

**Path Aliases:**
- No path aliases configured (imports use relative paths)
- All local imports use explicit file extensions: `.js` or `.jsx`

## Error Handling

**Patterns:**
- Frontend uses try-catch with state-based error display
- Backend uses custom `ApiError` class and centralized error middleware
- Error responses standardized via helper functions

**Frontend Error Handling:**
```javascript
try {
  const response = await axios.get(`${API_BASE_URL}/feed/topic`, {
    params: { topic: searchQuery }
  });
  if (response.data.success) {
    setSynthesis(response.data.data);
  } else {
    setError(response.data.error || 'Failed to generate synthesis');
  }
} catch (err) {
  setError(
    err.response?.data?.message ||
    err.message ||
    'Failed to connect to server'
  );
} finally {
  setLoading(false);
}
```

**Backend Error Handling:**
- Custom `ApiError` class: `new ApiError(message, statusCode)` in `backend/middleware/errorHandler.js`
- Async handler wrapper eliminates try-catch boilerplate:
  ```javascript
  import asyncHandler from '../utils/asyncHandler.js';

  export const getFeed = asyncHandler(async (req, res) => {
    const feedItems = await getFeedItems();
    success(res, feedItems, 'Feed retrieved successfully');
  });
  ```
- Global error middleware in `backend/middleware/errorHandler.js`
- Handles Mongoose validation errors, cast errors, and duplicate key errors

**API Error Responses:**
- Standardized format using `success()` and `error()` helpers in `backend/utils/apiResponse.js`
- Success: `{ success: true, message, data }`
- Error: `{ success: false, message, errors? }`
- Development mode includes stack trace in error responses

## Logging

**Framework:** Custom logger utility (`backend/utils/logger.js`)

**Patterns:**
```javascript
import logger from '../utils/logger.js';

logger.error('Error message', { stack, url, method });
logger.warn('Warning message', meta);
logger.info('Info message', meta);
logger.debug('Debug message', meta);
```

**Levels:**
- `error` (0): Critical errors requiring attention
- `warn` (1): Warning conditions
- `info` (2): General informational messages
- `debug` (3): Detailed debugging information

**Configuration:**
- Environment variable: `LOG_LEVEL` (default: `debug`)
- All messages logged to console with timestamp: `[ISO8601] [LEVEL] message meta`

**When to log:**
- API errors: Logged in error middleware
- Service-level errors: Logged with context
- Important events: Startup, database connection
- Debug information: In development mode

## Comments

**When to Comment:**
- Component/file purpose at top of files
- Complex algorithm explanations
- API endpoint documentation (route comments)
- Schema definitions and field purposes
- When code requires additional context not obvious from implementation

**JSDoc/TSDoc:**
- Used extensively for function documentation
- Includes `@param`, `@returns`, `@example` tags
- Format:
  ```javascript
  /**
   * Safely get a nested property from an object
   * @param {object} obj - Source object
   * @param {string} path - Dot-notation path (e.g., 'user.profile.name')
   * @param {any} defaultValue - Value to return if path not found
   * @returns {any} Value at path or default
   */
  export function safeGet(obj, path, defaultValue = undefined) { ... }
  ```

**Route Documentation:**
```javascript
/**
 * @desc    Get topic-based news synthesis using LangGraph
 * @route   GET /api/feed/topic
 * @access  Public
 * @query   topic - The topic to search and synthesize
 */
```

## Function Design

**Size:**
- No strict size limit enforced
- Large components (e.g., `Landing.jsx` at 1168 lines) are acceptable when complex
- Utility functions typically 10-50 lines
- Services/functions 20-100 lines

**Parameters:**
- Destructuring used for complex objects: `const { topic } = req.body;`
- Default values for optional parameters: `async (topic, sessionId = 'default')`
- Named exports preferred for controllers and services

**Return Values:**
- Frontend: Use state setters (`setLoading`, `setError`, `setSynthesis`)
- Backend controllers: No explicit returns (use response helpers)
- Backend services: Return objects or throw errors
- API responses: Use `success(res, data, message)` and `error(res, message, statusCode)` helpers

## Module Design

**Exports:**
- Frontend: `export default function Component()` for components, `export function` for utilities
- Backend: `export const functionName` for controllers, `export default` for models/services
- Named exports preferred for clarity in imports

**Barrel Files:**
- `frontend/src/components/ui/index.js` - Exports UI components
- `frontend/src/hooks/index.js` - Exports custom hooks
- `frontend/src/utils/index.js` - Exports utilities
- `backend/models/index.js` - Barrel export for all models
- Pattern: `export { default as Name } from './file.js'`

**Defensive Programming:**
- Frontend: `safeGet()` utility for nested property access
- Validate API responses before using data
- Default values for optional parameters
- Backend: Mongoose schema validation
- Error handling for database operations

---

*Convention analysis: 2026-02-03*
