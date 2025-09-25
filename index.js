
import { useState, useEffect } from 'react'
export default function Admin(){
  const [pass,setPass] = useState('')
  const [data,setData] = useState(null)
  async function load(){
    const res = await fetch('/api/admin/data',{ headers: { 'x-admin-pass': pass } })
    if(res.status===401){ alert('wrong password'); return }
    const j = await res.json(); setData(j)
  }
  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <p>Enter admin password to load dashboard:</p>
      <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin password"/>
      <button onClick={load}>Load</button>
      {data && (
        <div>
          <h3>Resellers</h3>
          <table><thead><tr><th>Code</th><th>Name</th><th>Email</th><th>Balance</th></tr></thead><tbody>{data.resellers.map(r=> (<tr key={r.id}><td>{r.code}</td><td>{r.name}</td><td>{r.email}</td><td>₱{r.balance}</td></tr>))}</tbody></table>
          <h3>Orders</h3>
          <table><thead><tr><th>Order</th><th>Product</th><th>Amount</th><th>Reseller</th></tr></thead><tbody>{data.orders.map(o=> (<tr key={o.id}><td>{o.id}</td><td>{o.product_id}</td><td>₱{o.amount}</td><td>{o.reseller_code||''}</td></tr>))}</tbody></table>
          <p><a href="/api/admin/payouts" target="_blank" rel="noreferrer">Download payouts CSV</a></p>
        </div>
      )}
    </div>
  )
}
