# lottery-wap-new

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```bash
npm run build
npm run build --site=amhg   # (eg.site=amhg)
npm run build-all all     # group sites  (tg / cp / all)
```

### Copy dist -> lottery/pc/dist/
```bash
npm run copy amhg           # (eg.site=amhg)
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
## ENV 設定

`請依照環境使用下列檔案`

- 本地 dev.env.js
- 測試機 stage.env.js
- 正式機 prod.env.js

```bash
# 請不要更改
NODE_ENV

# 使用測試機/正式機公鑰
PUBLICKEY: 
  - development
  - production

# 使用明文/密文發送
ENCRYPT:
  - no
  - yes
```