import { DashboardService } from './backend/src/services/DashboardService';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function run() {
  try {
    const stats = await DashboardService.getAdminStats();
    console.log(JSON.stringify(stats, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
