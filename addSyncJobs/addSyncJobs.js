// Written by Markus Schicker, markus@appcoders.de
// MIT License

// Copyright (c) 2020 Markus Schicker

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const { program } = require('commander');
const axios = require('axios');
const process = require('process');
const csvtojsonV2 = require("csvtojson/v2");
const { exit } = require('process');
const version = require('./package').version;


let axiosInstance = null;

const configureAxios = () => {
  const instance = axios.create({
    baseURL: program.serverurl,
    headers: { 'X-API-Key': program.apikey, 'Content-Type': 'application/json' }
  });
  return instance;
}

const importSyncJobs = async (filename) => {
  let importJSON = null;

  const settings = {
    "delete2duplicates": program.delete2duplicates ? 1 : 0,
    "custom_params": program.customparams,
    "mins_interval": program.minsinterval,
    "authmech1": "PLAIN",
    "port1": program.port1,
    "timeout1": program.timeout1,
    "skipcrossduplicates": program.skipcrossduplicates ? 1 : 0,
    "active": program.inactive ? 0 : 1,
    "timeout2": 600,
    "authmd51": 0,
    "regextrans2": "",
    "domain2": "",
    "subfolder2": program.subfolder2,
    "enc1": program.enc1,
    "automap": program.automap,
    "subscribeall": program.subscribeall,
    "maxage": program.maxage,
    "host1": program.host1,
    "delete1": program.delete1 ? 1 : 0,
    "exclude": program.exclude,
    "maxbytespersecond": `${program.maxbytespersecond}`,
    "delete2": program.delete2 ? 1 : 0
  }

  try {
    importJSON = await csvtojsonV2({
      noheader: true,
      headers: ['sourceemail', 'sourcepassword', 'targetmailbox']
    }).fromFile(filename);
  } catch (error) {
    console.error(`Error while import:\n${error}`);
    process.exit(-1);
  }
  return importJSON.map(element => {
    return { ...settings, user1: element.sourceemail, username: element.targetmailbox, password1: element.sourcepassword }
  });
}

const addSyncJob = async (syncJobInfo) => {
  try {
    const result = await axiosInstance.post('/api/v1/add/syncjob', syncJobInfo);
    if (result.status !== 200 || !result.data || !result.data.type === 'success') {
      console.error(`Error while adding syncjob ${syncJobInfo.user1} -> ${syncJobInfo.username}`);
      if (program.exitonerror) {
        process.exit(3);
      }
    }
    console.log(`Added syncjob ${syncJobInfo.user1} -> ${syncJobInfo.username}`);
  } catch (error) {
    console.error(`Error while adding syncjob ${syncJobInfo.user1} -> ${syncJobInfo.username}:\n${error}`);
    process.exit(2);
  }
}

const addSyncJobs = async (syncJobsInfos) => {
  console.log(`Beginning adding of ${syncJobsInfos.length} syncjobs`);
  syncJobsInfos.map(async (syncJobInfo) => {
    await addSyncJob(syncJobInfo);
  })
}

const main = async () => {
  program.version(version);

  program
    .requiredOption('-i, --syncjobfile <syncjobfile>', 'Path to sync job file CSV')
    .requiredOption('-s, --serverurl <serverurl>', 'URL of mailcow server : https://mailcow.example.org')
    .requiredOption('-a, --apikey <apikey>', 'APIKEY for mailcow API')
    .requiredOption('--host1 <host1>', 'Hostname of IMAP source server')
    .option('--port1 <port1>', 'Port of IMAP source server', '993')
    .option('--enc1 <enc1>', 'Encryption mode (PLAIN, SSL, TLS) of IMAP source server', 'SSL')
    .option('--timeout1 <timeout1>', 'Timeout setting in seconds for IMAP source server', 600)
    .option('--inactive', 'Sync job is added as inactive')
    .option('--minsinterval <minsinterval>', 'Sync job interval in minutes', 20)
    .option('--subfolder2 <subfolder2>', 'Sync job target server folder name', '')
    .option('--maxage <maxage>', 'Syncing only last maxage days (0=syncall)', 0)
    .option('--maxbytespersecond <maxbytespersecond>', 'Max sync speed in bytes/s (0=no limit)', 0)
    .option('--delete2duplicates <delete2duplicates>', 'Delete duplicates on target server (1 | 0)', 1)
    .option('--delete1', 'Delete messages from source server (1 | 0)')
    .option('--delete2', 'Delete messages from target server which are missing on source server (1 | 0)')
    .option('--automap <automap>', 'Automap target and source folder (1 | 0)', 1)
    .option('--skipcrossduplicates', 'Skip duplicates over folders first come, first serve')
    .option('--subscribeall <subscribeall>', 'Subscribe to all folders', 1)
    .option('--exclude <exclude>', 'Exclude regex elements', '(?i)spam|(?i)junk')
    .option('--customparams <customparams>', 'Your own imapsync params', '')
    .option('-e, --exitonerror', 'exit on first error');

  program.parse(process.argv);

  axiosInstance = configureAxios();

  const syncJobInfos = await importSyncJobs(program.syncjobfile);
  await addSyncJobs(syncJobInfos);
}

main();


