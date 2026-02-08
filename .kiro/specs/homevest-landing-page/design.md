# Design Document: Homevest Landing Page

## Overview

The Homevest Landing Page is a Next.js 16 App Router page component that serves as the application's entry point. It implements a mode selection interface where users choose between two distinct user journeys: first-time homebuyer or real estate investor. The design emphasizes simplicity, trust, and clear user guidance through a professional blue-themed interface.

**Initial Release Scope**: This implementation focuses exclusively on the homebuyer journey. The investor mode button is displayed for design completeness but is non-functional in the initial release.

### Key Design Principles

1. **Simplicity First**: Single-purpose page with minimal cognitive load
2. **Trust Through Design**: Professional aesthetics that inspire confidence in financial decisions
3. **Mobile-First Responsive**: Optimized for all device sizes
4. **Performance-Optimized**: Fast initial load with minimal JavaScript
5. **Accessibility-Compliant**: WCAG 2.1 AA standards

### Technology Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Fonts**: Geist Sans (primary), Geist Mono (monospace)
- **Authentication**: Firebase Auth (Google SSO) - integration point only
- **Database**: Firestore - integration point only
- **Deployment**: Vercel (optimized for Next.js)

## Architecture

### Component Hierarchy

```
LandingPage (page.tsx)
├── HeroSection
│   ├── Headline
│   ├── Subheadline
│   └── ModeSelectionCTAs
│       ├── HomebuyerCTA
│       └── InvestorCTA
└── (Optional) Footer
```

### File Structure

```
/src
  /app
    ├── page.tsx              # Landing page component (THIS FEATURE)
    ├── layout.tsx            # Root layout with fonts and metadata
    ├── globals.css           # Global styles and Tailwind imports
    /homebuyer
    │   └── page.tsx          # Homebuyer dashboard (integration point)
    /investor
        └── page.tsx          # Investor dashboard (integration point)
  /components
    /landing
      ├── HeroSection.tsx     # Hero section with headline/subheadline
      └── ModeSelector.tsx    # Mode selection CTAs component
    /ui
      └── Button.tsx          # Reusable button component (if needed)
  /lib
    /firebase
      ├── config.ts           # Firebase initialization (integration point)
      └── auth.ts             # SSO logic (integration point)
    /utils
      └── navigation.ts       # Client-side navigation helpers
```

### Routing Strategy

The landing page uses Next.js App Router with client-side navigation:

1. **Static Generation**: Landing page is statically generated at build time for optimal performance
2. **Client-Side Navigation**: Mode selection triggers client-side routing using `next/navigation`
3. **Route Handlers**: No API routes needed for this feature (authentication handled by dashboards)

### State Management

The landing page is intentionally stateless:

- **No Local State**: Mode selection immediately triggers navigation
- **No Global State**: User preferences stored in Firestore (handled by dashboard pages)
- **URL as State**: Current page location is the only state

## Components and Interfaces

### 1. Landing Page Component (`page.tsx`)

**Purpose**: Root page component that renders the hero section and mode selection interface.

**Type Signature**:
```typescript
export default function LandingPage(): React.ReactElement
```

**Responsibilities**:
- Render hero section with headline and subheadline
- Render mode selection CTAs
- Apply blue color theme via Tailwind classes
- Ensure responsive layout

**Implementation Notes**:
- Server Component (default in App Router)
- No client-side interactivity at this level
- Metadata exported for SEO

### 2. Hero Section Component

**Purpose**: Display compelling headline and subheadline that communicate value proposition.

**Type Signature**:
```typescript
interface HeroSectionProps {
  headline: string;
  subheadline: string;
}

export function HeroSection({ headline, subheadline }: HeroSectionProps): React.ReactElement
```

**Responsibilities**:
- Render headline with appropriate typography hierarchy
- Render subheadline with supporting text styling
- Apply responsive text sizing
- Maintain visual hierarchy

**Styling Guidelines**:
- Headline: Large, bold, high contrast (text-4xl to text-6xl)
- Subheadline: Medium, regular weight, slightly muted (text-lg to text-xl)
- Center-aligned on mobile, left-aligned on desktop (optional)

### 3. Mode Selector Component

**Purpose**: Render two prominent CTAs for mode selection and handle navigation.

**Type Signature**:
```typescript
'use client';

interface ModeSelectorProps {
  className?: string;
}

export function ModeSelector({ className }: ModeSelectorProps): React.ReactElement
```

**Responsibilities**:
- Render "I'm Buying My First Home" CTA (functional)
- Render "I'm an Investor" CTA (visible but disabled/non-functional in initial release)
- Handle click events and trigger navigation for homebuyer mode
- Apply blue theme styling to CTAs
- Ensure equal visual prominence for both options
- Provide keyboard navigation support

**Implementation Note**: The investor CTA is displayed for design completeness but is not functional in the initial release. Only the homebuyer journey is implemented.

**Navigation Logic**:
```typescript
import { useRouter } from 'next/navigation';

function handleModeSelection(mode: 'homebuyer' | 'investor') {
  const router = useRouter();
  // Only homebuyer mode is functional in initial release
  if (mode === 'homebuyer') {
    router.push(`/${mode}`);
  }
  // Investor mode: no action (button can be styled as disabled or show "Coming Soon")
}
```

**Styling Guidelines**:
- Homebuyer CTA (Primary): Solid blue background, white text, fully interactive
- Investor CTA (Secondary): Blue border, blue text, transparent background, disabled state or "Coming Soon" badge
- Both CTAs: Same size, equal spacing
- Mobile: Stacked vertically, full width
- Desktop: Side-by-side, fixed width

**Initial Release Scope**: Only the homebuyer CTA is functional. The investor CTA is displayed for UI completeness but does not navigate.

### 4. Button Component (Optional)

**Purpose**: Reusable button component for CTAs with consistent styling.

**Type Signature**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export function Button({ 
  variant, 
  children, 
  onClick, 
  className,
  ariaLabel 
}: ButtonProps): React.ReactElement
```

**Responsibilities**:
- Render button with appropriate variant styling
- Handle click events
- Provide accessibility attributes
- Support keyboard navigation
- Display focus indicators

## Data Models

### Mode Type

```typescript
type Mode = 'homebuyer' | 'investor';
```

**Purpose**: Type-safe representation of user mode selection.

**Usage**: 
- Navigation routing
- Type checking in components
- Future integration with Firestore user preferences

### Navigation Route Mapping

```typescript
const ROUTE_MAP: Record<Mode, string> = {
  homebuyer: '/homebuyer',
  investor: '/investor',
};
```

**Purpose**: Centralized mapping of modes to dashboard routes.

**Usage**: Ensures consistent routing across the application.

### Metadata Configuration

```typescript
export const metadata: Metadata = {
  title: 'Homevest - AI-Powered Real Estate for Homebuyers & Investors',
  description: 'Make smarter real estate decisions with AI-powered insights. Whether you\'re buying your first home or investing in properties, Homevest guides you every step of the way.',
  keywords: ['real estate', 'homebuyer', 'investor', 'AI', 'property analysis'],
  openGraph: {
    title: 'Homevest - AI-Powered Real Estate',
    description: 'Make smarter real estate decisions with AI-powered insights',
    type: 'website',
  },
};
```

**Purpose**: SEO optimization and social media sharing metadata.

## Design System

### Color Palette (Blue Theme)

```typescript
// Tailwind CSS custom colors (to be added to tailwind.config)
const colors = {
  primary: {
    50: '#eff6ff',   // Lightest blue
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Primary blue
    600: '#2563eb',  // Darker blue for hover
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Darkest blue
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    500: '#737373',
    700: '#404040',
    900: '#171717',
  },
};
```

**Usage**:
- Primary CTAs: `bg-primary-500 hover:bg-primary-600`
- Secondary CTAs: `border-primary-500 text-primary-600 hover:bg-primary-50`
- Background: `bg-neutral-50` or `bg-white`
- Text: `text-neutral-900` (headlines), `text-neutral-700` (body)

### Typography Scale

```typescript
const typography = {
  headline: 'text-5xl md:text-6xl font-bold tracking-tight',
  subheadline: 'text-lg md:text-xl font-normal text-neutral-700',
  ctaText: 'text-base md:text-lg font-semibold',
};
```

### Spacing and Layout

```typescript
const spacing = {
  heroSection: 'py-16 md:py-24 px-6 md:px-12',
  ctaContainer: 'mt-12 flex flex-col md:flex-row gap-4 md:gap-6',
  ctaButton: 'px-8 py-4 rounded-lg',
};
```

### Responsive Breakpoints

- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)

## Integration Points

### Firebase Authentication

The landing page does NOT directly integrate with Firebase. Authentication is handled by the dashboard pages (`/homebuyer` and `/investor`).

**Integration Flow**:
1. User clicks mode CTA on landing page
2. Landing page navigates to dashboard route
3. Dashboard page checks authentication status
4. If not authenticated, dashboard triggers Google SSO flow
5. After authentication, user accesses dashboard features

**No Code Required in Landing Page**: Authentication logic is deferred to dashboard pages.

### Firestore User Preferences

User mode preferences are stored in Firestore but NOT accessed by the landing page in the initial implementation.

**Future Enhancement** (not in scope):
- Landing page could check if user has stored preference
- Display visual indicator of previous selection
- Allow quick re-selection of previous mode

**Current Implementation**: Landing page is stateless and does not query Firestore.

### Dashboard Pages

The landing page integrates with dashboard pages through client-side navigation:

**Homebuyer Dashboard** (`/homebuyer/page.tsx`):
- Receives navigation from "I'm Buying My First Home" CTA
- Handles authentication check
- Displays homebuyer-specific features

**Investor Dashboard** (`/investor/page.tsx`):
- Receives navigation from "I'm an Investor" CTA
- Handles authentication check
- Displays investor-specific features

**Integration Contract**:
- Landing page MUST navigate to `/homebuyer` or `/investor`
- Dashboard pages MUST handle unauthenticated users
- Dashboard pages MUST store mode preference in Firestore after authentication

## Performance Optimization

### Static Generation

```typescript
// page.tsx is a Server Component by default
// Next.js will statically generate this page at build time
export default function LandingPage() {
  // No data fetching, fully static
  return <HeroSection />;
}
```

**Benefits**:
- Instant page load from CDN
- No server-side rendering overhead
- Optimal Core Web Vitals scores

### Image Optimization

```typescript
import Image from 'next/image';

// Example: Hero background or logo
<Image
  src="/hero-background.jpg"
  alt="Homevest hero background"
  width={1920}
  height={1080}
  priority // Load immediately for above-the-fold content
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Low-quality placeholder
/>
```

**Optimization Strategies**:
- Use Next.js `Image` component for automatic optimization
- Serve WebP format with JPEG fallback
- Implement lazy loading for below-the-fold images
- Use `priority` prop for hero images

### JavaScript Bundle Optimization

**Minimize Client-Side JavaScript**:
- Landing page component is a Server Component (no JS shipped)
- Only `ModeSelector` is a Client Component (minimal JS)
- No external libraries imported on landing page
- Tailwind CSS purges unused styles at build time

**Code Splitting**:
```typescript
// ModeSelector is automatically code-split
'use client';
import { useRouter } from 'next/navigation';
// Only this component's JS is sent to client
```

### Font Optimization

```typescript
// layout.tsx already implements font optimization
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
});
```

**Benefits**:
- Fonts are self-hosted by Next.js (no external requests)
- Automatic font subsetting
- Font display swap prevents layout shift

## Accessibility

### Semantic HTML

```typescript
<main role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Choose Your Path</h1>
    <p>Find your perfect home or investment property</p>
  </section>
  
  <nav aria-label="Mode selection">
    <button aria-label="Select homebuyer mode">
      I'm Buying My First Home
    </button>
    <button aria-label="Select investor mode">
      I'm an Investor
    </button>
  </nav>
</main>
```

### Keyboard Navigation

**Tab Order**:
1. First CTA (Homebuyer)
2. Second CTA (Investor)

**Keyboard Interactions**:
- `Tab`: Navigate between CTAs
- `Enter` or `Space`: Activate selected CTA
- `Shift + Tab`: Navigate backwards

### Focus Indicators

```typescript
const focusStyles = 'focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2';
```

**Implementation**:
- Visible focus ring on all interactive elements
- High contrast focus indicators
- Focus ring offset for clarity

### Color Contrast

**WCAG 2.1 AA Compliance**:
- Headline text: `text-neutral-900` on `bg-white` (21:1 ratio)
- Body text: `text-neutral-700` on `bg-white` (7:1 ratio)
- Primary CTA: White text on `bg-primary-500` (4.5:1 ratio)
- Secondary CTA: `text-primary-600` on `bg-white` (4.5:1 ratio)

### Screen Reader Support

```typescript
<button
  onClick={() => handleModeSelection('homebuyer')}
  aria-label="Select homebuyer mode to access first-time homebuyer features"
>
  I'm Buying My First Home
</button>
```

**Best Practices**:
- Descriptive `aria-label` attributes
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- Landmark roles for major sections

## Error Handling

### Navigation Errors

**Scenario**: Navigation to dashboard fails (network error, invalid route)

**Handling**:
```typescript
'use client';

function handleModeSelection(mode: Mode) {
  try {
    router.push(ROUTE_MAP[mode]);
  } catch (error) {
    console.error('Navigation failed:', error);
    // Fallback: Use window.location for hard navigation
    window.location.href = ROUTE_MAP[mode];
  }
}
```

**User Experience**: Graceful fallback to hard navigation if client-side routing fails.

### Missing Dashboard Pages

**Scenario**: User navigates to `/homebuyer` or `/investor` but page doesn't exist

**Handling**: Next.js automatically shows 404 page (not handled by landing page)

**Prevention**: Ensure dashboard pages exist before deploying landing page

### JavaScript Disabled

**Scenario**: User has JavaScript disabled in browser

**Handling**: Use progressive enhancement with `<a>` tags as fallback

```typescript
<a
  href="/homebuyer"
  className="cta-button"
  onClick={(e) => {
    e.preventDefault();
    handleModeSelection('homebuyer');
  }}
>
  I'm Buying My First Home
</a>
```

**User Experience**: Links work without JavaScript, enhanced with client-side navigation when available.

## Testing Strategy

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for universal correctness properties.

### Unit Testing

**Framework**: Jest with React Testing Library

**Test Coverage**:

1. **Component Rendering**:
   - Landing page renders without errors
   - Hero section displays headline and subheadline
   - Both CTAs are visible and accessible

2. **Navigation Logic**:
   - Clicking "I'm Buying My First Home" navigates to `/homebuyer`
   - Clicking "I'm an Investor" navigates to `/investor`
   - Navigation uses Next.js router (not hard refresh)

3. **Responsive Behavior**:
   - Mobile layout stacks CTAs vertically
   - Desktop layout displays CTAs side-by-side
   - Text sizes adjust based on viewport

4. **Accessibility**:
   - All interactive elements have ARIA labels
   - Focus indicators are visible
   - Keyboard navigation works correctly
   - Color contrast meets WCAG AA standards

5. **Error Scenarios**:
   - Navigation fallback works when router fails
   - Component handles missing props gracefully

**Example Unit Test**:
```typescript
describe('ModeSelector', () => {
  it('navigates to homebuyer dashboard when homebuyer CTA is clicked', () => {
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
    }));
    
    render(<ModeSelector />);
    const homebuyerButton = screen.getByRole('button', { name: /homebuyer/i });
    fireEvent.click(homebuyerButton);
    
    expect(mockPush).toHaveBeenCalledWith('/homebuyer');
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Minimum 100 iterations per property test

**Test Tagging**: Each property test references its design document property using the format:
```typescript
// Feature: homevest-landing-page, Property N: [property text]
```

