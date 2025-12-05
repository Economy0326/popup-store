import { useEffect, useRef } from 'react'
import type { PopupItem } from '../types/popup'

const SEOUL_CENTER = { lat: 37.5665, lon: 126.978 }

interface FavoritesMapProps {
  items: PopupItem[]
}

export default function FavoritesMap({ items }: FavoritesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const openedInfoRef = useRef<any>(null)
  const retryTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    let cancelled = false

    const init = () => {
      if (cancelled) return
      if (!window.naver || !window.naver.maps) {
        retryTimerRef.current = window.setTimeout(init, 120)
        return
      }

      const { naver } = window

      // 지도 최초 생성
      if (!mapInstance.current) {
        mapInstance.current = new naver.maps.Map(mapRef.current, {
          center: new naver.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lon),
          zoom: 11,
        })
      }

      const map = mapInstance.current

      // 기존 마커 정리
      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []

      if (openedInfoRef.current) {
        openedInfoRef.current.close()
        openedInfoRef.current = null
      }

      if (!items.length) return

      const bounds = new naver.maps.LatLngBounds()
      let hasAnyMarker = false // 에러 체크용

      items.forEach((p) => {
        if (typeof p.lat !== 'number' || typeof p.lon !== 'number') return

        const pos = new naver.maps.LatLng(p.lat, p.lon)
        bounds.extend(pos)
        hasAnyMarker = true // 하나라도 추가되면 true

        const marker = new naver.maps.Marker({
          position: pos,
          map,
        })

        markersRef.current.push(marker)

        // InfoWindow content
        const contentEl = document.createElement('div')
        contentEl.style.padding = '6px 8px'
        contentEl.style.fontSize = '12px'
        contentEl.style.cursor = 'pointer'
        contentEl.innerHTML = `
          <b>${p.title ?? p.name}</b><br/>
          <span style="color:#666">${p.regionLabel ?? ''}</span>
        `

        const info = new naver.maps.InfoWindow({
          content: contentEl,
          clickable: true,
        })

        naver.maps.Event.addListener(marker, 'click', () => {
          if (openedInfoRef.current && openedInfoRef.current !== info) {
            openedInfoRef.current.close()
          }
          info.open(map, marker)
          openedInfoRef.current = info
        })

        naver.maps.Event.addDOMListener(contentEl, 'click', (e: MouseEvent) => {
          e.preventDefault()

          window.setTimeout(() => {
            const targetCard = document.getElementById(`popup-card-${p.id}`)
            if (!targetCard) {
              console.warn('popup card not found for id:', p.id)
              return
            }

            targetCard.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })

            targetCard.classList.add('ring-2', 'ring-blue-500')
            window.setTimeout(() => {
              targetCard.classList.remove('ring-2', 'ring-blue-500')
            }, 1200)
          }, 0)
        })
      })

      // 모든 마커 포함하도록 지도 조정
      if (hasAnyMarker) {
        map.fitBounds(bounds)

        const zoom = map.getZoom()
        if (zoom < 9) map.setZoom(9)
        if (zoom > 15) map.setZoom(15)
      }
    }

    init()

    return () => {
      cancelled = true
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [items])

  return (
    <div
      ref={mapRef}
      className="w-full h-72 sm:h-80 md:h-96 rounded-xl2 overflow-hidden"
    />
  )
}
