import { useStorageLocal } from '~/composables/useStorageLocal'

export const serverUrl = useStorageLocal('bookmarker-server-url', 'http://localhost:5139', { listenToStorageChanges: true })
