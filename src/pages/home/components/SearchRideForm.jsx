import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import day from 'dayjs'
import styled from 'styled-components'

import { GeocodeInput } from './GeocodeInput'
import { Button } from '../../../components/styles'
import { Input } from '../../../components/forms/input'

const Search = styled.form`
    display: flex;
    flex-direction: column;
`

export const SearchRideForm = ({userId, submitData}) => {
  const [origin, setOrigin] = useState({
    label: '',
    geometry: null
  })
  const [destination, setDestination] = useState({
    label: '',
    geometry: null
  })
  const [time, setTime] = useState(() => {
    const date = day()
    return {
      date,
      string: date.format('HH:mm')
    }
  })

  const submit = (e) => {
    e.preventDefault()
    console.log(e)
    if (time && destination.geometry && origin.geometry) {
      submitData({
        userId,
        range: [300],
        origin: origin.geometry,
        destination: destination.geometry,
        departure_time: time.date.format('YYYY-MM-DD HH:mm:ss')
      })
    }
  }

  return (
    <Search onSubmit={submit}>
      <GeocodeInput
        setLocation={setOrigin}
        formLabel="I'm leaving"
        markerColor
      />
      <GeocodeInput
        setLocation={setDestination}
        formLabel="to"
      />
      <input
        value={time.string}
        valueAsDate={time.date}
        onChange={e => {
          e.preventDefault()
          const newDate = day(e.target.valueAsDate)
          setTime({
            date: newDate,
            string: newDate.format('HH:mm')
          })
        }}
          type="time"
        />
        <Button>I need a ride</Button>
      </Search>
  )
}

