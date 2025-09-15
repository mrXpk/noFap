export const Colors = {
  // Sacred wooden theme colors
  sacred: {
    darkWood: '#3c2415',
    mediumWood: '#5d4037',
    lightWood: '#8d6e63',
    warmWood: '#a1887f',
    parchment: '#f5f5dc',
    goldLeaf: '#d4af37',
    deepGold: '#b8860b',
    bronze: '#cd7f32',
  },
  
  // Background gradients - wooden/parchment
  background: {
    woodenGradient: ['#f5deb3', '#deb887', '#d2b48c'],
    parchmentGradient: ['#faf0e6', '#f5f5dc', '#f0e68c'],
    darkWoodGradient: ['#8b4513', '#a0522d', '#cd853f'],
    sacred: '#fdf5e6',
  },
  
  // Text colors - earth tones
  text: {
    primary: '#3c2415',      // Dark wood for main text
    secondary: '#5d4037',    // Medium wood for secondary
    accent: '#8b4513',       // Saddle brown for accents
    gold: '#b8860b',         // Dark gold for highlights
    parchment: '#f5f5dc',    // Light text on dark backgrounds
    sacred: '#2f1b14',       // Very dark brown for sacred text
  },
  
  // Sacred accent colors
  accent: {
    gold: '#d4af37',         // Gold leaf
    deepGold: '#b8860b',     // Deep gold
    bronze: '#cd7f32',       // Bronze
    amber: '#ffbf00',        // Amber
    crimson: '#8b0000',      // Deep red for important elements
    ivory: '#fffff0',        // Ivory white
  },
  
  // Neutral earth tones
  neutral: {
    sand100: '#faf0e6',      // Lightest sand
    sand200: '#f5deb3',      // Light sand
    sand300: '#deb887',      // Medium sand
    sand400: '#d2b48c',      // Tan
    sand500: '#bc9a6a',      // Dark tan
    brown100: '#efebe9',     // Light brown
    brown200: '#d7ccc8',     // Medium light brown
    brown300: '#bcaaa4',     // Medium brown
    brown400: '#a1887f',     // Dark medium brown
    brown500: '#8d6e63',     // Dark brown
    brown600: '#6d4c41',     // Darker brown
    brown700: '#5d4037',     // Very dark brown
    brown800: '#4e342e',     // Almost black brown
    brown900: '#3e2723',     // Darkest brown
  },
  
  // Semantic colors with earthy feel
  success: '#228b22',        // Forest green
  warning: '#ff8c00',        // Dark orange
  error: '#8b0000',          // Dark red
  info: '#4682b4',           // Steel blue (muted)
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    xxxxl: 36,
    xxxxxl: 48,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};