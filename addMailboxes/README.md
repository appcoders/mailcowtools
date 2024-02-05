## Mailcow - Add Mailboxes

This tool is made to bulk create mailboxes on mailcow. I made it for my own use and maybe it is useful to someone else. 

I am not affiliated with mailcow in any way. 

More infos about [mailcow](https://mailcow.email/) and the [mailcow API](https://mx.mailcow.email/api/). 
Support mailcow it is great :-) !

### What you need
Just create a CSV file (comma-separated) with four columns eg.

```
"joe@example.com","Joe Example","A-Very-Secret-Password",500
"jane@example.com","Jane Example","A-Even-More-Secret-Password",900
```

You MUST not use a header line.

You need an API key for your mailcow instance.

### Using addMailboxes 
```
Usage: addMailboxes [options]

Options:
  -V, --version                  output the version number
  -i, --importfile <importfile>  Path to import file CSV
  -s, --serverurl <serverurl>    URL of mailcow server : https://mailcow.example.org
  -a, --apikey <apikey>          APIKEY for mailcow API
  -e, --exitonerror              exit on first error
  -h, --help                     display help for command
```

For example:

```
node addMailboxes.js -i ./myimportlist -a XXXXX-ZZZZZZ-TTTTT-YYYYY-SSSSS -e -s https://mailcow.example.com
```

or if you use [precompiled binaries](https://github.com/appcoders/mailcowtools/releases):

```
addMailboxes-{version}-{platform} -i ./myimportlist -a XXXXX-ZZZZZZ-TTTTT-YYYYY-SSSSS -e -s https://mailcow.example.com
```

Use -e to stop on the first error that occurs.
!! Make sure you lower the Mailcow Password Policy "System-Configuration-Options-Password Policy" cause for example if policy is set to Password Length 6 and any of the boxes are checked with special characters, accounts that are created with less 5 lowercase letters or other simple passwords are skipped and no errors will be shown. !!


## Using the source

As usual:
```
yarn install
```

## Pre-built binaries 

I build pre-built with [pkg](https://github.com/vercel/pkg#readme) you can also download [here](https://github.com/appcoders/mailcowtools/releases). 
