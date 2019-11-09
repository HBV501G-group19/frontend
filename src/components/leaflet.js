import L from 'leaflet';
import React, { useEffect, useLayoutEffect, useState, createContext, useContext, useReducer } from 'react';

const options = {
    center: [64.140015, -21.94695],
    zoom: 5
}

export const MapContext = createContext(null)

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
