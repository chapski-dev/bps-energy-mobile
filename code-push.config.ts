import { CliConfigInterface, ReleaseHistoryInterface } from '@bravemobile/react-native-code-push';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

require('dotenv').config();


const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const bucket = 'codepush';


const Config: CliConfigInterface = {
  bundleUploader: async (
    source: string,
    platform: 'ios' | 'android',
    identifier?: string
  ): Promise<{ downloadUrl: string }> => {
    const dest = `bundles/${platform}/${identifier ?? 'default'}/${path.basename(source)}`;
    const fileBuffer = fs.readFileSync(source);
    const { error } = await supabase.storage.from(bucket).upload(dest, fileBuffer, { upsert: true });
    if (error) throw error;
    const downloadUrl = `${process.env.SUPABASE_STORAGE_URL}/${dest}`;
    return { downloadUrl };
  },

  getReleaseHistory: async (
    targetBinaryVersion: string,
    platform: 'ios' | 'android',
    identifier?: string
  ): Promise<ReleaseHistoryInterface> => {
    const dest = `histories/${platform}/${identifier ?? 'default'}/${targetBinaryVersion}.json`;
    const { data, error } = await supabase.storage.from(bucket).download(dest);
    if (error) return {};
    const contents = await data.arrayBuffer();
    return JSON.parse(Buffer.from(contents).toString());
  },

  setReleaseHistory: async (
    targetBinaryVersion: string,
    jsonFilePath: string,
    releaseInfo: ReleaseHistoryInterface,
    platform: 'ios' | 'android',
    identifier?: string
  ): Promise<void> => {
    const dest = `histories/${platform}/${identifier ?? 'default'}/${targetBinaryVersion}.json`;
    const fileBuffer = fs.readFileSync(jsonFilePath);
    const { error } = await supabase.storage.from(bucket).upload(dest, fileBuffer, { upsert: true });
    if (error) throw error;
  },
};

module.exports = Config;