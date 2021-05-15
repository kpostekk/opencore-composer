# OpenCore composer
Easy and powerful OC customization tool inspired by Docker (by docker-compose mostly)

## Installation

### Requirements

- NodeJS (idk what version, 14 is ok I guess)
- Brain

### Run

```shell
npm run compose
```

## Why?
In general, yeah, OpenCore has clean and easy to read config file. It's somehow easy to edit using ProperTree (awesome job CorpNewt),
but manual configuration has some downsides. Easy to make mistakes, no instant validation.

Also migrating config.plist can be a p̴̦̋a̷̳͊i̵̤̍n̶̦̾.

I have observed that my `config.plist`s are just variations of `Sample.plist`. Few changes here and there, experiment with
`PciRoot(0x0)/Pci(0x2,0x0)` and boom, it's ready to rock.

Updates were repetitive too. Find new keys, remove old keys, validate.

So I have created a tool for painless updating OC. And yeah, that's all.

### How it works

```
Get Sample.plist   -->   Import patches from oc-compose.yml
                                       |
                                       V
    Export config.plist   <--   Compile patches   -->   Copy OpenCore base files   -->   Copy .aml files and kexts
              |                
              V                
Issue validation by ocvalidate 
```

### Future?
- Add option to download kexts and SSDTs from repo
- Add `import` statement to download someone composition and edit it
