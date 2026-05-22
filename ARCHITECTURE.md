# Rakshak AI - Architecture Explanation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [API Architecture](#api-architecture)
9. [Offline Architecture](#offline-architecture)
10. [Security Architecture](#security-architecture)

---

## System Overview

Rakshak AI is a Progressive Web Application (PWA) built with a modern, serverless architecture designed for emergency response scenarios. The system prioritizes offline functionality, battery efficiency, and real-time performance.

### Core Principles

- **Offline-First:** Works without internet connection
- **Battery-Optimized:** Minimal GPS polling and efficient caching
- **Real-Time:** Live location tracking and emergency notifications
- **Frictionless:** Zero cognitive load during emergencies
- **Privacy-First:** Anonymous sessions, no login required

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Fast UI development and hot reload |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Animations** | Framer Motion | Smooth, performant animations |
| **Mapping** | Leaflet.js | Interactive maps with OpenStreetMap |
| **Backend** | Supabase (PostgreSQL) | Real-time database and authentication |
| **Storage** | IndexedDB | Client-side offline storage |
| **PWA** | Service Workers | Offline caching and background sync |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Home   │  │   SOS    │  │ Guardian │  │ Nearby   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Emergency │  │Path Rec. │  │TrackTrip │  │NearbyHelp│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Component Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Common     │  │   Emergency   │  │    Layout    │       │
│  │ Components   │  │ Components   │  │ Components   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │     Map      │  │   AI Safety   │  │   Offline    │       │
│  │ Components   │  │ Components   │  │ Components   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Hooks Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ useGeolocation│  │ useEmergency │  │ useAISafety  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │useMovementDet│  │ useTripTrack │  │useOfflineMode│       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Context Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              NightModeContext                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Services Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   API Services│  │   AI Services │  │  Offline Svc  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Supabase Client│  │ Safety Monitor│  │ Trip Sharing │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Storage Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  IndexedDB   │  │   Service    │  │   Supabase   │       │
│  │  (Offline)   │  │  Worker Cache│  │  (Online)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ OpenStreetMap│  │ Overpass API │  │  Supabase    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Structure

The frontend follows a component-based architecture with clear separation of concerns:

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Input.jsx
│   ├── emergency/        # Emergency-specific components
│   │   ├── SwipeToConfirm.jsx
│   │   └── CountdownModal.jsx
│   ├── layout/          # Layout components
│   │   └── BottomNav.jsx
│   └── map/             # Map-related components
│       └── MapContainer.jsx
├── pages/               # Page components
│   ├── Home.jsx
│   ├── SOS.jsx
│   ├── Emergency.jsx
│   ├── Guardian.jsx
│   ├── Nearby.jsx
│   ├── NearbyHelp.jsx
│   ├── PathRecovery.jsx
│   └── TrackTrip.jsx
└── App.jsx              # Root component
```

### Component Design Patterns

**1. Container/Presentational Pattern:**
- Container components handle logic and state
- Presentational components handle UI only
- Improves reusability and testing

**2. Composition Pattern:**
- Small, focused components
- Compose larger components from smaller ones
- Promotes code reuse

**3. Custom Hooks Pattern:**
- Logic extracted into custom hooks
- Components use hooks for functionality
- Separates concerns

---

## Backend Architecture

Rakshak AI uses a serverless architecture with Supabase as the backend:

### Supabase Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Supabase Platform                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PostgreSQL   │  │   Real-time   │  │   Storage     │  │
│  │   Database   │  │   Engine      │  │   Service     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Auth       │  │   Edge        │  │   Functions   │  │
│  │   Service    │  │   Functions   │  │   (Optional)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Database Schema

**Tables:**
- `emergency_events` - SOS events with visual triage
- `location_history` - GPS breadcrumb trail
- `trip_sharing` - Trip sharing sessions
- `guardians` - Emergency contact information
- `safety_monitoring` - Safety alerts and monitoring

**Indexes:**
- Session ID indexes for user data
- Location indexes for spatial queries
- Timestamp indexes for time-based queries
- Status indexes for filtering

**Policies:**
- Row-Level Security (RLS) for data isolation
- Public insert policies for anonymous sessions
- Public read policies for tracking links

---

## Data Flow

### Emergency Event Flow

```
User Action (SOS Swipe)
        ↓
Component Handler
        ↓
useEmergency Hook
        ↓
Emergency Service
        ↓
Supabase Client
        ↓
PostgreSQL Database
        ↓
Real-time Broadcast
        ↓
Guardian Notifications
```

### Location Tracking Flow

```
GPS Update (1 min interval)
        ↓
useGeolocation Hook
        ↓
Location Tracker Service
        ↓
Supabase Client
        ↓
PostgreSQL Database
        ↓
IndexedDB (Offline Cache)
        ↓
Real-time Subscription
        ↓
UI Update
```

### Offline Data Flow

```
Network Request
        ↓
Service Worker Intercept
        ↓
Cache Check
        ↓
┌─────────────┬─────────────┐
│ Cache Hit   │ Cache Miss  │
├─────────────┼─────────────┤
│ Return      │ Fetch from  │
│ Cached Data │ Network     │
└─────────────┴─────────────┘
        ↓
IndexedDB Storage
```

---

## Component Architecture

### Common Components

**Button Component:**
- Variants: primary, secondary, danger, success, ghost
- Sizes: sm, md, lg
- Supports night mode styling
- Animation hooks for feedback

**Card Component:**
- Reusable container component
- Border variants for different contexts
- Hover effects
- Night mode support

### Emergency Components

**SwipeToConfirm:**
- Haptic feedback integration
- Visual progress indicator
- Prevents accidental triggers
- Accessibility support

**CountdownModal:**
- 30-second countdown timer
- Auto-trigger on timeout
- Confirm and ignore buttons
- Smooth animations

### Layout Components

**BottomNav:**
- Responsive navigation
- Night mode filtering
- Active state indicators
- Glow animation for SOS

---

## State Management

### Current Approach

Rakshak AI uses React's built-in state management:

**Local State:**
- useState for component-level state
- useEffect for side effects
- useCallback for memoized functions
- useMemo for memoized values

**Context API:**
- NightModeContext for global night mode
- Session management for anonymous sessions

**Custom Hooks:**
- useGeolocation for GPS data
- useEmergency for emergency logic
- useAISafety for AI intelligence
- useOfflineMode for network status

### State Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    State Management                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Local State  │  │  Context API  │  │ Custom Hooks │  │
│  │ (useState)   │  │ (Contexts)   │  │ (useX)       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  IndexedDB   │  │   Supabase   │  │   Service    │  │
│  │  (Offline)   │  │  (Online)    │  │   Worker     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Future State Management

For larger applications, consider:
- **Zustand:** Lightweight state management
- **Redux Toolkit:** For complex state needs
- **React Query:** For server state management
- **Jotai:** Atomic state management

---

## API Architecture

### Service Layer

The API layer is organized by domain:

```
src/services/
├── api/
│   ├── emergency.js        # Emergency API calls
│   ├── location.js         # Location tracking API
│   ├── nearbySearch.js     # POI search API
│   ├── sunsetDetection.js  # Sunset calculation
│   └── supabase/
│       └── client.js       # Supabase client
├── ai/
│   ├── riskScoreCalculator.js  # Risk assessment
│   └── aiSafetyEngine.js      # AI intelligence
└── offline/
    ├── offlineCache.js      # Cache management
    └── offlineManager.js     # Offline coordination
```

### API Patterns

**1. Service Pattern:**
- Each domain has its own service
- Services encapsulate API logic
- Reusable across components

**2. Error Handling:**
- Try-catch blocks in all API calls
- User-friendly error messages
- Graceful degradation

**3. Caching Strategy:**
- Service Worker for HTTP caching
- IndexedDB for offline storage
- Memory cache for frequently accessed data

---

## Offline Architecture

### Offline-First Design

Rakshak AI is designed to work offline:

```
┌─────────────────────────────────────────────────────────┐
│                  Offline Architecture                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Service      │  │ IndexedDB    │  │   Cache API   │  │
│  │  Worker      │  │  (Structured) │  │  (Blobs)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Request    │  │   Sync Queue  │  │  Conflict     │  │
│  │   Queue      │  │  (Retry)      │  │  Resolution   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Caching Strategy

**Service Worker Cache:**
- Static assets (JS, CSS, images)
- Map tiles (7-day expiration)
- API responses (1-hour expiration)

**IndexedDB Storage:**
- POI data (24-hour expiration)
- Location history (30-day retention)
- Emergency events (90-day retention)

**Cache Priorities:**
1. Critical: SOS trigger, emergency data
2. High: Location tracking, POI data
3. Medium: Map tiles, static assets
4. Low: Analytics, logs

---

## Security Architecture

### Current Security

**Authentication:**
- Anonymous sessions (no login required)
- Session IDs stored in localStorage
- No user credentials stored

**Data Security:**
- HTTPS required for production
- Supabase RLS policies
- No sensitive data in localStorage
- API keys in environment variables

**API Security:**
- Supabase anon key for client
- Service role key for server (if needed)
- Rate limiting (recommended)

### Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Security Layers                          │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   HTTPS      │  │   RLS        │  │   Input      │  │
│  │   (Transport) │  │   (Database) │  │ Validation  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   CSP        │  │   Rate       │  │   Session    │  │
│  │   Headers    │  │   Limiting   │  │   Management │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Recommendations

**For Production:**
- Implement proper authentication (Supabase Auth)
- Add CSRF protection
- Implement rate limiting
- Add Content Security Policy
- Enable HSTS
- Implement audit logging
- Add security headers

---

## Performance Architecture

### Optimization Strategies

**1. Code Splitting:**
- React.lazy() for route-based splitting
- Dynamic imports for heavy components
- Lazy load non-critical features

**2. Bundle Optimization:**
- Tree shaking for unused code
- Minification of JS/CSS
- Compression (gzip/brotli)
- CDN for static assets

**3. Rendering Optimization:**
- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for function memoization
- Virtual scrolling for long lists

**4. Network Optimization:**
- Debouncing API calls
- Throttling GPS updates
- Request batching
- Prefetching critical resources

---

## Scalability Architecture

### Horizontal Scaling

**Frontend:**
- CDN for static assets (Vercel/Netlify)
- Load balancing for multiple instances
- Edge functions for global distribution
- Database read replicas

**Backend:**
- Supabase auto-scaling
- Connection pooling
- Query optimization
- Index optimization

### Vertical Scaling

**Database:**
- Upgrade Supabase plan for more resources
- Add read replicas for read-heavy queries
- Implement partitioning for large tables
- Use materialized views for complex queries

**Application:**
- Optimize bundle size
- Implement caching strategies
- Use Web Workers for heavy calculations
- Optimize database queries

---

## Monitoring Architecture

### Application Monitoring

**Frontend:**
- Lighthouse CI for performance
- Sentry for error tracking
- Google Analytics for user analytics
- Custom logging for debugging

**Backend:**
- Supabase dashboard for database monitoring
- Query performance monitoring
- Storage usage tracking
- API usage analytics

### Logging Strategy

**Client-Side:**
- Error logging to console
- Critical errors to Sentry
- Performance metrics
- User interaction logging

**Server-Side:**
- Database query logs
- API access logs
- Error logs
- Performance logs

---

## Deployment Architecture

### Deployment Pipeline

```
┌──────────────┐
│  Development │
│  (Local)     │
└──────────────┘
        │
        ▼
┌──────────────┐
│   Testing    │
│  (Staging)   │
└──────────────┘
        │
        ▼
┌──────────────┐
│ Production   │
│  (Vercel)    │
└──────────────┘
```

### CI/CD Pipeline

**GitHub Actions:**
- Automated testing
- Build verification
- Lighthouse audit
- Automatic deployment on merge

**Environment Variables:**
- Separate configs for dev/staging/prod
- Secure secret management
- Environment-specific feature flags

---

## Technology Rationale

### Why React?

- **Component-Based:** Reusable UI components
- **Large Ecosystem:** Extensive library support
- **Fast Development:** Hot reload and fast refresh
- **Performance:** Virtual DOM for efficient rendering
- **Community:** Large community and resources

### Why Supabase?

- **Real-Time:** Built-in real-time subscriptions
- **Authentication:** Easy auth integration
- **Database:** PostgreSQL with RLS
- **Storage:** Built-in file storage
- **Free Tier:** Generous free tier for development

### Why Vite?

- **Fast Builds:** Lightning-fast HMR
- **Modern:** ES modules support
- **Optimized:** Production builds optimized
- **Plugins:** Extensive plugin ecosystem
- **Developer Experience:** Excellent DX

### Why Tailwind CSS?

- **Utility-First:** Rapid UI development
- **Customizable:** Easy customization
- **Small Bundle:** Purges unused styles
- **Responsive:** Built-in responsive utilities
- **Dark Mode:** Easy dark mode implementation

### Why Leaflet?

- **Lightweight:** Smaller than Google Maps
- **Open Source:** Free and customizable
- **Mobile-Friendly:** Works well on mobile
- **Plugins:** Extensive plugin ecosystem
- **Offline:** Works with offline tiles

---

## Future Architecture Improvements

### Short-Term (1-3 months)

- Add TypeScript for type safety
- Implement state management (Zustand)
- Add comprehensive testing
- Implement CI/CD pipeline
- Add performance monitoring

### Medium-Term (3-6 months)

- Implement proper authentication
- Add analytics dashboard
- Implement advanced caching
- Add A/B testing
- Implement feature flags

### Long-Term (6-12 months)

- Microservices architecture
- GraphQL API layer
- Advanced AI/ML integration
- Multi-region deployment
- Advanced security features

---

## Conclusion

Rakshak AI's architecture is designed for reliability, performance, and scalability. The offline-first approach ensures the app works in emergency situations, while the modern tech stack provides a solid foundation for future enhancements.

The architecture balances simplicity with functionality, making it easy to maintain and extend while delivering a robust emergency response solution.

---

## Version History

- **v1.0.0** - Initial architecture documentation
- **v1.1.0** - Added offline architecture details
- **v1.2.0** - Added security architecture
- **v1.3.0** - Added performance optimization details
