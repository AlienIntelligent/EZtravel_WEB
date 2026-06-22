/**
 * EZTravel Legacy Design Tokens
 * 
 * Extracted from legacy `index.css` and `MainLayout`.
 * This serves as the single source of truth for the visual identity.
 */

export const designTokens = {
  colors: {
    // Primary Brand Colors
    primary: {
      DEFAULT: '#0EA5E9', // Ocean Blue
      hover: '#0284C7',
      light: '#E0F2FE', // bg-sky-100
      dark: '#0369A1'
    },
    secondary: {
      DEFAULT: '#14B8A6', // Teal
      hover: '#0D9488',
      light: '#CCFBF1'
    },
    accent: {
      DEFAULT: '#F59E0B', // Amber
      hover: '#D97706'
    },
    premium: {
      DEFAULT: '#D4AF37', // Gold
      gradientStart: '#FEF3C7',
      gradientEnd: '#FFFBEB'
    },

    // UI Feedback Colors
    success: {
      DEFAULT: '#22C55E',
      light: '#DCFCE7'
    },
    warning: {
      DEFAULT: '#F97316',
      light: '#FFEDD5'
    },
    error: {
      DEFAULT: '#EF4444',
      light: '#FEE2E2'
    },

    // Surface & Background (Light Theme for Travel Platform)
    surface: {
      DEFAULT: '#FFFFFF',
      muted: '#F8FAFC', // Slate 50
      hover: '#F1F5F9', // Slate 100
      border: '#E2E8F0' // Slate 200
    },
    
    // Dark Theme / Footer
    dark: {
      DEFAULT: '#0F172A', // Slate 900
      muted: '#1E293B', // Slate 800
      border: '#334155' // Slate 700
    },

    // Typography Colors
    text: {
      primary: '#0F172A', // Heading Slate 900
      secondary: '#475569', // Body Slate 600
      muted: '#64748B', // Slate 500
      inverse: '#FFFFFF'
    }
  },

  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      serif: 'Playfair Display, Georgia, serif', // Used for main branding
    },
    sizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
      caption: '0.75rem'
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },

  spacing: {
    container: '1rem', // px-4
    md: '1.5rem',      // px-6
    lg: '2rem',        // px-8
    section: '4rem',   // py-16
  },

  radii: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem', // Default inputs, cards
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px' // Pills, avatars, search bar
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    dropdown: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    header: '0 4px 20px -2px rgb(0 0 0 / 0.05)' // Subtle header shadow
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
  },

  zIndex: {
    dropdown: 50,
    sticky: 40,
    overlay: 100,
    modal: 110,
    popover: 120
  }
};
