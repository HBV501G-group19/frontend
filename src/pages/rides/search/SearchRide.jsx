import React, { useState, useEffect, useContext } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import Async, { useAsync } from 'react-async'
import { LinearProgress } from '@material-ui/core'

import { AuthenticationContext } from '../../../context/Authentication'

import { getDirections } from '../../../api/ors'
import { getConvinientRides } from '../../../api/rides'

import { SearchRideForm } from './components/SearchRideForm'
import { StyledLink as Link, Column } from '../../../components/styles'

import { LineString } from '../../../components/map_components/LineString'
import { Marker } from '../../../components/map_components/Marker'
import { RoutePlot } from '../../../components/map_components/RoutePlot'

export const SearchRide = props => {
  const { user: {id}, token } = useContext(AuthenticationContext)
  const [ endpoints, setEndpoints ] = useState([])
  const [ rides, setRides ] = useState()
  const {
    data,
    isPending,
    error,
    run
  } = useAsync({deferFn: getConvinientRides})

  const searchForRides = ({...args}) => {
    run({
      ...args,
    }, token)
  }

  useEffect(() => {
    if (data && data.length > 0) 
      setRides(data)
  }, [data, setRides])

  const selectRide = (currRide) => {
    const { id } = currRide
    const ride = rides.find(({id: rId}) => id === rId)
    setRides([ride])
  }

  return (
    <Column>
      <h2>Search for Rides</h2>
      {isPending && <LinearProgress style={{ width: '100%' }}/>}
      {error && <p>Something went wrong :(</p>}
      {(data && data.length === 0) && <p>No rides available</p>}
      {data && data.map(ride => (
        <RoutePlot
          key={ride.id}
          ride={ride}
          origin={endpoints.origin}
          destination={endpoints.destination}
          token={token}
          onClick={selectRide}
        />
      ))}
      <SearchRideForm
        submitEndpoints={setEndpoints}
        search={searchForRides}
      />
    </Column>
        )
}


