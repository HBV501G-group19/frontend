import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useAsync } from 'react-async'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { LinearProgress } from '@material-ui/core'

import { AuthenticationContext } from '../../context/Authentication'
import { Column } from '../../components/styles'
import { LineString } from '../../components/map_components/LineString'
import { RideInfo } from './components/RideInfo'
import { MessageForm } from './components/MessageForm'
import { MessageList } from '../../components/messages/MessageList'
import { ConvoList } from '../../components/messages/ConvoList'

import { useRide, useUser } from '../../hooks/useData'

const PassengerView = ({ride, driver, walks, user, token}) => (
  <>
      <>
        <RideInfo 
          ride={ride}
          driver={driver}
          walks={walks}
        />
        <MessageList sender={{...user, token}} recipient={driver} ride={ride} />
        <MessageForm sender={user} recipient={driver} ride={ride}/>
      </>
  </>
)

const DriverView = ({user, ride, token}) => {
  return (
    <>
      <ConvoList
        user={user}
        ride={ride}
        token={token}
      />
    </>
  )
}

export const Ride = props => {
  const { state } = useLocation()
  const { params: { id } } = useRouteMatch('/rides/:id')
  const { user, token } = useContext(AuthenticationContext)
  const [ ride, setRide ] = useState(null)
  const [ driver, setDriver ] = useState(null)
  const [ walks, setWalks ] = useState([])

  const {
    isPending: ridePending,
    error: rideError,
    run: rideRun
  } = useRide(setRide, true, token, id)

  const {
    isPending: driverPending,
    error: driverError,
    run: driverRun
  } = useUser(setDriver, true, token, ride && ride.driver)

  useEffect(() => {
    if (!state || !state.ride) {
      rideRun()
    } else {
      setRide(state.ride)
    }
  }, [id])

  useEffect(() => {
    if(ride)
      driverRun()
  }, [ride])

  if (ridePending || driverPending) return <LinearProgress />

  return ride && driver ? (
    <Column>
      <RideInfo 
        ride={ride}
        driver={user}
        walks={walks}
      />
      {
        user.id === driver.id 
          ? <DriverView 
              user={user}
              token={token}
              ride={ride}
            /> 
          : (
            <PassengerView 
              user={user}
              token={token}
              driver={driver}
              ride={ride}
              walks={walks}
            />
          )
      }
      </Column>
    ) : null
}
