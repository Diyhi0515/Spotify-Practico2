import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <Navbar fixed="top" style={{ backgroundColor: '#0a4d2e'}} bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/admin">🎛 Admin Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Administración" id="admin-dropdown">
              <NavDropdown.Item as={Link} to="/admin">Géneros</NavDropdown.Item>
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

export default AdminNavbar