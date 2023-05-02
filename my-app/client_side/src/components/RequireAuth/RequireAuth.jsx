import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    const checkToken = async () => {
        const response = await axios.get('http://localhost:3001/api/check-token',{withCredentials:true}).then(()=>{
        setIsAuthenticated(true);
        }).catch(err=>{
            console.error(err);
            setIsAuthenticated(false);
        })
    };
    checkToken();
  }, []);

  if (!isAuthenticated) {
    return navigate('/Signin',{replace:true});
  }

  return children;
};

export default Auth;