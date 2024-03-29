import React from 'react'
import styled from 'styled-components'

type ILayout = {
  aside: React.ReactElement
  main: React.ReactElement
}

const Layout: React.FC<ILayout> = props => {
  return (
    <Container>
      <Aside>{props.aside}</Aside>
      <Main>{props.main}</Main>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const Aside = styled.div`
  width: 400px;
`

const Main = styled.div`
  width: 100%;
`

export default Layout
