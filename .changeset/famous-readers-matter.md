---
"@coinbase/onchainkit": patch
---

- **docs**: Add isSliced option to the Address component. This allows this component to render the full users address when set to false. Remove the isSliced field from the Name component and update the component to return null if the ENS name is not found for the given address. By @cpcramer #733
