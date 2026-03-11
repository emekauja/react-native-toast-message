import type { ToastTheme, ToastThemeOverrides, ToastTone } from './types';
import { colors, spacing as baseSpacing } from './utils/theme';

const createToneTheme = (
  tone: ToastTone,
  values: Omit<ToastTheme['colors']['tones'][ToastTone], 'title' | 'subtitle' | 'action' | 'close'>
) => ({
  ...values,
  title: tone === 'default' ? colors.palette.grey[900] : values.accent,
  subtitle: colors.palette.grey[600],
  action: values.accent,
  close: colors.palette.grey[700]
});

export const defaultToastTheme: ToastTheme = {
  colors: {
    surface: colors.white,
    border: colors.palette.grey[200],
    textPrimary: colors.palette.grey[900],
    textSecondary: colors.palette.grey[600],
    shadow: colors.palette.grey[900],
    tones: {
      default: createToneTheme('default', {
        accent: colors.palette.grey[900],
        background: colors.white,
        border: colors.palette.grey[200],
        iconBackground: colors.palette.grey[100],
        iconForeground: colors.palette.grey[700]
      }),
      success: createToneTheme('success', {
        accent: colors.palette.success[600],
        background: colors.palette.success[50],
        border: colors.palette.success[75],
        iconBackground: colors.palette.success[75],
        iconForeground: colors.palette.success[700]
      }),
      error: createToneTheme('error', {
        accent: colors.palette.red[500],
        background: colors.palette.red[50],
        border: colors.palette.red[75],
        iconBackground: colors.palette.red[75],
        iconForeground: colors.palette.red[700]
      }),
      warning: createToneTheme('warning', {
        accent: colors.palette.warning[500],
        background: colors.palette.warning[50],
        border: colors.palette.warning[75],
        iconBackground: colors.palette.warning[75],
        iconForeground: colors.palette.warning[700]
      }),
      info: createToneTheme('info', {
        accent: colors.palette.blue[500],
        background: colors.palette.blue[50],
        border: colors.palette.blue[75],
        iconBackground: colors.palette.blue[75],
        iconForeground: colors.palette.blue[700]
      })
    }
  },
  spacing: {
    edgeOffset: baseSpacing[4],
    viewportHorizontal: baseSpacing[4],
    stackOffset: baseSpacing[4],
    contentGap: baseSpacing[3],
    verticalPadding: baseSpacing[3],
    horizontalPadding: baseSpacing[4],
    leadingSize: 28,
    actionGap: baseSpacing[2]
  },
  radius: {
    card: 16,
    icon: 10,
    pill: 999
  },
  shadow: {
    shadowColor: colors.palette.grey[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5
  },
  typography: {
    title: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20
    },
    subtitle: {
      fontSize: 13,
      fontWeight: '400',
      lineHeight: 18
    },
    action: {
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 18
    },
    close: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 18
    }
  }
};

export const createToastTheme = (overrides?: ToastThemeOverrides): ToastTheme => {
  if (!overrides) {
    return defaultToastTheme;
  }

  const mergedTones = Object.entries(defaultToastTheme.colors.tones).reduce<
    ToastTheme['colors']['tones']
  >((acc, [tone, toneTheme]) => {
    acc[tone as ToastTone] = {
      ...toneTheme,
      ...overrides.colors?.tones?.[tone as ToastTone]
    };
    return acc;
  }, {} as ToastTheme['colors']['tones']);

  return {
    ...defaultToastTheme,
    ...overrides,
    colors: {
      ...defaultToastTheme.colors,
      ...overrides.colors,
      tones: mergedTones
    },
    spacing: {
      ...defaultToastTheme.spacing,
      ...overrides.spacing
    },
    radius: {
      ...defaultToastTheme.radius,
      ...overrides.radius
    },
    shadow: {
      ...defaultToastTheme.shadow,
      ...overrides.shadow
    },
    typography: {
      ...defaultToastTheme.typography,
      title: {
        ...defaultToastTheme.typography.title,
        ...overrides.typography?.title
      },
      subtitle: {
        ...defaultToastTheme.typography.subtitle,
        ...overrides.typography?.subtitle
      },
      action: {
        ...defaultToastTheme.typography.action,
        ...overrides.typography?.action
      },
      close: {
        ...defaultToastTheme.typography.close,
        ...overrides.typography?.close
      }
    }
  };
};

export { colors, palette, spacing } from './utils/theme';
