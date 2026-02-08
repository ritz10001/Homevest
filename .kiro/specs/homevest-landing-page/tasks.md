# Implementation Tasks: Homevest Landing Page

## Overview
This task list covers the implementation of the Homevest landing page with mode selection interface, focusing on the homebuyer journey in the initial release.

## Task List

### 1. Project Setup and Configuration
- [x] 1.1 Configure Tailwind CSS with custom blue color palette
  - Add primary blue colors (50-900 scale) to tailwind.config
  - Add neutral colors for text and backgrounds
  - Verify Tailwind CSS 4.x is properly installed
- [x] 1.2 Verify Next.js 16 App Router configuration
  - Confirm app directory structure exists
  - Verify TypeScript configuration is correct
  - Check that Geist fonts are loaded in layout.tsx

### 2. Core Components Implementation
- [x] 2.1 Create HeroSection component
  - Implement component in `/src/components/landing/HeroSection.tsx`
  - Add headline and subheadline props
  - Apply responsive typography (text-5xl md:text-6xl for headline)
  - Implement proper semantic HTML (h1, p tags)
  - Add ARIA labels for accessibility
- [x] 2.2 Create ModeSelector component
  - Implement component in `/src/components/landing/ModeSelector.tsx`
  - Mark as 'use client' for client-side interactivity
  - Create two CTA buttons: "I'm Buying My First Home" and "I'm an Investor"
  - Implement navigation logic using useRouter from next/navigation
  - Make homebuyer button functional (navigates to /homebuyer)
  - Make investor button visible but disabled/non-functional
  - Apply blue theme styling (primary solid, secondary outline)
  - Implement responsive layout (stacked mobile, side-by-side desktop)
  - Add keyboard navigation support
  - Add focus indicators with ring styles
  - Add ARIA labels for screen readers

### 3. Landing Page Implementation
- [x] 3.1 Update main page component
  - Modify `/src/app/page.tsx` to use new components
  - Import and render HeroSection component
  - Import and render ModeSelector component
  - Apply proper layout spacing and padding
  - Ensure page is a Server Component (default)
- [x] 3.2 Add page metadata for SEO
  - Export metadata object with title, description, keywords
  - Add OpenGraph metadata for social sharing
  - Ensure metadata follows design document specifications

### 4. Styling and Design System
- [x] 4.1 Implement blue color theme
  - Apply primary-500 background to homebuyer CTA
  - Apply primary-600 border to investor CTA
  - Use neutral colors for text (neutral-900 for headlines, neutral-700 for body)
  - Ensure no green colors are used
- [ ] 4.2 Implement responsive design
  - Test mobile layout (< 768px): CTAs stacked vertically
  - Test desktop layout (>= 768px): CTAs side-by-side
  - Verify text sizes scale appropriately
  - Ensure touch targets are at least 44x44px on mobile
- [x] 4.3 Add hover and focus states
  - Implement hover:bg-primary-600 for homebuyer CTA
  - Implement hover:bg-primary-50 for investor CTA
  - Add focus ring styles (focus:ring-4 focus:ring-primary-300)
  - Ensure focus indicators are visible and meet WCAG standards

### 5. Navigation and Routing
- [x] 5.1 Create placeholder homebuyer dashboard page
  - Create `/src/app/homebuyer/page.tsx`
  - Add basic placeholder content (e.g., "Homebuyer Dashboard - Coming Soon")
  - Ensure page exists to prevent 404 errors during testing
- [x] 5.2 Create placeholder investor dashboard page
  - Create `/src/app/investor/page.tsx`
  - Add basic placeholder content (e.g., "Investor Dashboard - Coming Soon")
  - Mark as non-functional for initial release
- [x] 5.3 Implement client-side navigation
  - Verify useRouter navigation works for homebuyer mode
  - Test that navigation is instant (no page refresh)
  - Add error handling with fallback to window.location

### 6. Accessibility Implementation
- [ ] 6.1 Add semantic HTML and ARIA labels
  - Use proper heading hierarchy (h1 for main headline)
  - Add aria-label to both CTA buttons
  - Add aria-labelledby to hero section
  - Use nav element with aria-label for mode selection
- [ ] 6.2 Implement keyboard navigation
  - Verify Tab key navigates between CTAs
  - Verify Enter/Space activates selected CTA
  - Verify Shift+Tab navigates backwards
  - Test keyboard-only navigation flow
- [ ] 6.3 Verify color contrast ratios
  - Test headline text contrast (should be 21:1)
  - Test body text contrast (should be 7:1)
  - Test CTA text contrast (should be at least 4.5:1)
  - Use browser dev tools or contrast checker

### 7. Performance Optimization
- [ ] 7.1 Optimize for static generation
  - Verify page.tsx has no data fetching
  - Confirm page is statically generated at build time
  - Test build output shows page as static
- [ ] 7.2 Minimize JavaScript bundle
  - Verify only ModeSelector is a Client Component
  - Confirm HeroSection is a Server Component
  - Check bundle size in build output
- [ ] 7.3 Optimize fonts and assets
  - Verify Geist fonts use display: swap
  - Ensure no external font requests
  - Add any hero images using next/image with priority prop

### 8. Testing
- [ ] 8.1 Write unit tests for components
  - Test HeroSection renders headline and subheadline
  - Test ModeSelector renders both CTAs
  - Test homebuyer CTA click triggers navigation to /homebuyer
  - Test investor CTA is disabled/non-functional
  - Test responsive layout changes at breakpoints
- [ ] 8.2 Write accessibility tests
  - Test all interactive elements have ARIA labels
  - Test keyboard navigation works correctly
  - Test focus indicators are visible
  - Test color contrast meets WCAG AA standards
- [ ] 8.3 Manual testing
  - Test on mobile device (< 768px width)
  - Test on tablet (768px - 1024px width)
  - Test on desktop (> 1024px width)
  - Test with keyboard only (no mouse)
  - Test with screen reader (if available)

### 9. Integration and Deployment
- [ ] 9.1 Verify integration points
  - Confirm /homebuyer route exists and is accessible
  - Confirm /investor route exists (even if non-functional)
  - Document that authentication will be handled by dashboard pages
- [ ] 9.2 Build and deploy
  - Run `npm run build` and verify no errors
  - Check build output for static generation confirmation
  - Test production build locally with `npm run start`
  - Deploy to Vercel (or staging environment)
- [ ] 9.3 Post-deployment verification
  - Test landing page loads quickly (< 2 seconds)
  - Verify navigation to /homebuyer works
  - Check that page is responsive on real devices
  - Verify SEO metadata appears correctly

## Notes

- **Initial Release Scope**: Only the homebuyer journey is functional. The investor button is visible but disabled.
- **No Firebase Integration**: Authentication and user preferences are handled by dashboard pages, not the landing page.
- **Static Page**: The landing page should be fully static with no data fetching or server-side logic.
- **Progressive Enhancement**: Use `<a>` tags with onClick handlers for navigation to support JavaScript-disabled browsers.

## Dependencies

- Next.js 16.1.6 with App Router
- TypeScript 5.x
- Tailwind CSS 4.x
- React 19.x
- Geist fonts (already configured in layout.tsx)

## Success Criteria

- Landing page loads in under 2 seconds
- Both CTAs are visible and styled correctly with blue theme
- Homebuyer CTA navigates to /homebuyer dashboard
- Investor CTA is visible but non-functional
- Page is fully responsive (mobile, tablet, desktop)
- All accessibility requirements are met (WCAG 2.1 AA)
- Page is statically generated at build time
- No console errors or warnings
