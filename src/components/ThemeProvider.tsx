'use client';

import { useEffect } from 'react';
import useStore from '@/store/useStore';

export default function ThemeProvider() {
  const brandColor = useStore((state) => state.currentCompany?.brandColor) || '#D4AF37';
  const secondaryColor = useStore((state) => state.currentCompany?.secondaryBrandColor) || '#1A1A1A';
  const theme = useStore((state) => state.theme) || 'dark';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--brand-primary', brandColor);
      document.documentElement.style.setProperty('--brand-secondary', secondaryColor);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [brandColor, secondaryColor, theme]);

  return null;
}
