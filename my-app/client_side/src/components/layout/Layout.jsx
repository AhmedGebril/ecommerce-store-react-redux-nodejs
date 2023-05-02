import React, { useState } from 'react';
import HeaderNav from '../HeaderNav/HeaderNav';
import { Outlet } from 'react-router';

const Layout = () => {

  return (
    <>
      <HeaderNav/>
      <div className='container'>
      <Outlet></Outlet>
      </div>
    </>
  );
};

export default Layout;




