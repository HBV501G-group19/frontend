import { useContext, createContext } from 'react'
import { createStore } from 'mobx-react-lite'

import L from 'leaflet'

const createMapStore = () => ({
  markers: [],
  routes: [],
  location: [],
  map: null,
  initializeMap(id, options) {
    const map = L.map(id, options)
  },

  addMarker({id, coordinates, options, listeners, tooltip}) {
    const newMarker = L.marker(coordinates, options)
    this.markers.push(id)
    newMarker.addTo(map)
  },

  removeMarker(marker) {
  
  },

  addRoute(route) {
  
  },

  removeRoute() {
  
  },

  changeLocation() {
  
  },

  getMarkers() {
    return this.markers
  },

  getRoutes() {
    return this.routes
  },

  getLocation() {
    return this.location
  },
})
