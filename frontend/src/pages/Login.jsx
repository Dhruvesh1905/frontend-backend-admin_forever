import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');

  const {token, setToken, setUser, navigate, backendUrl} = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const pushLoginEvent = (platform, userId) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'login_success',
      page_type: 'login',
      login_platform: platform,
      user_id: userId,
      user_status: currentState === 'Sign Up' ? 'new' : 'returning',
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', {name,email,password});

        if (response.data.success) {    
          const { user } = response.data;            
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)

          setUser(user); 
          localStorage.setItem("user", JSON.stringify(user));
           
          // Push login_success event to dataLayer
          const userId = parseJwt(response.data.token)?.id;
          const userStatus = 'new';
          localStorage.setItem('user_status', userStatus);
          localStorage.setItem('user_id', userId);

          pushLoginEvent('email', userId);

        }
        else{
          toast.error(response.data.message)
        }
        
      }
      else{
        const response = await axios.post(backendUrl + '/api/user/login', {email, password});

        if(response.data.success){
          const { user } = response.data;
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)

          
          setUser(user); 
          localStorage.setItem("user", JSON.stringify(user));

           // Push login_success event to dataLayer
           const userId = parseJwt(response.data.token)?.id;

           // Store non-PII user values for GA4 custom events
           const userStatus = 'returning';
           localStorage.setItem('user_status', userStatus);
           localStorage.setItem('user_id', userId);

           pushLoginEvent('email', userId);
          }
        else{
          toast.error(response.data.message)
        }
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)      
    }
  }

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  },[token])
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/> } 
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='password' required/>
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login'
          ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p>
          : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
