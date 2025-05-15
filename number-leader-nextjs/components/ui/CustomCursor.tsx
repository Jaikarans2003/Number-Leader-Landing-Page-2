'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface CursorProps {
  circleCount?: number;
}

const CustomCursor: React.FC<CursorProps> = ({ circleCount = 20 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOnDarkBg, setIsOnDarkBg] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  
  // Generate gradient color array
  const generateColors = (isDark: boolean) => {
    // Force black color on Service Page
    if (pathname?.includes('/services')) {
      return Array(circleCount).fill('').map((_, i) => {
        const opacity = (circleCount - i) / circleCount;
        return `rgba(0, 0, 0, ${opacity})`;
      });
    }
    
    // Use white on dark backgrounds, black on light backgrounds
    const baseColor = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';
    return Array(circleCount).fill('').map((_, i) => {
      // Calculate opacity based on position in the trail
      const opacity = (circleCount - i) / circleCount;
      return `${baseColor} ${opacity})`;
    });
  };
  
  // Check if the cursor is over Navbar or Footer
  const isOverNavbarOrFooter = (element: Element | null): boolean => {
    if (!element) return false;
    
    // Check current element
    if (
      element.tagName === 'NAV' || 
      element.tagName === 'FOOTER' ||
      element.closest('nav') || 
      element.closest('footer')
    ) {
      return true;
    }
    
    return false;
  };
  
  // Check if point is over a dark background
  const checkIfOnDarkBackground = (x: number, y: number) => {
    try {
      // Get element at current cursor position
      const element = document.elementFromPoint(x, y);
      if (!element) return false;
      
      // Look for parent section elements that determine the overall background
      let currentElement: Element | null = element;
      let maxDepth = 5; // Prevent infinite loops on deeply nested elements
      
      while (currentElement && maxDepth > 0) {
        // Check if this is a section, main container, or any element with a clear background
        const isSection = 
          currentElement.tagName === 'SECTION' || 
          currentElement.classList.contains('nl-section') ||
          currentElement.classList.contains('nl-section-dark') || 
          currentElement.classList.contains('nl-section-light') ||
          currentElement.classList.contains('nl-section-white') ||
          currentElement.classList.contains('nl-section-gradient') ||
          currentElement.classList.contains('bg-primary-dark') ||
          currentElement.classList.contains('bg-white');
        
        if (isSection) {
          // Found a section - use its background
          const computedStyle = window.getComputedStyle(currentElement);
          const bgColor = computedStyle.backgroundColor;
          
          if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const brightness = (Number(rgb[0]) * 299 + Number(rgb[1]) * 587 + Number(rgb[2]) * 114) / 1000;
              return brightness < 128; // Dark background
            }
          }
          
          // If no background color but has a dark class, assume it's dark
          if (
            currentElement.classList.contains('nl-section-dark') || 
            currentElement.classList.contains('nl-section-gradient') ||
            currentElement.classList.contains('bg-primary-dark')
          ) {
            return true; // Dark section
          }
          
          // If has light/white class, assume it's light
          if (
            currentElement.classList.contains('nl-section-light') || 
            currentElement.classList.contains('nl-section-white') ||
            currentElement.classList.contains('bg-white')
          ) {
            return false; // Light section
          }
        }
        
        // Move up to parent
        currentElement = currentElement.parentElement;
        maxDepth--;
      }
      
      // Fallback to original method if no section is found
      const bgColor = window.getComputedStyle(element).backgroundColor;
      
      // If transparent, check for parent background
      if (!bgColor || bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
        // Default to dark if we can't determine (assumes most of site is dark themed)
        return true;
      }
      
      // Parse the RGB values from background color
      const rgb = bgColor.match(/\d+/g);
      if (!rgb || rgb.length < 3) return false;
      
      // Calculate brightness using the formula: (R * 299 + G * 587 + B * 114) / 1000
      const brightness = (Number(rgb[0]) * 299 + Number(rgb[1]) * 587 + Number(rgb[2]) * 114) / 1000;
      
      // If brightness is less than 128, background is considered dark
      return brightness < 128;
    } catch (error: unknown) {
      console.error('Error checking background color:', error);
      return false;
    }
  };
  
  // Check if element is interactive
  const isInteractiveElement = (element: Element | null): boolean => {
    if (!element) return false;
    
    // Check tag name for common interactive elements
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
    if (interactiveTags.includes(element.tagName)) return true;
    
    // Check for elements with role="button"
    if (element.getAttribute('role') === 'button') return true;
    
    // Check for elements with specific classes that indicate interactivity
    const interactiveClasses = ['cursor-pointer', 'btn', 'button', 'nl-btn-primary', 'nl-btn-secondary'];
    for (const className of interactiveClasses) {
      if (element.classList.contains(className)) return true;
    }
    
    // Check for cursor style that indicates interactivity
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.cursor === 'pointer') return true;
    
    // Recursively check parent for interactive elements
    if (element.parentElement) {
      return isInteractiveElement(element.parentElement);
    }
    
    return false;
  };
  
  // Setup mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Get element under cursor
      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      // Check if over navbar or footer or interactive element
      const overNavbarOrFooter = isOverNavbarOrFooter(element);
      const overInteractiveElement = isInteractiveElement(element);
      
      // Hide cursor over navbar, footer, or any interactive element
      setIsVisible(!overNavbarOrFooter && !overInteractiveElement);
      
      // Check background color (if not on service page)
      if (!pathname?.includes('/services')) {
        setIsOnDarkBg(checkIfOnDarkBackground(e.clientX, e.clientY));
      } else {
        // Force light background on service page
        setIsOnDarkBg(false);
      }
      
      // Check if hovering over interactive element
      setIsHovering(overInteractiveElement);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Initial detection
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const initialX = window.innerWidth / 2;
        const initialY = window.innerHeight / 2;
        setPosition({ x: initialX, y: initialY });
        
        // Force light background on service page
        if (pathname?.includes('/services')) {
          setIsOnDarkBg(false);
        } else {
          setIsOnDarkBg(checkIfOnDarkBackground(initialX, initialY));
        }
      }, 100);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pathname]);
  
  // Animation loop using requestAnimationFrame
  useEffect(() => {
    const colors = generateColors(isOnDarkBg);
    const cursorSize = 32; // Updated cursor size to match CSS
    const halfCursor = cursorSize / 2;
    
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        let x = position.x;
        let y = position.y;
        
        circlesRef.current.forEach((circle, index) => {
          if (!circle) return;
          
          // Offset to make it not overlap directly with the default cursor
          // This makes it look like a smooth trail behind the actual cursor
          const offsetX = 3; // Slight offset
          const offsetY = 3; // Slight offset
          
          // Position the circle with offset - adjust for larger cursor size
          circle.style.left = `${x - halfCursor + offsetX}px`;
          circle.style.top = `${y - halfCursor + offsetY}px`;
          
          // Apply special effects based on state
          let scaleModifier = 0.8; // Slightly smaller overall to avoid overwhelming the default cursor
          
          // First circle (main cursor)
          if (index === 0) {
            // Shrink when clicking
            if (isClicking) {
              scaleModifier *= 0.7;
            }
            
            // Grow when hovering interactive elements
            if (isHovering) {
              scaleModifier *= 1.3; // Reduced from 1.5
              
              // When hovering, always use white with difference blend mode
              // This ensures consistent behavior regardless of background
              circle.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              circle.style.mixBlendMode = 'difference';
            } else {
              // When not hovering, use the color based on section background
              circle.style.backgroundColor = colors[index];
              circle.style.mixBlendMode = 'normal';
            }
          } else if (isHovering && index < 5) {
            // Adjust the trailing circles when hovering
            scaleModifier *= 1.2;
            
            // Color trailing circles consistently when hovering
            if (index === 1) {
              circle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            } else if (index < 5) {
              const opacity = 0.8 - (index * 0.15);
              circle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
            } else {
              circle.style.backgroundColor = colors[index];
            }
          } else {
            // Normal trailing circles use the section-based colors
            circle.style.backgroundColor = colors[index];
          }
          
          // Base scale based on position in trail
          const baseScale = (circlesRef.current.length - index) / circlesRef.current.length;
          circle.style.transform = `scale(${baseScale * scaleModifier})`;
          
          // Calculate next position with trailing effect
          const nextCircle = circlesRef.current[index + 1] || circlesRef.current[0];
          if (nextCircle) {
            const nextX = parseFloat(nextCircle.style.left || '0') + halfCursor - offsetX;
            const nextY = parseFloat(nextCircle.style.top || '0') + halfCursor - offsetY;
            
            // Apply easing for smooth trailing effect
            // Use faster easing when hovering for more responsive feel
            const easeFactor = isHovering ? 0.5 : 0.3;
            x += (nextX - x) * easeFactor;
            y += (nextY - y) * easeFactor;
          }
        });
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [position, isOnDarkBg, isClicking, isHovering, circleCount]);
  
  return (
    <>
      {Array(circleCount).fill('').map((_, index) => (
        <div
          key={index}
          ref={el => { circlesRef.current[index] = el; }}
          className="cursor-circle"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 999999,
            transform: 'scale(1)',
            transition: 'transform 0.1s ease-out',
            opacity: isVisible ? 1 : 0
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor; 