# Admin Login Credentials

**Keep this file secure.** Do not commit real production credentials to version control.

---

## Default Admin Account (after running seed)

| Field | Value |
|-------|-------|
| **Email** | `admin@lssis.demo` |
| **Password** | `Admin123!` |
| **Role** | admin |

---

## Demo User Account (after running seed)

| Field | Value |
|-------|-------|
| **Email** | `demo@lssis.demo` |
| **Password** | `Demo123!` |
| **Role** | user |

---

## Sign in / Sign up

- **Login URL**: `/login`
- **Sign up URL**: `/signup`
- **Admin dashboard**: `/admin` (requires admin role)

---

## Changing credentials

To change the admin password or add new admin users:

1. Run `npm run db:seed` to reset the database (this will recreate the default admin user).
2. Or use the Admin → Users tab when logged in as admin to create/update users and change roles.

---

**Important:** Change the default credentials before deploying to production.
