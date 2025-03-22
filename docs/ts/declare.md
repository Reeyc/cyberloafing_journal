# 类型声明文件

单独使用的模块，一般会同时提供一个单独的类型声明文件，把本模块的外部接口的所有类型都写在这个文件里面，便于模块使用者了解接口，也便于编译器检查使用者的用法是否正确。

类型声明文件里面只有类型代码，没有具体的代码实现。它的文件名一般为`[模块名].d.ts`的形式。

```ts
// mylib.d.ts
declare module "mylib" {
  export function add(a: number, b: number): number;
  export interface Person {
    name: string;
    age: number;
  }
  export function greet(person: Person): string;
  const Utils: {
    version: string;
    log(message: string): void;
  };
  export default Utils;
}
```

## 类型声明文件的来源

类型声明文件主要有三种来源：

### 自动推导 

对于 TypeScript 代码，类型系统可以直接从`.ts`或`.tsx`文件中推导类型，不需要额外的`.d.ts`。
```ts
export function add(a: number, b: number): number {
  return a + b;
}
```
这里的`add`函数已经有完整的类型信息，不需要`.d.ts`文件。

---

### 内置类型文件 

安装 TypeScript 时，会同时安装一些内置的类型声明文件，主要是内置的全局对象类型声明，例如：`Object`、`Array`、`HTMLElement`等等。

这些内置文件存放在ts安装目录的 lib 文件夹内，文件名统一为`lib.[description].d.ts`的形式。

ts 编译器会自动根据编译目标`target`的值，加载对应的内置声明文件，所以不需要特别的配置。也可以手动指定编译选项`lib`来指定加载哪些内置声明文件。
```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
  }
}
```

---

### 第三方库的类型声明文件

如果项目中使用了第三方代码库，就需要这个库的类型声明文件。这时分为3种情况：

- **库本身自带了类型声明文件**

一些库本身就带有`.d.ts`类型声明文件，这些声明文件通常在`package.json`中的`types`字段指定：
```json
{
  "name": "axios",
  "types": "index.d.ts"
}
```

---

- **官方维护的 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)**

第三方库如果没有提供类型声明文件，社区往往会提供。ts 社区主要使用 [DefinitelyTyped 仓库](https://github.com/DefinitelyTyped/DefinitelyTyped)，各种类型声明文件都会提交到那里，已经包含了几千个第三方库。

这些声明文件都会作为一个单独的库，发布到 npm 的`@types`名称空间之下。比如，`loadsh`的类型声明文件就发布成`@types/loadsh`这个库，使用时安装这个库就可以了。

TypeScript 会从`node_modules/@types/`目录加载这些库的`index.d.ts`类型文件。
```sh
npm install @types/lodash --save-dev
```

---

- **手写的类型声明**

如果库本身没有自带类型声明文件，社区也没有给出这个库的类型声明文件，ts 会将该模块导出的所有类型和接口都识别为`any`类型。

可以通过`decalre module`来给模块手动扩展类型声明。

```ts
declare module "mylib" {
  export function myFunction(): void;
}
```

## 自动加载
手动编写的类型声明文件，也可以在项目的`tsconfig.json`文件里面进行配置，这样的话，ts 编译器会自动将类型声明文件加入编译，而不必在每个脚本里面引入类型声明文件。

### include
`include`字段指定要编译的文件或目录，并且支持通配符匹配：
```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ]
}
```

### files
`files`字段用于更精确的指定要编译的文件：
```json
{
  "files": [
    "src/main.ts", 
    "types/mylib.d.ts"
  ]
}
```
大多数情况下，`include`可以完全代替`files`，因为它功能更强大，还支持通配符，通常更灵活。但如果只想手动列出需要编译的文件，而不想让 TypeScript 自动匹配其他文件，`files`更适合。

### compilerOptions.typeRoots

`compilerOptions.typeRoots`字段可以重新指定`@types`的目录：
```json
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```
上面示例表示，TypeScript 不再去`node_modules/@types`目录加载类型声明文件，而是去跟当前`tsconfig.json`同级的`typings`和`vendor/types`子目录，加载类型声明文件。

### compilerOptions.types

TypeScript 默认会加载`compilerOptions.typeRoots`下所有模块的类型声明文件，`compilerOptions.types`字段可以手动指定需要加载的模块：
```json
{
  "compilerOptions": {
    "types" : ["loadsh"]
  }
}
```
上面示例表示，只需要加载`typeRoots`下的`loadsh`模块的类型声明文件。

## declare关键字

`declare`关键字通常用于在类型声明文件中描述类型。

### 声明全局变量
```ts
declare var userName: string; //全局变量
declare let userEmail: string; //全局变量
declare const API_URL: string; //全局常量

// 全局函数
declare function getUserInfo(userId: string): void;

// 外部类
declare class ExternalClass {
  constructor(name: string);
  getName(): string;
}

//枚举
declare enum {
  Ok = 200,
  NotModified = 304,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}
```

### 声明全局类型
```ts
declare interface Person {
  name: string;
  age: number;
}

declare type ID = string | number;
```

### 声明全局命名空间
通常是带有子属性的全局变量，可以用`namespace`：
```ts
declare namespace MyNamespace {
  const myVar: string;
  function myFunction(): void;
}
```
然后在代码中可以这样使用：
```ts
MyNamespace.myFunction();
console.log(MyNamespace.myVar);
```

### 扩展模块

通常是第三方模块没有提供声明文件，社区也找不到对应的`@types`文件：

- **给模块声明类型**
```ts
declare module "mylib" {
  export function myFunction(): void;
}
```

- **给模块扩展新类型**
```ts
declare module 'axios' {
  interface IAxiosRequest {
    x: number;
    y: number;
  }
}
```

- **给模块扩展原有类型**
```ts
declare module 'axios' {
  interface AxiosRequestConfig {
    myCode: number | string;
  }
}
```

### 扩展全局变量
```ts
export {};  // 使文件成为模块

declare global {
  interface Document {
    myCustomProperty: string;
  }
}
```
`declare global {}`语法适用于在模块化文件中扩展全局作用域，上面代码给全局变量`Document`对象添加额外了属性`myCustomProperty`。

## 三斜杠命令

`///<reference/>`是 ts 早期模块化的标签, 用来加载类型声明文件。该指令只能出现在文件的最顶端。

- **path**

`path`参数，声明当前脚本依赖的类型文件:
```ts
// main.d.ts文件
/// <reference path="./interfaces.d.ts" />
/// <reference path="./functions.d.ts" />
```
上面例子中，`main.d.ts`依赖于`interfaces.d.ts`和`functions.d.ts`。

---

- **types**

`types`参数，声明当前脚本依赖于某个[DefinitelyTyped 仓库](https://github.com/DefinitelyTyped/DefinitelyTyped)，通常安装在`node_modules/@types`目录。
```ts
// main.d.ts文件
/// <reference types="node" />
```
上面例子中，`main.d.ts`依赖于Nodejs的类型库，也就是`@types/node/index.d.ts`。

---

- **lib**

`lib`参数，声明当前脚本依赖于某个内置的类型库。
```ts
// main.d.ts文件
/// <reference lib="es2017.string" />
```
上面例子中，`main.d.ts`依赖于内置的`lib.es2017.string.d.ts`类型库。

---

:::warning
ES6广泛使用后, `///<reference />`方式在编写 TS 文件中不再推荐使用，更推荐使用`ESModule(export/import)`的方式进行模块化拆分。
:::

<Vssue />