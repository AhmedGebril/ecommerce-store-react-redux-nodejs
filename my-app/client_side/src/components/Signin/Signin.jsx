import React from 'react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import {setName} from '../Store/contextStore'
import {  useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react'


export default function Signin() {
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [email,setEmail]= useState('')
    const [password,setPassword]= useState('')
    const [frontError,setFrontError]= useState('')

    async function log(e){
        e.preventDefault()
        if(email.length != 0 && password.length != 0){
            await axios.post('http://localhost:3001/Signin',{email,password},{withCredentials:true}).then(res=>{
              if(res.status == 201){
                setFrontError('invalid email or password')

              }else{
                setFrontError('')
                dispatch(setName(res.data.username))
                navigate('/',{replace:true})
              }
            }).catch(err=>{
              setFrontError(err.response.data.error)
            })
        }else{
            setFrontError('Please fill all the fields')
        }
    }
    const login = useGoogleLogin({
      onSuccess: (codeResponse) => {
        setUser(codeResponse) 
      },
      onError: (error) => console.log('Login Failed:', error)
  },

  );
  async function getProfile(){
    await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`).then(async (res) => {
      await axios.get(`http://localhost:3001/generate-token?username=${res.data.name}`,{withCredentials:true}).then(res=>{
        console.log(res.data)
        dispatch(setName(res.data.username))
        navigate('/',{replace:true})
      })
      
    }).catch(err=>{
      console.log(err)
    })
  }
  useEffect(()=>{
    if(user){
      getProfile()
    }else{

    }
  },[user])

  return (
    <div className='vh-100 bg-dark'>
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center signinForm">
        <div className='text-white mb-2 signin-back'>
            <i className="fa-sharp fa-solid fa-angles-left me-2"></i>
            <p className='text-white d-inline'>Go Back</p>
        </div>
        <div>
          <h2 className="mb-3 text-white">Log in</h2>
        </div>
          <form className='form-control  p-3' onSubmit={(e)=>{log(e)}}> 
            {frontError?<div className='alert alert-danger m-2'>{frontError}</div>:''}
            <label htmlFor='email' className="mb-2 text-black">Enter Your Email</label>
            <input type="text" placeholder='Enter Email' id="email" className='form-control mb-4 ' onChange={(e)=>{setEmail(e.target.value)}}></input>
            <label htmlFor='password' className="mb-2 text-black">Enter Your password</label>
            <input type="text" placeholder='Enter Password' id="password" className='form-control mb-4' onChange={(e)=>{setPassword(e.target.value)}}></input>
            <button className='btn btn-success d-block mb-2'>Login</button>
            <div className='mb-2'>
            <span className='text-muted already 'onClick={()=>{navigate('/Register')}} style={{cursor:'pointer'}}>Don't have an account?</span>
            </div>
            <div className="row">
            <div className="col-md-3">
              <a className="btn btn-outline-dark" role="button" style={{cursor:'pointer'}} onClick={(e)=>{
                e.preventDefault()
                login()
                }}>
                <img width="20px" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" className='google-btn'/>
                Login with Google
              </a>
            </div>
          </div>
          </form>

        </div>           
    </div>
  )
}
