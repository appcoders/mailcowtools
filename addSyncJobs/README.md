## Mailcow - Add Sync Jobs

This tool is made to bulk create mailboxes on mailcow. I made it for my own use and maybe it is useful to someone else. 

I am not affiliated with mailcow in any way. 

More infos about [mailcow](https://mailcow.email/) and the [mailcow API](https://mx.mailcow.email/api/). 
Support mailcow it is great :-) !

### What you need
Just create a CSV file (comma-separated) with three columns eg.

Source IMAP Server mailbox username, Source IMAP Server mailbox password, Mailcow Mailbox name

```
"joe@oldexample.com","A-Very-Old-Secret-Password","joe@example.com"
"jane@oldexample.com""A-Even-More-Old-Secret-Password","jane@example.com"
```

You MUST not use a header line.

You need an API key for your mailcow instance.

### Using addSyncJobs 
```
Usage: addSyncJobs [options]

Options:
  -V, --version                            output the version number
  -i, --syncjobfile <syncjobfile>          Path to sync job file CSV
  -s, --serverurl <serverurl>              URL of mailcow server : https://mailcow.example.org
  -a, --apikey <apikey>                    APIKEY for mailcow API
  --host1 <host1>                          Hostname of IMAP source server
  --port1 <port1>                          Port of IMAP source server (default: "993")
  --enc1 <enc1>                            Encryption mode (PLAIN, SSL, TLS) of IMAP source server (default: "SSL")
  --timeout1 <timeout1>                    Timeout setting in seconds for IMAP source server (default: 600)
  --inactive                               Sync job is added as inactive
  --minsinterval <minsinterval>            Sync job interval in minutes (default: 20)
  --subfolder2 <subfolder2>                Sync job target server folder name (default: "")
  --maxage <maxage>                        Syncing only last maxage days (0=syncall) (default: 0)
  --maxbytespersecond <maxbytespersecond>  Max sync speed in bytes/s (0=no limit) (default: 0)
  --delete2duplicates <delete2duplicates>  Delete duplicates on target server (1 | 0) (default: 1)
  --delete1                                Delete messages from source server (1 | 0)
  --delete2                                Delete messages from target server which are missing on source server (1 | 0)
  --automap <automap>                      Automap target and source folder (1 | 0) (default: 1)
  --skipcrossduplicates                    Skip duplicates over folders first come, first serve
  --subscribeall <subscribeall>            Subscribe to all folders (default: 1)
  --exclude <exclude>                      Exclude regex elements (default: "(?i)spam|(?i)junk")
  --customparams <customparams>            Your own imapsync params (default: "")
  -e, --exitonerror                        exit on first error
  -h, --help                               display help for command
```

For example:

```
node addSyncJobs.js -i ./syncjobslist -a XXXXX-ZZZZZZ-TTTTT-YYYYY-SSSSS -e -s https://mailcow.example.com --host1 imap.example.com
```

or if you use [precompiled binaries](https://github.com/appcoders/mailcowtools/releases):

```
addSyncJobs-{version}-{platform} -i ./syncjobslist -a XXXXX-ZZZZZZ-TTTTT-YYYYY-SSSSS -e -s https://mailcow.example.com --host1 imap.example.com
```

Use -e to stop on the first error that occurs.

## Using the source

As usual:
```
yarn install
```

## Pre-built binaries 

I build pre-built with [pkg](https://github.com/vercel/pkg#readme) you can also download [here](https://github.com/appcoders/mailcowtools/releases). 
