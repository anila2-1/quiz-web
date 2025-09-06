import { CollectionConfig } from 'payload';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    create: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    update: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    delete: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
  },
  fields: []
};

export default Users;