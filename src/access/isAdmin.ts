// src/access/isAdmin.ts
import { Access } from 'payload'

export const isAdmin: Access = ({ req }) => {
  return req.user?.email === 'w1techy8@gmail.com' || false
}