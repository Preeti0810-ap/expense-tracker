import { useState } from "react";
import axios from "axios";

function Register({ setPage }) {
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const register = async ()=>{
    await axios.post("http://127.0.0.1:5000/register",{
      name,email,password
    })

    alert("Registered. Now login.")
    setPage("login")
  }

  return(
    <div style={{textAlign:"center",marginTop:100}}>
      <h2>Register</h2>
      <input placeholder="name" onChange={e=>setName(e.target.value)}/>
      <br/><br/>
      <input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
      <br/><br/>
      <input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
      <br/><br/>
      <button onClick={register}>Register</button>
    </div>
  )
}

export default Register