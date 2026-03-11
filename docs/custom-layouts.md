# Custom Layouts and Styles

This library supports two customization levels:

1. Slot-based styling on the default layout
2. Full custom renderers through `layouts` or per-toast `render`

## Style Slots

The default layout accepts these slots through `styles`:

- `container`
- `content`
- `leading`
- `textContent`
- `title`
- `subtitle`
- `actionContainer`
- `actionLabel`
- `trailing`
- `closeButton`
- `closeLabel`

Example:

```tsx
Toast.show({
  title: 'Dark toast',
  subtitle: 'Styled with slot overrides',
  styles: {
    container: {
      backgroundColor: '#101828',
      borderColor: '#1d2939'
    },
    title: {
      color: '#ffffff'
    },
    subtitle: {
      color: '#d0d5dd'
    },
    closeLabel: {
      color: '#ffffff'
    }
  }
});
```

Merge order:

1. library defaults
2. `ToastProvider.defaultOptions.styles`
3. `ToastViewport.defaultOptions.styles`
4. per-toast `styles`

## Registering Named Layouts

```tsx
<ToastProvider
  layouts={{
    sheet: ({ toast, dismiss, tone, theme }) => (
      <Pressable
        onPress={dismiss}
        style={{
          backgroundColor: tone.background,
          borderWidth: 1,
          borderColor: tone.border,
          borderRadius: theme.radius.card,
          padding: 16
        }}>
        <Text>{toast.title}</Text>
      </Pressable>
    )
  }}
/>
```

Then target it:

```tsx
Toast.show({
  title: 'Custom sheet',
  layout: 'sheet'
});
```

## Inline Render Override

Use `render` for one-off layouts:

```tsx
Toast.show({
  title: 'Upload completed',
  render: ({ toast, dismiss }) => (
    <Pressable onPress={dismiss} style={{ padding: 16, backgroundColor: '#ecfdf3' }}>
      <Text>{toast.title}</Text>
    </Pressable>
  )
});
```

## Leading and Trailing Content

If you only need light customization, you can keep the default layout and replace small areas:

```tsx
Toast.show({
  title: 'Profile updated',
  leading: <Avatar size={24} source={{ uri: avatarUrl }} />,
  trailing: <StatusDot color='green' />
});
```

Passing `leading: null` suppresses the default tone icon.
