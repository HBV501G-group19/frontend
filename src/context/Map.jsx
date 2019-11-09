import React, { useLayoutEffect, useState, createContext } from 'react';
import L from 'leaflet';
import styled from 'styled-components'

export const MapContext = createContext(null)

export const MapContainer = styled.div`
  height: ${props => props.height}px;
  width: 100%;
`;


export const Leaflet = ({id, options, children}) => {
  const [map, setMap] = useState(null)

  useLayoutEffect(() => {
    const m = L.map(id, options)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      detectRetina: true,
      maxZoom: 20,
      minZoom: 0,
      maxNativeZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    .addTo(m)
    setMap(m)
    return () => m.remove()
  }, [id, setMap, options])

  return (
    <MapContext.Provider value={map}>
      {children}
    </MapContext.Provider>
  )
}
