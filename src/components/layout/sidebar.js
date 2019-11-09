import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
    background: rgba(255, 255, 255);
    display: flex;
    z-index: 2000;
    padding: 20px;
    width: 30%;
    flex-direction: column;
`

export const Sidebar = ({children}) => (
    <Section>
        <h1>Hopon</h1>
        {children}
    </Section>
)
