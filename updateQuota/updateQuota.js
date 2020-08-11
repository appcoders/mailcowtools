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
const version = require('./package').version;


let axiosInstance = null;

const configureAxios = () => {
  const instance = axios.create({
    baseURL: program.serverurl,
    headers: { 'X-API-Key': program.apikey, 'Content-Type': 'application/json' }
  });
  return instance;
}

const getAllMailboxes = async () => {
  try {
    const result = await axiosInstance.get('/api/v1/get/mailbox/all');
    if (result.status !== 200 || !Array.isArray(result.data)) {
      console.error(`Error while getting all mailboxes`);
      if (program.exitonerror) {
        process.exit(3);
      }
    }
    console.log(`Found ${result.data.length} mailboxes.`);
    return result.data;
  } catch (error) {
    console.error(`Error while adding Mailbox ${mailboxInfo.local_part}@${mailboxInfo.domain}:\n${error}`);
    process.exit(2);
  }
  return [];
}

const updateMailboxQuota = async (mailbox) => {
  try {
    const updateData = {
      "attr": {
        "quota": mailbox.quota
      },
      "items": [mailbox.username]
    }

    const result = await axiosInstance.post('/api/v1/edit/mailbox', updateData);
    if (result.status !== 200) {
      console.error(`Error while updating mailbox ${mailbox.username}.`);
      if (program.exitonerror) {
        process.exit(3);
      }
    }
    console.log(`Updated mailbox ${mailbox.username} with quota ${mailbox.quota} MB`);
  } catch (error) {
    console.error(`Error while updating mailbox ${mailbox.username}:\n${error}`);
    process.exit(2);
  }
}

const updateMailboxes = async (mailboxes) => {
  console.log(`Beginning update of ${mailboxes.length} mailboxes`);
  mailboxes.map(async (mailbox) => {
    await updateMailboxQuota(mailbox);
  })
}

const main = async () => {
  program.version(version);
  program
    .requiredOption('-s, --serverurl <serverurl>', 'URL of mailcow server : https://mailcow.example.org')
    .requiredOption('-a, --apikey <apikey>', 'APIKEY for mailcow API')
    .requiredOption('-q, --quota <quota>', 'New quota in MB - only applied when old quota is lower')
    .option('-d, --domain <domain>', 'Apply quota update to only to this domain')
    .option('-f, --force', 'Force quota update on ALL mailboxes - handle with care')
    .option('-e, --exitonerror', 'exit on first error');

  program.parse(process.argv);

  if (!program.force && !program.domain) {
    console.error(`You need at least a domain set with -d or --force for update all mailboxes regardless of domain.`);
    process.exit(4);
  }
  axiosInstance = configureAxios();

  const mailboxes = await getAllMailboxes();
  const filteredMailboxesByDomain = program.domain ? mailboxes.filter(mailbox => mailbox.domain === program.domain) : mailboxes;
  const filteredMailboxesByDomainAndQuota = filteredMailboxesByDomain.filter(mailbox => (mailbox.quota / 1024 / 1024) < program.quota);
  if (filteredMailboxesByDomainAndQuota.length===0) {
    console.log(`No mailboxes found with current settings to update.`);
    process.exit(5);
  }
  const updatedQuotaMailboxList = filteredMailboxesByDomainAndQuota.map(mailbox => { return { username: mailbox.username, quota: program.quota }})
  await updateMailboxes(updatedQuotaMailboxList);
}

main();


