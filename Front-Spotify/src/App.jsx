import React from 'react'
import Navbar from './components/Navbar'
import Router from "./router.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

import AdminNavbar from './components/AdminNavbar'
import PublicNavbar from './components/PublicNavbar'


function App() {
  const isAdminRoute = location.pathname.startsWith('/admin')
  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <PublicNavbar />}
      <div className="container">
        <Router />
      </div>
    </>
  )
}

export default App
