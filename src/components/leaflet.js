import L from 'leaflet';
import React, { useEffect, useLayoutEffect, useState, createContext, useContext, useReducer } from 'react';

const options = {
    center: [64.140015, -21.94695],
    zoom: 5
}

export const MapContext = createContext(null)

export const usePath = (coords = [], options = {}) => {
    const map = useContext(MapContext)
    useLayoutEffect(() => {
        if (map) {
            const route = L.polyline(coords, options)
            route.addTo(map)
            return () => route.remove()
        }
    })
}

export const useMarker = (coords, options) => {
    const map = useContext(MapContext)
    const [marker, setMarker] = useState(null)
    useEffect(() => {
        if (map) {
            const m = L.marker(coords, options)

            m.addTo(map)
            setMarker(m)
            return () => m.remove()
        }
    }, [map])

    return marker
}

const mapReducer = (state, {type, payload}) => {
    switch(type) {
        case 'center':
            return {...state, center: payload}
        case 'zoom':
            return {...state, zoom: payload}
        case 'bounds':
            return {...state, bounds: payload}
        case 'size':
            return {...state, size: payload}
        case 'minZoom':
            return {...state, minZoom: payload}
        case 'maxZoom':
            return {...state, maxZoom: payload}
        default:
            return {...state}
    }
}

const mapInitialState = {
    center: [0, 0]
}

const mapEventHandler = cb => (type, getter) => e => {
    const {target} = e
    const payload = target[getter]()
    cb({type, payload})
}

export const useLeaflet = (config = {}, initialState = mapInitialState) => {
    const map = useContext(MapContext)
    const [state, dispatch] = useReducer(mapReducer, initialState)
    const handle = mapEventHandler(dispatch)

    useEffect(() => {
        if (map) {
            const center = handle('center', 'getCenter')
            const zoom = handle('zoom', 'getZoom')
            map.on('moveend', center)
            map.on('zoomend', zoom)
            return () => {
                map.off('moveend', center)
                map.off('zoomend', zoom)
            }
        }
    },[dispatch, map])
    return state
}

export const Leaflet = ({id, children}) => {
    const [map, setMap] = useState(null)

    useLayoutEffect(() => {
        const m = L.map(id, options)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            detectRetina: true,
            maxZoom: 20,
            minZoom: 0,
            maxNativeZoom: 17,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(m)
        setMap(m)
        return () => m.remove()
    }, [id, setMap])

    return (
        <MapContext.Provider value={map}>
            {children}
        </MapContext.Provider>
    )
}
