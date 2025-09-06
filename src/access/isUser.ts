import type { Access } from 'payload';

export const isUser: Access = ({ req }): boolean => {
  return Boolean(req.user);
};
