import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const AppNavbar = () => {
  return (
    <Navbar fixed="top" style={{ backgroundColor: '#107631'}} bg="success" variant="dark" expand="lg"  >

      <Container>
        <Navbar.Brand as={Link} to="/">🎵 Spotify</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <NavDropdown title="Administración" id="admin-dropdown">
              <NavDropdown.Item as={Link} to="/admin/genres">Géneros</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/artists">Artistas</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/albums">Álbumes</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/songs">Canciones</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
