import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    naver: any
  }
}

type Props = {
  lat: number
  lon: number
}

export default function NaverMap({ lat, lon }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const markerRef = useRef<any | null>(null)

  useEffect(() => {
    // 브라우저 / 네이버 SDK 로드 여부 체크
    if (typeof window === 'undefined') return
    if (!window.naver || !window.naver.maps) return
    if (!mapRef.current) return

    const { naver } = window
    const position = new naver.maps.LatLng(lat, lon)

    // 맵이 아직 없으면 새로 생성
    if (!mapInstanceRef.current) {
      const map = new naver.maps.Map(mapRef.current, {
        center: position,
        zoom: 16,
      })
      mapInstanceRef.current = map

      markerRef.current = new naver.maps.Marker({
        position,
        map,
      })
    } else {
      // 이미 맵이 있으면 위치만 갱신
      const map = mapInstanceRef.current
      map.setCenter(position)

      if (markerRef.current) {
        markerRef.current.setPosition(position)
      } else {
        markerRef.current = new naver.maps.Marker({
          position,
          map,
        })
      }
    }

    // 언마운트 시 마커 정리 (맵은 그대로 두어도 무방)
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [lat, lon])

  return (
    <div
      ref={mapRef}
      className="w-full h-56 rounded-xl2 bg-slate-200"
    />
  )
}
