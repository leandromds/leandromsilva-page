
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink:       '#0F1419',
        'navy-900':'#1B2F4A',
        'navy-600':'#3B5474',
        'slate-500':'#6B7280',
        'slate-300':'#C4C8CE',
        'slate-200':'#E5E7EB',
        'slate-100':'#ECEDEF',
        paper:     '#FAFAF7',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans:    ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
};
