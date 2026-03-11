import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ToastTone = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPlacement = 'top' | 'bottom';

export type ToastAction = {
  label: string;
  onPress: () => void;
  closeOnPress?: boolean;
};

export type ToastStyleOverrides = {
  container?: StyleProp<ViewStyle>;
  content?: StyleProp<ViewStyle>;
  leading?: StyleProp<ViewStyle>;
  textContent?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  subtitle?: StyleProp<TextStyle>;
  actionContainer?: StyleProp<ViewStyle>;
  actionLabel?: StyleProp<TextStyle>;
  trailing?: StyleProp<ViewStyle>;
  closeButton?: StyleProp<ViewStyle>;
  closeLabel?: StyleProp<TextStyle>;
};

export type ToastToneTheme = {
  accent: string;
  background: string;
  border: string;
  iconBackground: string;
  iconForeground: string;
  title: string;
  subtitle: string;
  action: string;
  close: string;
};

export type ToastTheme = {
  colors: {
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    shadow: string;
    tones: Record<ToastTone, ToastToneTheme>;
  };
  spacing: {
    edgeOffset: number;
    viewportHorizontal: number;
    stackOffset: number;
    contentGap: number;
    verticalPadding: number;
    horizontalPadding: number;
    leadingSize: number;
    actionGap: number;
  };
  radius: {
    card: number;
    icon: number;
    pill: number;
  };
  shadow: ViewStyle;
  typography: {
    title: TextStyle;
    subtitle: TextStyle;
    action: TextStyle;
    close: TextStyle;
  };
};

export type ToastThemeOverrides = Partial<ToastTheme> & {
  colors?: Partial<Omit<ToastTheme['colors'], 'tones'>> & {
    tones?: Partial<Record<ToastTone, Partial<ToastToneTheme>>>;
  };
  spacing?: Partial<ToastTheme['spacing']>;
  radius?: Partial<ToastTheme['radius']>;
  typography?: Partial<ToastTheme['typography']>;
};

export type ToastLayoutRenderProps = {
  toast: ResolvedToast;
  dismiss: () => void;
  isVisible: boolean;
  index: number;
  totalVisible: number;
  theme: ToastTheme;
  tone: ToastToneTheme;
};

export type ToastLayoutRenderer = (props: ToastLayoutRenderProps) => ReactNode;
export type ToastLayouts = Record<string, ToastLayoutRenderer>;

export type ToastOptions = {
  id?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  type?: ToastTone;
  placement?: ToastPlacement;
  duration?: number;
  autoHide?: boolean;
  host?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  action?: ToastAction;
  layout?: string;
  render?: ToastLayoutRenderer;
  styles?: ToastStyleOverrides;
};

export type InternalToast = ToastOptions & {
  id: string;
  host: string;
  createdAt: number;
};

export type ResolvedToast = Omit<InternalToast, 'type' | 'placement' | 'duration' | 'autoHide'> & {
  type: ToastTone;
  placement: ToastPlacement;
  duration: number;
  autoHide: boolean;
  layout?: string;
  styles?: ToastStyleOverrides;
};

export type ToastViewportProps = {
  host?: string;
  maxVisible?: number;
  offsets?: Partial<Record<ToastPlacement, number>>;
  defaultOptions?: Partial<ToastOptions>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export type ToastProviderProps = {
  children?: ReactNode;
  layouts?: ToastLayouts;
  defaultLayout?: string;
  defaultOptions?: Partial<ToastOptions>;
  maxVisible?: number;
  offsets?: Partial<Record<ToastPlacement, number>>;
  theme?: ToastThemeOverrides;
  renderDefaultViewport?: boolean;
  viewportProps?: Omit<ToastViewportProps, 'host'>;
};

export type ToastApi = {
  show: (toast: ToastOptions) => string;
  hide: (id: string) => void;
  hideAll: (host?: string) => void;
};
