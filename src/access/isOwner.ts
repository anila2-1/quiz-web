// src/access/isOwner.ts
import { Access } from 'payload'

export const isOwner: Access = ({ req }) => {
  if (!req.user) return false
  return {
    id: { equals: req.user.id }
  }
}