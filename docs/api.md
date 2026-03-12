# API Reference

## Exports

```ts
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToast,
  createToastTheme,
  defaultToastTheme
} from '@emekauja/react-native-toast-message';
```

## `ToastProvider`

```ts
type ToastProviderProps = {
  children?: React.ReactNode;
  layouts?: Record<string, ToastLayoutRenderer>;
  defaultLayout?: string;
  defaultOptions?: Partial<ToastOptions>;
  iconByTone?: Partial<
    Record<'default' | 'success' | 'error' | 'warning' | 'info' | 'x', React.ComponentType>
  >;
  showToneIcons?: boolean;
  maxVisible?: number;
  offsets?: Partial<Record<'top' | 'bottom', number>>;
  theme?: ToastThemeOverrides;
  renderDefaultViewport?: boolean;
  viewportProps?: Omit<ToastViewportProps, 'host'>;
};
```

Behavior:

- owns toast state for all hosts
- renders the default host automatically unless `renderDefaultViewport={false}`
- merges provider defaults before viewport defaults and per-toast overrides
- `iconByTone.x` customizes the close icon separately from leading tone icons
- `showToneIcons={false}` keeps the close button but removes the default leading tone icons

## `useToast()`

```ts
const { show, hide, hideAll } = useToast();
```

- `show(toastOptions)` returns the toast id
- `hide(id)` dismisses one toast
- `hideAll(host?)` clears one host or all hosts

## `Toast`

Imperative singleton mirroring `useToast()`:

```ts
Toast.show({ title: 'Saved' });
Toast.hide(id);
Toast.hideAll();
Toast.hideAll('modal');
```

## `ToastViewport`

```ts
type ToastViewportProps = {
  host?: string;
  maxVisible?: number;
  offsets?: Partial<Record<'top' | 'bottom', number>>;
  defaultOptions?: Partial<ToastOptions>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
```

Use a named viewport to render a dedicated host, especially inside `Modal`.

## `ToastOptions`

```ts
type ToastOptions = {
  id?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  placement?: 'top' | 'bottom';
  duration?: number;
  autoHide?: boolean;
  host?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
    closeOnPress?: boolean;
  };
  layout?: string;
  render?: (props: ToastLayoutRenderProps) => React.ReactNode;
  styles?: ToastStyleOverrides;
};
```

Defaults:

- `type`: `default`
- `placement`: `top`
- `duration`: `4000`
- `autoHide`: `true`
- `host`: `default`

## `ToastLayoutRenderProps`

```ts
type ToastLayoutRenderProps = {
  toast: ResolvedToast;
  dismiss: () => void;
  isVisible: boolean;
  index: number;
  totalVisible: number;
  theme: ToastTheme;
  tone: ToastToneTheme;
  icons: ToastIcons;
};
```

Use this shape for named layouts or inline `render` overrides.

## Theme Helpers

`defaultToastTheme` is the library baseline.

`createToastTheme(overrides)` deep-merges:

- tone colors
- spacing
- radius
- shadow
- typography slots

Typography does not force a font family. The default theme inherits the app/system font unless you override `fontFamily`.
