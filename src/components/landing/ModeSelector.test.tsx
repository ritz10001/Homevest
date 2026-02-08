import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModeSelector } from './ModeSelector';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ModeSelector - Client-Side Navigation', () => {
  let mockPush: jest.Mock;
  let mockRouter: any;

  beforeEach(() => {
    // Reset mocks before each test
    mockPush = jest.fn();
    mockRouter = {
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock window.location.href setter
    delete (window as any).location;
    (window as any).location = { href: 'http://localhost/' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useRouter navigation for homebuyer mode', () => {
    it('should call router.push with /homebuyer when homebuyer CTA is clicked', () => {
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      });
      
      fireEvent.click(homebuyerButton);
      
      expect(mockPush).toHaveBeenCalledWith('/homebuyer');
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('should prevent default link behavior when clicking homebuyer CTA', () => {
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      });
      
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
      
      homebuyerButton.dispatchEvent(clickEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should use client-side navigation (no page refresh)', async () => {
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      });
      
      // Track if window.location.href was modified (would indicate hard navigation)
      const originalHref = window.location.href;
      
      fireEvent.click(homebuyerButton);
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled();
      });
      
      // Verify no hard navigation occurred
      expect(window.location.href).toBe(originalHref);
    });
  });

  describe('Error handling with fallback to window.location', () => {
    it('should have error handling with fallback to window.location.href', () => {
      // This test verifies that the component has error handling code in place
      // by checking that router.push is wrapped in a try-catch
      
      // Mock router.push to throw an error
      mockPush.mockImplementation(() => {
        throw new Error('Navigation failed');
      });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Track window.location.href assignments
      let assignedHref = '';
      delete (window as any).location;
      (window as any).location = {
        href: 'http://localhost/',
        set href(value: string) {
          assignedHref = value;
        },
        get href() {
          return assignedHref || 'http://localhost/';
        },
      };
      
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      });
      
      // This should not throw an error due to try-catch
      expect(() => fireEvent.click(homebuyerButton)).not.toThrow();
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Client-side navigation failed:',
        expect.any(Error)
      );
      
      // Verify fallback to window.location.href was attempted
      expect(assignedHref).toBe('/homebuyer');
      
      consoleErrorSpy.mockRestore();
    });

    it('should gracefully handle navigation errors without breaking the UI', () => {
      // Mock router.push to throw an error
      mockPush.mockImplementation(() => {
        throw new Error('Router unavailable');
      });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      });
      
      // Component should handle error gracefully
      fireEvent.click(homebuyerButton);
      
      // Verify error was logged (error handling is working)
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Component should still be rendered and functional
      expect(homebuyerButton).toBeInTheDocument();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Investor mode (non-functional)', () => {
    it('should not navigate when investor CTA is clicked', () => {
      render(<ModeSelector />);
      
      const investorButton = screen.getByRole('button', { 
        name: /investor mode/i 
      });
      
      fireEvent.click(investorButton);
      
      // Verify no navigation occurred
      expect(mockPush).not.toHaveBeenCalled();
      // window.location.href should remain unchanged
      expect(window.location.href).toBe('http://localhost/');
    });

    it('should render investor button as disabled', () => {
      render(<ModeSelector />);
      
      const investorButton = screen.getByRole('button', { 
        name: /investor mode/i 
      });
      
      expect(investorButton).toBeDisabled();
    });
  });

  describe('Progressive enhancement', () => {
    it('should render homebuyer CTA as an anchor tag with href', () => {
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      });
      
      expect(homebuyerButton).toHaveAttribute('href', '/homebuyer');
    });

    it('should work without JavaScript (href fallback)', () => {
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      }) as HTMLAnchorElement;
      
      // Verify the link has proper href for no-JS fallback
      expect(homebuyerButton.href).toContain('/homebuyer');
    });
  });

  describe('Navigation performance', () => {
    it('should complete navigation instantly (synchronous call)', () => {
      const startTime = performance.now();
      
      render(<ModeSelector />);
      
      const homebuyerButton = screen.getByRole('link', { 
        name: /select homebuyer mode/i 
      });
      
      fireEvent.click(homebuyerButton);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Navigation should be instant (< 100ms for the call itself)
      expect(duration).toBeLessThan(100);
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
