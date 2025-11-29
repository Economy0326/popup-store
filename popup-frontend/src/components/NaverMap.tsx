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
  const retryTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!mapRef.current) return  // 맵을 그릴 div가 준비되지 않음

    let cancelled = false

    const initMap = () => {
      if (cancelled) return

      // SDK 로딩이 아직 안 됐으면 조금 있다가 다시 시도
      if (!window.naver || !window.naver.maps) {
        retryTimerRef.current = window.setTimeout(initMap, 100)
        return
      }

      // 여기서부터 SDK 준비완료
      const { naver } = window
      const position = new naver.maps.LatLng(lat, lon)

      // mapInstanceRef 에 맵 객체 저장 (한 번만 생성)
      if (!mapInstanceRef.current) {
        const map = new naver.maps.Map(mapRef.current!, {
          center: position,
          zoom: 16,
        })
        mapInstanceRef.current = map

        markerRef.current = new naver.maps.Marker({
          position,
          map,
        })
      } else {
        // 이미 맵이 생성되어 있으면 위치만 업데이트
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
    }

    initMap()

    return () => {
      cancelled = true
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
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
