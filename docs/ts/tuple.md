# 数组和元组

## 数组
声明数组的两种方式
```ts
// Array<类型>
const arr1: Array<number> = [100, 200, 300, 400]

// 类型[]
const arr2: string[] = ['a', 'b', 'c', 'd']
```
数组的联合类型
```ts
const arr3: (string | number)[] = [100, 'a']

const arr4: Array<number | string> = [100, 200, 300, 400, 'ccc']
```
数组的任意类型
```ts
const arr5: any[] = [true, 100, undefined, null, 'hello']

const arr6: Array<any> = [true, 100, undefined, null, 'hello']
```

## 元组
ts中的元组类型就是对数组的扩展，元组严格限制类型、长度、位置。
```ts
let arr1: [boolean, string, number] = [true, 'hello', 123456]

arr1 = [1, 'hello', 123456] //Error 类型报错
arr1 = [true, 'hello', 123456, undefined] //Error 长度报错
arr1 = [true, 123456, 'hello'] //Error 位置报错
```

<Vssue />