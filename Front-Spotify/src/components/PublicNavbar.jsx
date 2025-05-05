import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const PublicNavbar = () => {
  return (
    <Navbar fixed="top" style={{ backgroundColor: '#107631'}} bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">🎵 Spotify</Navbar.Brand>
        <Navbar.Toggle aria-controls="public-navbar-nav" />
        <Navbar.Collapse id="public-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default PublicNavbar
