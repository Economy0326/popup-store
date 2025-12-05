import { api } from './client'
import type { PopupItem } from '../types/popup'

export function fetchMyFavorites() {
  return api<{ items: PopupItem[] }>('/api/users/me/favorites')
}

export function addFavorite(popupId: number) {
  return api<{ ok: true; favoriteCount: number }>('/api/favorites', {
    method: 'POST',
    body: JSON.stringify({ popupId })
  })
}

export function removeFavorite(popupId: number) {
  return api<{ ok: true; favoriteCount: number }>(`/api/favorites/${popupId}`, {
    method: 'DELETE'
  })
}