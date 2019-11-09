import React, {useEffect, useContext, useState} from 'react'
import L from 'leaflet'
import { MapContext } from '../../context/Map'

export const Marker = ({coordinates, options, tooltip, hover = false, onHover, onClick}) => {
  const map = useContext(MapContext)
  const [marker, setMarker] = useState(null)
	let iconClass = 'map-marker-icon'
	iconClass += options.blue ? ' map-marker-icon--blue' : ''

	useEffect(() => {
		if (map) {
			const m = L.marker(coordinates, {
				...options,
				icon: L.divIcon({className: iconClass})
			})
			m.addTo(map)
			m.on('click', onClick)
			if (tooltip) {
				m.bindTooltip(tooltip)
				m.on('tooltipopen', () => {onHover(true)})
				m.on('tooltipclose', () => {onHover(false)})
			}
      setMarker(m)

      return () => {
        m.off('click')
        m.remove()
      }
		}
	}, [coordinates, options, map, setMarker])

	useEffect(() => {
		if(marker) {
			if (hover) marker.openTooltip()
			else marker.closeTooltip()
		}
	}, [marker, hover])
	return null
}

export const attachMarkers = (
  Component, {
    markerArray,
    listeners = [],
    tooltips = [],
    locate = (x, y) => {console.log(x, y)}
  }) => props => {
  const map = useContext(MapContext)
  const [markers, setMarkers] = useState([])
  
  useEffect(() => {
    console.log('marking')
    console.log(markerArray)
    if (map) {
      const ms = markerArray.map(({coords, options = {}}) => {
        const m = L.marker(coords, options)
        m.on('mouseover', e => {
          const {containerPoint: {x, y}} = e
          locate(x, y)
        })
        listeners.forEach(({event, cb}) => {m.on(event, cb)})
        tooltips.forEach(({tooltip, onOpen, onClose}) => {
          m.bindTooltip(tooltip)
          m.on('tooltipopen', onOpen)
          m.on('tooltipclose', onClose)
        })
        m.addTo(map)
      })

      setMarkers(ms)
    }

    return () => { markers.forEach(marker => {
      listeners.forEach(({event}) => marker.off(event))
      map.remove(marker)
    }) }
  }, [markerArray, listeners, tooltips, setMarkers, map])

  return (
    <Component />
  )
}
