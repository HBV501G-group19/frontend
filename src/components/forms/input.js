import React from 'react'
import styled from 'styled-components'
import day from 'dayjs'

const Label = styled.label`
    display: flex;
    flex-direction: ${({direction = 'column'}) => direction}
    margin: 5px;
`
export const Input = ({
  label,
  type,
  placeholder,
  value,
  onChange = () => {},
  onKeyEnter = () => {},
  focusRef
}) => {

  const enterHandle = e => {
    e.preventDefault()
    if(e.keyCode === 13) onKeyEnter(e)
  }

  return (
    <Label>
      {label}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyUp={enterHandle}
        ref={focusRef}
      />
    </Label>
  )
}

export const TimeInput = ({
  time,
  format,
  label,
  onChange
}) => {
  return (
    <Label>
      {label}
      <input
        value={time.format(format)}
        onChange={e => {
          e.preventDefault()
          const newDate = day(e.target.valueAsDate)
          onChange(newDate)
        }}
          type="time"
      />
    </Label>
  )
}
