import { DataSource } from 'typeorm';
import { dbConfiguration } from '../../shared/connection/db_configuration';

async function run() {
  const dataSource = new DataSource(dbConfiguration());
  await dataSource.initialize();

  console.log('🚀 Running seeders...');

  await dataSource.destroy();
  console.log('🎉 All seeders completed!');
}

run().catch((err) => {
  console.error('❌ Error running seeders', err);
  process.exit(1);
});
