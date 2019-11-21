import React, { useState, useEffect, useContext } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import Async, { useAsync } from 'react-async'

import { AuthenticationContext } from '../../../context/Authentication'

import { getDirections } from '../../../api/ors'
import { createRide } from '../../../api/rides'

import { CreateRideForm } from './components/CreateRideForm'
import { StyledLink as Link, Column } from '../../../components/styles'

import { FeatureCollection as LineStrings } from '../../../components/map_components/geojson'

export const CreateRide = props => {
  const { user: {id}, token } = useContext(AuthenticationContext)
  const [ endpoints, setEndpoints ] = useState([])
  const [ rideData, setRideData ] = useState(null)
  const [ route, setRoute ] = useState(null)
  const [ payload, setPayload] = useState(null)

  const history = useHistory()

  const {
    isPending: routePending,
    error: routeError,
    data: routeData,
    run: runRoute
  } = useAsync({
    deferFn: getDirections,
  })

  const {
    isPending: createPending,
    error: createError,
    data: createData,
    run: runCreate
  } = useAsync({
    deferFn: createRide,
  })

  const submitEndpoints = endpoints => {
    runRoute(endpoints, token)
  }

  const submitRide = ({seats, origin, destination, departureTime}) => {
    // creating a ride, we only have 1 route
    const { geometry, properties } = routeData[0]
    const { summary: { duration } } = properties
    runCreate(
      {
        duration,
        driverId: id,
        seats,
        origin,
        destination,
        departureTime,
        route: geometry
      },
      token
    )
  }

  if (createData) {
    const {id: rideId} = createData
    history.push(`/rides/${rideId}`, {
      ride: createData
    })
  }

  return (
    <Column>
      <h2>Submit your Ride</h2>
      {createPending ? <p>Creating ride...</p> : null}
      {createError ? <p>Something went wrong :(</p> : null}
      {routeError ?  <p>Error getting route directions</p> : null}
      {routeData ?  <LineStrings featureCollection={routeData} /> : null}
      <CreateRideForm 
        submitEndpoints={submitEndpoints}
        submitRide={submitRide}
      />
    </Column>
      )
}
