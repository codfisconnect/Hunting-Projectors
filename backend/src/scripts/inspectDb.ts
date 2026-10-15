import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectDb() {
  try {
    const rawTables = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    console.log('STATUS: CONNECTED_SUCCESS');
    console.log('TABLE_COUNT:', rawTables.length);
    console.log('TABLES:', rawTables.map(r => r.table_name));

    // Also check counts for user, product, order if they exist
    const tableNames = new Set(rawTables.map(r => r.table_name.toLowerCase()));
    
    if (tableNames.has('user') || tableNames.has('users') || tableNames.has('User')) {
      const userCount = await prisma.user.count().catch(() => -1);
      console.log('USER_COUNT:', userCount);
    }
    if (tableNames.has('product') || tableNames.has('Product')) {
      const productCount = await prisma.product.count().catch(() => -1);
      console.log('PRODUCT_COUNT:', productCount);
    }
    if (tableNames.has('order') || tableNames.has('Order')) {
      const orderCount = await prisma.order.count().catch(() => -1);
      console.log('ORDER_COUNT:', orderCount);
    }
  } catch (err: any) {
    console.error('INSPECT_ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

inspectDb();
