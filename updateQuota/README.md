## Mailcow - Update quota

This tool is made to bulk modifying the quota of mailboxes on mailcow. I made it for my own use and maybe it is useful to someone else. 

I am not affiliated with mailcow in any way. 

More infos about [mailcow](https://mailcow.email/) and the [mailcow API](https://mx.mailcow.email/api/). 
Support mailcow it is great :-) !

### What you need
You need an API key for your mailcow instance.

### Using updateQuota 
```
Usage: updateQuota [options]

Options:
  -V, --version                output the version number
  -s, --serverurl <serverurl>  URL of mailcow server : https://mailcow.example.org
  -a, --apikey <apikey>        APIKEY for mailcow API
  -q, --quota <quota>          New quota in MB - only applied when old quota is lower
  -d, --domain <domain>        Apply quota update to only to this domain
  -f, --force                  Force quota update on ALL mailboxes - handle with care
  -e, --exitonerror            exit on first error
  -h, --help                   display help for command
```

For example:

```
node updateQuota.js -a XXXXX-ZZZZZZ-TTTTT-YYYYY-SSSSS -s https://mailcow.example.com
```

or if you use [precompiled binaries](https://github.com/appcoders/mailcowtools/releases):

```
updateQuota-{version}-{platform} -a XXXXX-ZZZZZZ-TTTTT-YYYYY-SSSSS -s https://mailcow.example.com -q 500 -d example.com
```

Use -e to stop on the first error that occurs.

## Using the source

As usual:
```
yarn install
```

## Pre-built binaries 

I build pre-built with [pkg](https://github.com/vercel/pkg#readme) you can also download [here](https://github.com/appcoders/mailcowtools/releases). 
