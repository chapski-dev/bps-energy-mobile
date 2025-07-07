import { bare } from '@hot-updater/bare';
import { supabaseDatabase, supabaseStorage } from '@hot-updater/supabase';
import { defineConfig } from 'hot-updater';

import 'dotenv/config';


export default defineConfig({
  build: bare({ enableHermes: true }),
  console: {
    'port': 3000,
  },
  database: supabaseDatabase({
    supabaseAnonKey: process.env.HOT_UPDATER_SUPABASE_ANON_KEY!,
    supabaseUrl: process.env.HOT_UPDATER_SUPABASE_URL!,
  }),
  storage: supabaseStorage({
    bucketName: process.env.HOT_UPDATER_SUPABASE_BUCKET_NAME!,
    supabaseAnonKey: process.env.HOT_UPDATER_SUPABASE_ANON_KEY!,
    supabaseUrl: process.env.HOT_UPDATER_SUPABASE_URL!,
  }),
  updateStrategy: 'fingerprint',
});