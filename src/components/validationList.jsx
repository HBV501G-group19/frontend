import React from 'react'

export const ValidationList = ({errors = []}) => (
    errors.length ? (
        <ul>
            {
                errors.map(error => (
                    <li key={error.field}>
                        <strong>{error.field}</strong>
                        <p>{error.message}</p>
                    </li>
                ))
            }
        </ul>
    ) : null
)

