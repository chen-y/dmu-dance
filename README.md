
# dmu-dance

一个基于 TypeScript 的弹幕工具, 无依赖，简单使用。

## Install

```bash
npm install dmu-dance
```

## How to use

```typescript
import { DMDance } from 'dmu-dance'

const dm = new DMDance({
  el: document.getElementById('container'),
});

dm.pool = ['这是一条弹幕', '这是另一条弹幕', '这是第三条弹幕']

dm.start();

```