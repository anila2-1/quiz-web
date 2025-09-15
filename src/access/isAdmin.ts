// src/access/isAdmin.ts
import { Access } from 'payload'

export const isAdmin: Access = ({ req }) => {
  if (!req.user?.email) return false

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
  return adminEmails.includes(req.user.email)
}
