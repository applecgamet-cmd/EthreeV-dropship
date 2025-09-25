
const fs = require('fs')
const Database = require('better-sqlite3')
const dbFile = process.env.DB_PATH || './data/db.sqlite'
if(!fs.existsSync('./data')) fs.mkdirSync('./data')
const db = new Database(dbFile)

db.exec(`
CREATE TABLE IF NOT EXISTS resellers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  parent_id TEXT,
  position TEXT CHECK(position IN ('L','R')) DEFAULT NULL,
  left_points INTEGER DEFAULT 0,
  right_points INTEGER DEFAULT 0,
  balance REAL DEFAULT 0,
  username TEXT,
  password_hash TEXT,
  session_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  amount REAL,
  buyer_email TEXT,
  reseller_id TEXT,
  reseller_code TEXT,
  matched INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY,
  reseller_id TEXT,
  order_id TEXT,
  type TEXT,
  amount REAL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
  token TEXT PRIMARY KEY,
  reseller_id TEXT,
  expires_at DATETIME,
  used INTEGER DEFAULT 0
);
`)

console.log('DB initialized at', dbFile)
