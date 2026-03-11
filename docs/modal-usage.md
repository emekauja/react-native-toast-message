# Showing Toasts Inside a Modal

React Native `Modal` renders in a separate native layer. A toast viewport mounted only at the app root will not appear above modal content reliably.

The supported pattern is to mount another `ToastViewport` inside the modal subtree and target it with a named `host`.

## Example

```tsx
import React from 'react';
import { Button, Modal, View } from 'react-native';
import { Toast, ToastProvider, ToastViewport } from '@emekauja/react-native-toast-message';

export default function Example() {
  return (
    <ToastProvider>
      <View>
        <Modal transparent visible>
          <View style={{ flex: 1 }}>
            <ToastViewport host='modal' />

            <Button
              title='Show modal toast'
              onPress={() =>
                Toast.show({
                  host: 'modal',
                  title: 'Saved inside modal',
                  type: 'success'
                })
              }
            />
          </View>
        </Modal>
      </View>
    </ToastProvider>
  );
}
```

## Notes

- Keep the root `ToastProvider` mounted once for the app.
- Use a distinct host name for each modal-local viewport.
- `Toast.hideAll('modal')` clears only modal toasts.
- You can give the modal viewport its own `defaultOptions`, `maxVisible`, or offsets if needed.
