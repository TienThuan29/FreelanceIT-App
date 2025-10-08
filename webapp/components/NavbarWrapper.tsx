"use client";

import React from 'react'
import SmartNavbar from './SmartNavbar'

/**
 * NavbarWrapper component để xử lý client-side rendering
 * Giải quyết vấn đề useAuth() không thể gọi từ server-side
 */
const NavbarWrapper: React.FC = () => {
  return <SmartNavbar />
}

export default NavbarWrapper
