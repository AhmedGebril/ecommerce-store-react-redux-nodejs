import React from 'react'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { refreshCount, setName } from '../Store/contextStore';

export default function HeaderNav() {
  const  dispatch = useDispatch()
  const counter = useSelector((state)=>state.Store.count)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = useSelector((state)=>state.Store.username)
  const navigate = useNavigate()
  

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function logout(){
    axios.get('http://localhost:3001/logout',{withCredentials:true}).then(()=>{
      localStorage.removeItem('reduxState');
      dispatch(setName(''))
      dispatch(refreshCount())
      navigate('/Signin')
    }).catch(err=>{
      console.log(err)
    })
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3 mb-5">
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mx-auto">
      <li className="nav-item active">
      <NavLink to="/" className="nav-link">Home</NavLink>
      </li>
      {localStorage.getItem('username')?<><li className="nav-item">
        <NavLink  className="nav-link" onClick={()=>{logout()}}>Log out</NavLink>
      </li>
      <li className='nav-item'>
        <a className='nav-link'>Hello {username}</a>
      </li>
      <li className="nav-item">
        <NavLink to="/addProduct" className="nav-link">Add Product</NavLink>
      </li></>:<><li className="nav-item">
        <NavLink to="/Signin" className="nav-link">Sign in</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/Register" className="nav-link">Register</NavLink>
      </li>
      
      </>}
      
    </ul>
    <form className="form-inline my-2 my-lg-0 me-4">
    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
    </form>
    <NavLink to="/Cart" className="position-relative">
            <i className="fa-solid fa-cart-shopping fa-lg text-black"></i>
            {counter>0?<div style={{
              position: 'absolute',
              top: '-12px',
              left: '-12px',
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white'
            }}>{counter}</div>:''}
            
          </NavLink>
  </div>
</nav>

{/* This is the off canvas */}
    <div className="off-canvas-menu">
      <menu className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <li>
          <a href="#" className="fa fa-home"></a>
        </li>
        <li>
          <a href="#" className="fa fa-user"></a>
        </li>
        <li>
          <a href="#" className="fa fa-phone"></a>
        </li>
        <li>
          <a href="#" className="fa fa-globe"></a>
        </li>
        <li>
          <a href="#" className="fa fa-gear"></a>
        </li>
        <li>
          <a href="#" className="fa fa-search"></a>
        </li>
      </menu>
      <div className="content-wrapper">
        <a href="#" onClick={toggleMenu} className="fa fa-bars menu-btn"></a>
      </div>
    </div>

</>
  )
}
