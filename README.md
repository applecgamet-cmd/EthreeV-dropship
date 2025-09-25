
# Dropship Binary Full — Ready ZIP for E Three V Laptop Trading

This project includes:
- Next.js storefront with sample products (3 laptops)
- Custom binary reseller system (referral codes, binary points, matching bonuses)
- Reseller authentication (username/password), session cookie, login/logout
- Password reset flow (token-based) using nodemailer (requires SMTP config)
- Admin panel (simple) to view orders, resellers, commissions and export payouts
- SQLite DB for easy local run

## Quick start
1. Unzip project
2. `npm install`
3. `npm run migrate`  # creates data/db.sqlite
4. Create `.env.local` with values (example below)
5. `npm run dev`
6. Open http://localhost:3000

## .env.local example
ADMIN_PASS=changeme123
DB_PATH=./data/db.sqlite
REFERRAL_COMMISSION_PERCENT=0.10
BINARY_PAIR_BONUS=500
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=yourpassword

Change ADMIN_PASS to your desired admin password before deploying.

## Notes
- For production use HTTPS (Vercel) so cookies are secure.
- Configure SMTP if you want password reset emails to work.
