// src/hooks/updateSEOTitle.ts
import { FieldHook } from 'payload';

export const updateSEOTitle: FieldHook = ({ data }) => {
  if (data?.siteTitle && !data?.seo?.title) {
    return data.siteTitle;
  }
  return data?.seo?.title;
};