import React from 'react'

const NavbarListMenu = (props) => {
  return (
    <li onClick={props.onClick} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition">
        {props.icon}
        {props.Liname}
    </li>
  )
}

export default NavbarListMenu