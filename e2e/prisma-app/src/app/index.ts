import { PrismaClient } from './prisma/client';

const client = new PrismaClient();

export async function main() {
  console.log('Your Prisma App Here!');
  await client.$connect();
  const res = await client.user.create({
    data: {
      name: 'Harold',
    },
  });
  console.log('PrismaClient.CreateUser: ');
  console.log(res);
}
