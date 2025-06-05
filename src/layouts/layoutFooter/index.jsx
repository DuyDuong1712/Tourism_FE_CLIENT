import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/footer'

function LayoutFooter() {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    )
}

export default LayoutFooter