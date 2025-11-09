import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    naver: any
  }
}

export default function NaverMap({
  lat,
  lon,
}: {
  lat: number
  lon: number
}) {
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!window.naver || !mapRef.current) return

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(lat, lon),
      zoom: 16,
    })

    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lon),
      map,
    })
  }, [lat, lon])

  return (
    <div
      ref={mapRef}
      className="w-full h-56 rounded-xl2 bg-slate-200"
    />
  )
}
