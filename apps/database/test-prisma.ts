import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function testPrismaClient() {
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Prisma client connected successfully');

    // Log available methods to see what's generated
    console.log('Available models:', Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')));
    
    return { success: true };
  } catch (error) {
    console.error('❌ Prisma client test failed:', error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}
