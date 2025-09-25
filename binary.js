
const Database = require('better-sqlite3')
const db = new Database(process.env.DB_PATH || './data/db.sqlite')
const { v4: uuidv4 } = require('uuid')

const REFERRAL_PERCENT = parseFloat(process.env.REFERRAL_COMMISSION_PERCENT || '0.10')
const BINARY_BONUS = parseFloat(process.env.BINARY_PAIR_BONUS || '500')

function getResellerByCode(code){
  return db.prepare('SELECT * FROM resellers WHERE code = ?').get(code)
}

function addCommission(reseller_id, order_id, type, amount, note=''){
  const id = uuidv4()
  const stmt = db.prepare('INSERT INTO commissions (id, reseller_id, order_id, type, amount, note) VALUES (?,?,?,?,?)')
  stmt.run(id, reseller_id, order_id, type, amount, note)
  db.prepare('UPDATE resellers SET balance = balance + ? WHERE id = ?').run(amount, reseller_id)
}

function attemptMatchesForReseller(resellerId, triggeringOrderId){
  const rRow = db.prepare('SELECT * FROM resellers WHERE id = ?').get(resellerId)
  if(!rRow) return
  let r = Object.assign({}, rRow)
  while (r.left_points > 0 && r.right_points > 0){
    const tx = db.transaction((resellerId, triggeringOrderId) => {
      db.prepare('UPDATE resellers SET left_points = left_points - 1, right_points = right_points - 1 WHERE id = ?').run(resellerId)
      const id = uuidv4()
      db.prepare('INSERT INTO commissions (id, reseller_id, order_id, type, amount, note) VALUES (?,?,?,?,?,?)')
        .run(id, resellerId, triggeringOrderId, 'binary_bonus', BINARY_BONUS, 'Binary pair match bonus')
      db.prepare('UPDATE resellers SET balance = balance + ? WHERE id = ?').run(BINARY_BONUS, resellerId)
    })
    tx(resellerId, triggeringOrderId)
    const updated = db.prepare('SELECT left_points,right_points FROM resellers WHERE id = ?').get(resellerId)
    r.left_points = updated.left_points
    r.right_points = updated.right_points
  }
}

function propagatePointsAndMatch(seller, orderId){
  let current = seller
  while (current && current.parent_id){
    const parent = db.prepare('SELECT * FROM resellers WHERE id = ?').get(current.parent_id)
    if(!parent) break
    if(current.position === 'L'){
      db.prepare('UPDATE resellers SET left_points = left_points + 1 WHERE id = ?').run(parent.id)
    } else if(current.position === 'R'){
      db.prepare('UPDATE resellers SET right_points = right_points + 1 WHERE id = ?').run(parent.id)
    }
    attemptMatchesForReseller(parent.id, orderId)
    current = parent
  }
}

module.exports = {
  getResellerByCode,
  addCommission,
  propagatePointsAndMatch,
  attemptMatchesForReseller
}
