# OpenCore composer
Easy and powerful OC customization tool inspired by Docker

## How it works

```
Get Sample.plist   -->   Import patches from oc-compose.yml
                                       |
                                       V
    Export config.plist   <--   Compile patches   -->   Copy .aml files and kexts
              |
              V
Issue validation by ocvalidate
```

## Installation

### Requirements

- NodeJS (idk what version, 14 is ok I guess)
- Brain

### Run

```shell
npm run compose
```