import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'


export default function Register() {
  const [username,SetUsername]= useState()
  const [password,SetPassword]= useState()
  const [email,SetEmail]= useState()
  const [Checked,isChecked]= useState(false)
  const [CheckError,setCheckError]= useState('')
  const navigate = useNavigate()

  async function HandleForm(e){
    e.preventDefault()
    let checkbox=document.getElementById('checkbox')
    if(checkbox.checked===true){
      await axios.post('http://localhost:3001/Register',{username,password,email}).then((res)=>{
        console.log(res.status)
        if(res.status==201){
          navigate({pathname: '/Signin'})
          console.log('verfied login')
        }else{
          setCheckError(res.data)
        }
      }).catch(err=>{
        console.log(err)
      })
    }else{
      setCheckError('you must agree on the conditions')
    }
  }

  return (
    <>
    <div className='vh-100 bg-dark'>
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
          <div>
            <h2 className="mb-3 text-white">Register</h2>
          </div>
          <form className='form-control  p-4' onSubmit={(e)=>{HandleForm(e)}}>
            {CheckError?<div className='alert alert-danger m-2'>{CheckError}</div>:''}
            <label htmlFor='name' className="mb-2 text-black">Enter Your username</label>
            <input type="text" placeholder='Enter username' id="name" className='form-control mb-4' onChange={(e)=>{SetUsername(e.target.value)}}></input>
            <label htmlFor='Email' className="mb-2 text-black">Enter Your Email</label>
            <input type="text" placeholder='Enter Email' id="Email" className='form-control mb-4 ' onChange={(e)=>{SetEmail(e.target.value)}}></input>
            <label htmlFor='password' className="mb-2 text-black">Enter Your password</label>
            <input type="text" placeholder='Enter Password' id="password" className='form-control mb-4' onChange={(e)=>{SetPassword(e.target.value)}}></input>
            <label className='mb-3'>
              <input type="checkbox" className="me-2" checked={Checked} onChange={()=>{isChecked(!Checked)}} id='checkbox'/>
              I accept the terms and conditions
            </label>
            <button className='btn btn-success d-block mb-2'>Register</button>
            <span className='text-muted already' style={{cursor:'pointer'}} onClick={()=>{navigate({pathname:'/Signin'})}}>Already have an account?</span>
          </form>
                 
       </div>
               
    </div>
        </>
  )
}
