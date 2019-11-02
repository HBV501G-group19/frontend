import React from 'react'
import styled from 'styled-components'

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
    setValue,
    onKeyEnter = () => {}
}) => {
    return (
            <Label>
                {label}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </Label>
    )
}

