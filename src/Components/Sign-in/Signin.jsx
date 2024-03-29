import React, {useEffect} from 'react'
import './Signin.css'
import video from "../../Assets/video1.mp4";
import {BiUserCircle} from 'react-icons/bi'
import {RiLockPasswordFill} from 'react-icons/ri'
import {AiOutlineFileDone} from 'react-icons/ai'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useHistory } from 'react-router-dom'

import { useState } from "react";
import {
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth, db } from "../../firebase-config";

import { useRef } from "react";
import { doc, getDoc } from 'firebase/firestore';
  

const Singin = () => {
  useEffect(()=>{
    Aos.init({duration: 2000})
  }, [])

  const snackbarRef = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

    let history = useHistory();

    const login = async () => {
    try {
        const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
        );
        const UserRef = doc(db, "users", user.user.uid);
        const data = await getDoc(UserRef);
        localStorage.setItem("user", JSON.stringify(data.data()));
        history.push("/");
        window.location.reload(false);

    } catch (error) {
        console.log(error.message);
        alert("Error somthing went wrong please try again"+error.message); 
        snackbarRef.current.show();
    }
    };

  return (
    <section id='Sign-in' className='Sign-in'>
      <div className="overlay"></div>
      <video src={video} autoPlay loop muted type="video/mp4"></video>

      <div data-aos="fade-down" className="Sign-inContent container">
        <div className="textDiv">
        <span  className="smallText">
        Sign-in Page
        </span>
        <h1 data-aos="fade-down" className="Sign-inTitle">
        Sign in
        </h1>
        </div>

        <from data-aos="fade-down" className="cardDiv grid" onSubmit = {login}>

          <div className="emailInput">
            <label htmlFor="emailName">Enter your email:</label>
            <div className="input flex">
            <input type="text" placeholder='Enter email here...' onChange={(event) => {
            setLoginEmail(event.target.value);
          }}/>
            <BiUserCircle className="icon"/>
            </div>
          </div>

          <div className="PassWordInput">
            <label htmlFor="PassWord">Enter your password:</label>
            <div className="input flex">
            <input type="password"  placeholder='Enter password here...'  onChange={(event) => {
            setLoginPassword(event.target.value);
          }}/>
            <RiLockPasswordFill className="icon"/>
            </div>
          </div>
          <div className="submit flex">
           <AiOutlineFileDone className="icon"/>
           <span type="submit" onClick={login} >Submit</span>
           
          </div>
        </from>

      </div>
    </section>
  )
}

export default Singin