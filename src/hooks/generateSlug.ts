// src/hooks/generateSlug.ts
import { FieldHook } from 'payload'

export const generateSlug: FieldHook = async ({ value, data, operation }) => {
  if (operation === 'update' && value) return value; // Keep existing slug on update

  if (!data?.title) return undefined;

  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return slug;
};