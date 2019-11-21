import React, { useLayoutEffect, useState, createContext } from 'react';
import L from 'leaflet';
import styled from 'styled-components'

const tiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const tilesAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

export const MapContext = createContext(null)

export const MapContainer = styled.div`
  height: ${props => props.height}px;
  width: 100%;
`;

export const Leaflet = ({id, options, children}) => {
  const [map, setMap] = useState(null)

  useLayoutEffect(() => {
    const m = L.map(id, options)
    L.tileLayer(tiles, {
      detectRetina: true,
      maxZoom: 20,
      minZoom: 0,
      maxNativeZoom: 17,
      attribution: tilesAttribution
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
