import React from 'react'
import { Grid,  } from '@material-ui/core'
import { LineString } from '../../../components/map_components/LineString'
import { Form, Input } from '../../../components/forms/input'
import { Button } from '../../../components/styles'
import { MessageForm } from './MessageForm'

const calculateWalkingTime = walks => (
  walks.reduce((acc, {properties: {summary}}) => (
    summary.duration
    ? acc + summary.duration
    : acc
  ), 0)
)

export const RideInfo = ({walks = [], ride, driver}) => (
  <Grid
    container
  >
    {walks.map((walk, index) => (
      <LineString
        key={index}
        coordinates={walk.coordinates}
        options={{
          smoothFactor: 1,
          weigth: 5,
          color: (index % 2) ? '#ffff00' : '#00ffff'
        }}
      />
    ))}
    <LineString
      coordinates={ride.route.coordinates}
      options={{
        smoothFactor: 1,
        weigth: 5,
        color: '#ff00ff'
      }}
    />
    <Grid>
      <h2 style={{textTransform: 'capitalize'}}>{driver.username}'s ride</h2>
      <p>Drive duration: {(ride.duration / 60).toFixed()} minutes</p>
      <p>Free seats: {ride.freeSeats}</p>
      {walks.length > 0 && <p>Walk duration: {(calculateWalkingTime(walks) / 60).toFixed()} minutes</p> }
    </Grid>
  </Grid>
)
