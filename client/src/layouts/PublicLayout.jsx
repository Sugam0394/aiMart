import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import "./Public.css"

function PublicLayout() {
  return (
     <div className='app-layout'>
     <Navbar />

      <main className='app-main'>
        <Outlet />
      </main>

     <Footer />
    </div>
  )
}

export default PublicLayout