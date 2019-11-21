import React, { useState, useEffect } from 'react'
import { useAsync } from 'react-async'
import { useHistory } from 'react-router-dom'

import { getDirections } from '../../api/ors'

import { LineString } from './LineString'
import { Marker } from './Marker'

export const RoutePlot = ({ride, origin, destination, token}) => 
{
  const [walks, setWalks] = useState(null)
  const rideEndpoints = [
    ride.origin.coordinates.slice().reverse(),
    ride.destination.coordinates.slice().reverse()
  ]

  const {
    data,
    isPending,
    error,
    run
  } = useAsync({ deferFn: getDirections })

  const history = useHistory()

  const onClick = () => {
    const { id } = ride
    history.push(`/rides/${id}`, {
      ride,
      walks,
      directionsData: data
    })
  }

  const endpoints = [
    {
      origin,
      destination: ride.origin,
      profile: 'foot-walking'
    },
    {
      origin: ride.destination,
      destination,
      profile: 'foot-walking'
    }
  ]

  useEffect(() => {
    run({endpoints}, token)
  }, [ride, origin, destination])

  useEffect(() => {
    if (data) {
      const w = data.map(lineString => {
        const { geometry: {coordinates}, properties} = lineString
        return {coordinates, properties}
      })

      setWalks(w)
    }
  }, [data])

  if (!data || !walks) return null
  
  return (
    <>
      <LineString 
        coordinates={walks[0].coordinates}
        onHover={() => {}}
        onClick={onClick}
        options={{
          color: '#00ffff',
          smoothFactor: 1,
          weigth: 5
        }}
      />
      <Marker
        coordinates={rideEndpoints[0]}
        color={'blue'}
      />
      <LineString 
        coordinates={ride.route.coordinates}
        onHover={() => {}}
        onClick={onClick}
        options={{
          color: '#ff00ff',
          smoothFactor: 1.2,
          weight: 5
        }}
      />
      <Marker 
        coordinates={rideEndpoints[1]}
        color={'red'}
      />
      <LineString 
        coordinates={walks[1].coordinates}
        onHover={() => {}}
        onClick={onClick}
        options={{
          color: '#ffff00',
          smoothFactor: 1,
          weight: 5
        }}
      />
    </>
  )
}

