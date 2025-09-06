// src/hooks/updateWallet.ts
import { PayloadRequest } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';

export const updateWallet = async ({
  userId,
  amount,
  req,
}: {
  userId: string;
  amount: number;
  req: PayloadRequest;
}) => {
  const payload = await getPayload({ config });
  const member = await payload.findByID({
    collection: 'members',
    id: userId,
  });

  const newBalance = (member.wallet || 0) + amount;
  if (newBalance < 0) throw new Error('Wallet balance cannot be negative');

  await payload.update({
    collection: 'members',
    id: userId,
     data:{
      wallet: newBalance,
      totalPoints: (member.totalPoints || 0) + (amount < 0 ? 0 : amount),
    },
  });
};