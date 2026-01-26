# Story: Milestone 1 - Navigation and Routing

**Epic:** Core Platform Foundation
**Priority:** Medium
**Status:** Not Started
**Story ID:** MS1-003

## Story Summary

Implement navigation and routing for the syftly.ai application, including routes for the feed page, specific topic views, and proper navigation links. Ensure users can easily navigate between different sections of the application.

## User Story

As a user, I want to navigate through the application easily, so that I can access different features like the main feed, specific topic views, and followed topics.

## Acceptance Criteria

1. Home page route exists at `/`
2. Feed page route exists at `/feed`
3. Topic-specific feed route exists at `/feed/:topic`
4. Navigation bar is visible on all pages
5. Navigation includes links to Home and Feed
6. Clicking navigation links updates URL without page reload
7. URL parameters are correctly parsed (e.g., topic from `/feed/:topic`)
8. Back/forward browser navigation works correctly
9. 404 page exists for invalid routes
10. Followed topics are accessible from navigation

## Tasks

### Task 1: Route Configuration
- [ ] Review existing routes in `/frontend/src/App.jsx`
- [ ] Add route for Home page: `/`
- [ ] Add route for Feed page: `/feed`
- [ ] Add route for Topic feed: `/feed/:topic`
- [ ] Add 404 route for invalid URLs
- [ ] Ensure routes are properly ordered (specific routes before generic)
- [ ] Test all routes load correctly

### Task 2: Navigation Component
- [ ] Create `/frontend/src/components/Navbar.jsx`:
  - Display app logo/name: "syftly.ai"
  - Add navigation link: "Home" → `/`
  - Add navigation link: "Feed" → `/feed`
  - Responsive design for mobile (hamburger menu if needed)
  - Sticky or fixed position on top
- [ ] Style navigation bar with consistent branding
- [ ] Add active state for current page
- [ ] Ensure navigation is visible on all pages

### Task 3: Home Page Updates
- [ ] Update `/frontend/src/pages/index.jsx` or create `/frontend/src/pages/Home.jsx`
- [ ] Add hero section with app description
- [ ] Add call-to-action: "Explore News by Topic" button → `/feed`
- [ ] Display featured followed topics (if any)
- [ ] Show recent or trending topics (optional)
- [ ] Ensure home page loads quickly

### Task 4: Feed Page Routing
- [ ] Update `/frontend/src/pages/Feed.jsx`:
  - Handle route parameter `:topic`
  - If topic provided, auto-fetch feed for that topic
  - If no topic, show search interface
  - Update URL when user searches for topic
  - Maintain state during navigation
- [ ] Implement redirect from `/feed` to `/feed/:topic` when search is performed
- [ ] Test URL updates: `browserHistory.push(/feed/${topic})`

### Task 5: Followed Topics Navigation
- [ ] Add "Followed Topics" section to navbar or sidebar
- [ ] Create dropdown or sidebar for followed topics
- [ ] Implement click handler to navigate to `/feed/:topic`
- [ ] Update followed topics list in real-time
- [ ] Handle empty state: "No topics followed"

### Task 6: URL State Management
- [ ] Implement URL parameter parsing
- [ ] Extract topic from URL path
- [ ] Handle URL encoding/decoding (e.g., "ISRO launches")
- [ ] Sync URL state with component state
- [ ] Test special characters in topic names

### Task 7: Browser Navigation
- [ ] Test back button: navigate from `/feed/elections` to `/feed`
- [ ] Test forward button: navigate back to `/feed/elections`
- [ ] Test browser refresh: page state should persist or gracefully reload
- [ ] Test direct URL access: user can bookmark and visit `/feed/ISRO`

### Task 8: 404 Page
- [ ] Create `/frontend/src/pages/NotFound.jsx`
- [ ] Display "Page Not Found" message
- [ ] Add "Return Home" button
- [ ] Style to match app design
- [ ] Test invalid URLs redirect to 404 page

### Task 9: Navigation UX Improvements
- [ ] Add loading indicators during navigation
- [ ] Add smooth page transitions (optional)
- [ ] Update document title based on current page/route
- [ ] Add breadcrumbs for topic pages (optional)

### Task 10: Testing
- [ ] Test all routes load correctly
- [ ] Test navigation links work
- [ ] Test URL parameter handling
- [ ] Test browser back/forward navigation
- [ ] Test direct URL access
- [ ] Test 404 page
- [ ] Test followed topics navigation
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

## Dev Notes

### Route Structure

```jsx
// App.jsx route configuration
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/feed" element={<Feed />} />
  <Route path="/feed/:topic" element={<Feed />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Navigation Component

```jsx
// Navbar.jsx structure
<Navbar>
  <Logo>syftly.ai</Logo>
  <NavLinks>
    <NavLink to="/">Home</NavLink>
    <NavLink to="/feed">Feed</NavLink>
  </NavLinks>
  <FollowedTopicsDropdown>
    {/* List of followed topics */}
  </FollowedTopicsDropdown>
</Navbar>
```

### URL Management

```jsx
// Feed.jsx - Extract topic from URL
import { useParams } from 'react-router-dom';

const Feed = () => {
  const { topic } = useParams();

  useEffect(() => {
    if (topic) {
      fetchTopicFeed(topic);
    }
  }, [topic]);

  // Update URL when user searches
  const handleSearch = (searchTopic) => {
    navigate(`/feed/${encodeURIComponent(searchTopic)}`);
  };
};
```

### Page Titles

```jsx
// Update document title based on route
useEffect(() => {
  if (topic) {
    document.title = `${topic} - syftly.ai`;
  } else {
    document.title = 'Feed - syftly.ai';
  }
}, [topic]);
```

### SEO Considerations

- Add meta tags for each page (optional, for future)
- Ensure meaningful page titles
- Use semantic HTML
- Add structured data for topic pages (future)

## Dependencies

- MS1-001: LangGraph-Based News Synthesis (for Feed page functionality)
- React Router (if not already installed)
- MS1-002: Follow Feature (for followed topics navigation)

## Blockers

- None known

## Out of Scope

- Mobile-specific navigation patterns (future)
- Advanced routing features (route guards, lazy loading)
- Sitemap generation
- Multi-language routing

## Notes

This story focuses on setting up basic navigation and routing. More advanced features like lazy loading, route guards, and complex navigation patterns can be added in future milestones.

Ensure that the routing implementation is flexible enough to accommodate future features like user authentication, different user roles, and additional pages (profile, settings, etc.).
