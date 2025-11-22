import { useEffect, useRef } from 'react'
import type { PopupItem } from '../types/popup'
import { useNavigate } from 'react-router-dom'

declare global {
  interface Window {
    naver: any
  }
}

type Props = {
  items: PopupItem[]
}

const SEOUL_CENTER = { lat: 37.5665, lon: 126.9780 } // 서울 시청 근처

export default function FavoritesMap({ items }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const openedInfoRef = useRef<any | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!window.naver || !mapRef.current) return

    const { naver } = window

    // 지도는 처음 한 번만 생성, 기본 중심은 서울
    if (!mapInstance.current) {
      mapInstance.current = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lon),
        zoom: 11,
      })
    }

    const map = mapInstance.current

    // 이전 마커/말풍선 정리
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
    if (openedInfoRef.current) {
      openedInfoRef.current.close()
      openedInfoRef.current = null
    }

    // 즐겨찾기 없으면 서울 화면만
    if (!items.length) {
      map.setCenter(
        new naver.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lon)
      )
      map.setZoom(11)
      return
    }

    const bounds = new naver.maps.LatLngBounds()
    let hasValidMarker = false

    items.forEach((p) => {
      if (typeof p.lat !== 'number' || typeof p.lon !== 'number') return

      const position = new naver.maps.LatLng(p.lat, p.lon)
      bounds.extend(position)
      hasValidMarker = true

      const marker = new naver.maps.Marker({
        position,
        map,
      })
      markersRef.current.push(marker)

      // InfoWindow content를 실제 DOM 요소로 생성
      const contentEl = document.createElement('div')
      contentEl.style.padding = '6px 8px'
      contentEl.style.fontSize = '12px'
      contentEl.style.cursor = 'pointer'
      contentEl.innerHTML = `
        <b>${p.title}</b><br/>
        <span>${p.region ?? ''}</span>
      `

      // DOM 요소에 직접 클릭 이벤트 연결 (네이버 DOM 이벤트 유틸 사용)
      naver.maps.Event.addDOMListener(contentEl, 'click', (e: MouseEvent) => {
        e.preventDefault()
        navigate(`/popup/${p.id}`)
      })

      const info = new naver.maps.InfoWindow({
        content: contentEl,
        clickable: true,
      })

      // 마커 클릭 → 이전 말풍선 닫고 현재 것만 열기
      naver.maps.Event.addListener(marker, 'click', () => {
        if (openedInfoRef.current && openedInfoRef.current !== info) {
          openedInfoRef.current.close()
        }
        info.open(map, marker)
        openedInfoRef.current = info
      })
    })

    // 마커 기준으로 fitBounds + 줌 클램프
    if (hasValidMarker) {
      map.fitBounds(bounds)

      const zoom = map.getZoom()
      const MIN_ZOOM = 9
      const MAX_ZOOM = 15

      if (zoom < MIN_ZOOM) {
        map.setZoom(MIN_ZOOM)
      } else if (zoom > MAX_ZOOM) {
        map.setZoom(MAX_ZOOM)
      }
    } else {
      map.setCenter(
        new naver.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lon)
      )
      map.setZoom(11)
    }

    // cleanup
    return () => {
      markersRef.current.forEach((m) => m.setMap(null))
      markersRef.current = []
      if (openedInfoRef.current) {
        openedInfoRef.current.close()
        openedInfoRef.current = null
      }
    }
  }, [items, navigate])

  return (
    <div
      ref={mapRef}
      className="w-full h-64 md:h-80 rounded-xl2 bg-slate-200 shadow-soft naver-map-wrapper"
    />
  )
}
