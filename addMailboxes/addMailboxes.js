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
const version = require('./package').version;


let axiosInstance = null;

const configureAxios = () => {
  const instance = axios.create({
    baseURL: program.serverurl,
    headers: { 'X-API-Key': program.apikey, 'Content-Type': 'application/json' }
  });
  return instance;
}

const importFile = async (filename) => {
  let importJSON = null;

  try {
    importJSON = await csvtojsonV2({
      noheader: true,
      headers: ['email', 'name', 'password', 'quota']
    }).fromFile(filename);
  } catch (error) {
    console.error(`Error while import:\n${error}`);
    process.exit(-1);
  }
  return importJSON.map(element => {
    const emailParts = element.email.split('@');
    delete element.email;
    return { ...element, local_part: emailParts[0], domain: emailParts[1], active: "1", password2: element.password }
  });
}

const addMailbox = async (mailboxInfo) => {
  try {
    const result = await axiosInstance.post('/api/v1/add/mailbox', mailboxInfo);
    if (result.status !== 200) {
      console.error(`Error while creating mailbox ${mailboxInfo.local_part}@${mailboxInfo.domain}.`);
      if (program.exitonerror) {
        process.exit(3);
      }
    }
    console.log(`Created mailbox ${mailboxInfo.local_part}@${mailboxInfo.domain} with quota ${mailboxInfo.quota} MB`);
  } catch (error) {
    console.error(`Error while adding Mailbox ${mailboxInfo.local_part}@${mailboxInfo.domain}:\n${error}`);
    process.exit(2);
  }
}

const addMailboxes = async (mailboxInfos) => {
  console.log(`Beginning import of ${mailboxInfos.length} mailboxes`);
  mailboxInfos.map(async (mailboxInfo) => {
    await addMailbox(mailboxInfo);
  })
}

const main = async () => {
  program.version(version);
  
  program
    .requiredOption('-i, --importfile <importfile>', 'Path to import file CSV')
    .requiredOption('-s, --serverurl <serverurl>', 'URL of mailcow server : https://mailcow.example.org')
    .requiredOption('-a, --apikey <apikey>', 'APIKEY for mailcow API')
    .option('-e, --exitonerror', 'exit on first error');

  program.parse(process.argv);
  axiosInstance = configureAxios();

  const mailboxInfos = await importFile(program.importfile);
  await addMailboxes(mailboxInfos);
}

main();


