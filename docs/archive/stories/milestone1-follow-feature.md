# Story: Milestone 1 - Follow Feature

**Epic:** Core Platform Foundation
**Priority:** Medium
**Status:** Completed
**Story ID:** MS1-002

## Story Summary

Implement the follow feature that allows users to follow topics of interest for future updates. Topics will be persisted in localStorage on the frontend and synced with the backend API.

## User Story

As a user, I want to follow interesting topics, so that I can quickly access them later and receive updates (in future milestones).

## Acceptance Criteria

1. User can click "Follow [Topic]" button on the feed page
2. Button toggles to "Following" when topic is followed
3. Button toggles back to "Follow [Topic]" when unfollowing
4. Followed topics are persisted in localStorage
5. Followed topics are synced with backend via POST `/api/follow`
6. Followed topics are displayed in a sidebar or dropdown menu
7. Clicking a followed topic loads the feed for that topic
8. Follow state persists across page refreshes
9. Backend stores followed topics per session/user
10. Unfollow functionality works correctly

## Tasks

### Task 1: Backend - Follow API Endpoint
- [x] Create or update `backend/controllers/feed.controller.js`
- [x] Implement POST `/api/follow` endpoint:
  - Accept body: { topic: string, action: 'follow' | 'unfollow' }
  - Validate topic parameter
  - Update FollowedTopic collection
  - Return success/failure response
- [x] Implement GET `/api/follow/list` endpoint:
  - Return list of followed topics for current session
  - Sort by most recent follow
- [x] Add error handling for duplicate follow attempts
- [x] Add error handling for unfollowing non-followed topics

### Task 2: Backend - Database Operations
- [x] Ensure `FollowedTopic` model exists (created in MS1-001):
  ```javascript
  {
    topic: String,
    sessionId: String,
    userId: String, // optional, for future auth
    createdAt: Date,
    isActive: Boolean
  }
  ```
- [x] Add method to follow a topic:
  - Check if already followed
  - Create new FollowedTopic record
  - Set isActive to true
- [x] Add method to unfollow a topic:
  - Find FollowedTopic record
  - Set isActive to false or delete record
- [x] Add method to list followed topics:
  - Query active FollowedTopic records
  - Sort by createdAt descending
- [x] Add proper indexing on topic and sessionId fields

### Task 3: Frontend - Follow Button
- [x] Update `/frontend/src/pages/Feed.jsx`
- [x] Add "Follow [Topic]" button below summary
- [x] Implement button state management:
  - Default: "Follow [Topic]"
  - When clicked: "Following [Topic]" (with checkmark icon)
- [x] Implement toggle logic:
  - Follow: Add to localStorage, call backend API
  - Unfollow: Remove from localStorage, call backend API
- [x] Add button styling to make follow state visually clear
- [x] Add loading state during API call

### Task 4: Frontend - Local Storage Management
- [x] Create `frontend/src/utils/storage.js` for localStorage operations:
  - `getFollowedTopics()`: Retrieve followed topics from localStorage
  - `addFollowedTopic(topic)`: Add topic to localStorage
  - `removeFollowedTopic(topic)`: Remove topic from localStorage
  - `isTopicFollowed(topic)`: Check if topic is followed
- [x] Implement localStorage format:
  ```javascript
  {
    followedTopics: [
      { topic: 'ISRO', followedAt: '2024-01-26T10:00:00Z' }
    ]
  }
  ```
- [x] Handle localStorage errors (e.g., quota exceeded, disabled)

### Task 5: Frontend - Followed Topics List
- [x] Create `/frontend/src/components/FollowedTopics.jsx`:
  - Display list of followed topics
  - Show in sidebar or dropdown
  - Each topic is clickable to load feed
- [x] Add "Unfollow" button next to each topic in list
- [x] Display topic count (e.g., "3 followed topics")
- [x] Handle empty state: "No topics followed yet"
- [x] Update list in real-time when topics are followed/unfollowed

### Task 6: Frontend - API Integration
- [x] Create API functions in `/frontend/src/api/feed.js`:
  - `followTopic(topic, action)` - POST to /api/follow
  - `getFollowedTopics()` - GET from /api/follow/list
- [x] Handle API errors gracefully
- [x] Show toast notifications for follow/unfollow actions
- [x] Sync localStorage with backend on app load

### Task 7: Frontend - Navigation
- [x] Update `/frontend/src/App.jsx`:
  - Add sidebar or dropdown menu
  - Include FollowedTopics component
  - Add visual indicator for follow button when topic is followed
- [x] Update routing:
  - Clicking followed topic navigates to `/feed/:topic`
  - Auto-fetch feed for clicked topic

### Task 8: Testing
- [x] Test follow functionality:
  - Click follow button
  - Verify button state changes
  - Verify topic appears in followed list
  - Verify localStorage updated
- [x] Test unfollow functionality:
  - Click unfollow button
  - Verify button state changes
  - Verify topic removed from followed list
  - Verify localStorage updated
- [x] Test persistence:
  - Follow a topic
  - Refresh page
  - Verify topic still followed
  - Verify button state correct
- [x] Test edge cases:
  - Follow same topic twice (should show already followed)
  - Unfollow non-followed topic (should handle gracefully)
  - Follow with special characters in topic name
  - Followed topic limit (if any)

## Dev Notes

### Frontend Component Structure

**Feed.jsx Updates:**
```jsx
// Add FollowButton component
<FollowButton
  topic={currentTopic}
  isFollowed={isFollowed}
  onFollow={handleFollow}
  onUnfollow={handleUnfollow}
/>

// FollowButton props:
// - topic: string
// - isFollowed: boolean
// - onFollow: () => void
// - onUnfollow: () => void
```

**FollowedTopics.jsx:**
```jsx
// Sidebar component showing followed topics
<Sidebar>
  <FollowedTopics
    topics={followedTopics}
    onTopicClick={loadTopicFeed}
    onUnfollow={handleUnfollow}
  />
</Sidebar>
```

### Backend API Endpoints

**POST /api/follow**
```json
// Request
{
  "topic": "ISRO",
  "action": "follow" // or "unfollow"
}

// Response (Success)
{
  "success": true,
  "message": "Topic followed successfully"
}

// Response (Error)
{
  "success": false,
  "message": "Topic already followed"
}
```

**GET /api/follow/list**
```json
// Response
{
  "topics": [
    {
      "topic": "ISRO",
      "followedAt": "2024-01-26T10:00:00Z"
    },
    {
      "topic": "elections",
      "followedAt": "2024-01-25T15:30:00Z"
    }
  ]
}
```

### Storage Keys

- localStorage key: `syftly_followedTopics`

### User Experience

- Follow button should be prominent but not intrusive
- Visual feedback when follow/unfollow action completes (toast notification)
- Followed topics list should be easily accessible
- Unfollow should require confirmation or have small target area to avoid accidental clicks

## Dependencies

- MS1-001: LangGraph-Based News Synthesis (for feed API)
- MS1-001: Backend routes setup

## Blockers

- None known

## Out of Scope

- User authentication (sessions used instead)
- Follow notifications (future milestone)
- Followed topic recommendations (future milestone)
- Follow categories or organization (future milestone)
- Sharing followed topics (future milestone)

## Notes

This feature uses localStorage for persistence in this milestone. User authentication will be added in a future milestone, at which point followed topics can be tied to user accounts instead of sessions.

## Dev Agent Record

### Agent Model Used
- Model: Claude (Anthropic)

### Debug Log References
- None

### Completion Notes
- All 8 tasks completed successfully
- Backend follow/unfollow API endpoints already existed (from MS1-001)
- FollowedTopic model methods fully implemented (MS1-004)
- Created localStorage utility functions for frontend
- Created frontend API client for follow operations
- FollowedTopics component created with dropdown display
- App.jsx updated with sidebar navigation
- Feed.jsx already had follow functionality integrated
- All localStorage operations handle errors gracefully

### File List
**Backend:**
- /backend/controllers/feed.controller.js - Follow/unfollow endpoints (already existed)
- /backend/routes/feed.routes.js - API routes (already existed)
- /backend/services/feed.service.js - Business logic for follow operations (already existed)

**Frontend Utils:**
- /frontend/src/utils/storage.js - LocalStorage operations (created)

**Frontend API:**
- /frontend/src/api/feed.js - API client functions (created)

**Frontend Components:**
- /frontend/src/components/FollowButton.jsx - Follow button component (created)
- /frontend/src/components/FollowedTopics.jsx - Followed topics list component (created)

**Frontend Pages:**
- /frontend/src/pages/Feed.jsx - Already has follow functionality (verified)
- /frontend/src/App.jsx - Updated with FollowedTopics sidebar (updated)

**Documentation:**
- /docs/stories/milestone1-follow-feature.md - Story file (updated)

### Change Log
- localStorage utility with session ID generation
- Frontend API client with error handling
- FollowButton component with loading states and visual feedback
- FollowedTopics component with empty state and unfollow functionality
- App.jsx updated with dropdown sidebar for followed topics
- Optimistic UI updates for follow/unfollow operations
- Proper error handling for localStorage operations
- Session-based following (no user auth yet)
