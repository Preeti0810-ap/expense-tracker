import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const token = localStorage.getItem("token")

  const [amount,setAmount]=useState("")
  const [note,setNote]=useState("")
  const [date,setDate]=useState("")
  const [categoryId,setCategoryId]=useState("")
  const [expenses,setExpenses]=useState([])
  const [categories,setCategories]=useState([])

  const fetchExpenses = async ()=>{
    const res = await axios.get("http://127.0.0.1:5000/get-expenses",{
      headers:{Authorization:`Bearer ${token}`}
    })
    setExpenses(res.data)
  }

  const fetchCategories = async ()=>{
    const res = await axios.get("http://127.0.0.1:5000/categories",{
      headers:{Authorization:`Bearer ${token}`}
    })
    setCategories(res.data)
  }

  useEffect(()=>{
    fetchExpenses()
    fetchCategories()
  },[])

  const add = async ()=>{
    await axios.post("http://127.0.0.1:5000/add-expense",
    {category_id:categoryId,amount,note,date},
    {headers:{Authorization:`Bearer ${token}`}})
    fetchExpenses()
  }

  const del = async(id)=>{
    await axios.delete(`http://127.0.0.1:5000/delete-expense/${id}`,
    {headers:{Authorization:`Bearer ${token}`}})
    fetchExpenses()
  }

  return(
    <div style={{padding:40}}>
      <h1>Dashboard</h1>

      <input placeholder="amount" onChange={e=>setAmount(e.target.value)}/>
      <input placeholder="note" onChange={e=>setNote(e.target.value)}/>
      <input type="date" onChange={e=>setDate(e.target.value)}/>

      <select onChange={e=>setCategoryId(e.target.value)}>
        <option>Select</option>
        {categories.map(c=>
          <option key={c.id} value={c.id}>{c.name}</option>
        )}
      </select>

      <button onClick={add}>Add</button>

      <table border="1">
        <tbody>
          {expenses.map(e=>(
            <tr key={e.id}>
              <td>{e.amount}</td>
              <td>{e.note}</td>
              <td>{e.category}</td>
              <td>
                <button onClick={()=>del(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard