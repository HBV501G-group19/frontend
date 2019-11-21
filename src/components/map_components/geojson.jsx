import { useEffect, useState, useContext } from 'react'
import L from 'leaflet'

import { MapContext } from '../../context/Map'

export const FeatureCollection = ({featureCollection}) => {
  const map = useContext(MapContext)
  const [feature, setFeature] = useState(null)
  useEffect(() => {
    if (map && featureCollection) {
      const f = L.geoJSON(featureCollection)
      f.addTo(map)
      setFeature(f)
      return () => {f.remove()}
    }
  }, [map, featureCollection, setFeature])

  return null
}


