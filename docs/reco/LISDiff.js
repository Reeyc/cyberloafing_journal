// 获取 最长递增子序列
function getSequence(arr) {
  const result = [] // 存储 LIS 的索引序列
  const pos = [] // 记录当前索引在 result 中的前驱索引
  const predecessor = new Array(arr.length).fill(-1) // 记录 LIS 中元素的前驱索引

  for (let i = 0; i < arr.length; i++) {
    let num = arr[i]
    if (num === -1) continue // -1 代表该元素在旧 VDOM 中不存在

    // 二分查找 LIS 序列中比当前元素小的最大值位置
    let left = 0,
      right = result.length - 1
    while (left <= right) {
      let mid = Math.floor((left + right) / 2)
      if (arr[result[mid]] < num) left = mid + 1
      else right = mid - 1
    }

    if (left < result.length) {
      result[left] = i // 替换当前位置的元素
    } else {
      result.push(i) // 扩展 LIS 序列
    }
    pos[i] = left > 0 ? result[left - 1] : -1 // 记录前驱索引
  }

  // 回溯找到 LIS 的完整索引
  let lastIndex = result.length - 1
  for (let i = result[result.length - 1]; i >= 0; i = pos[i]) {
    result[lastIndex--] = i
  }

  return result
}

function improvedLISDiff(oldVNodes, newVNodes) {
  let oldStart = 0,
    oldEnd = oldVNodes.length - 1
  let newStart = 0,
    newEnd = newVNodes.length - 1
  const resultVnodes = [] // 用于存储最终结果，保持新 VNodes 的顺序

  // 1. 头尾指针优化匹配
  while (oldStart <= oldEnd && newStart <= newEnd) {
    if (oldVNodes[oldStart] && oldVNodes[oldStart].key === newVNodes[newStart].key) {
      resultVnodes.push(newVNodes[newStart]) // 新头 vs 旧头匹配，复用
      oldStart++
      newStart++
    } else if (oldVNodes[oldEnd] && oldVNodes[oldEnd].key === newVNodes[newEnd].key) {
      resultVnodes.push(newVNodes[newEnd]) // 新尾 vs 旧尾匹配，复用
      oldEnd--
      newEnd--
    } else if (oldVNodes[oldStart] && oldVNodes[oldStart].key === newVNodes[newEnd].key) {
      resultVnodes.push(newVNodes[newEnd]) // 新尾 vs 旧头匹配，复用
      oldStart++
      newEnd--
    } else if (oldVNodes[oldEnd] && oldVNodes[oldEnd].key === newVNodes[newStart].key) {
      resultVnodes.push(newVNodes[newStart]) // 新头 vs 旧尾匹配，复用
      oldEnd--
      newStart++
    } else {
      break
    }
  }

  // 2. 建立旧 VDOM 的索引映射
  const oldKeys = new Map()
  for (let i = oldStart; i <= oldEnd; i++) {
    oldKeys.set(oldVNodes[i].key, i)
  }

  // 3. 生成新 VDOM 中的索引数组
  const newIndices = []
  for (let i = newStart; i <= newEnd; i++) {
    if (oldKeys.has(newVNodes[i].key)) {
      newIndices.push(oldKeys.get(newVNodes[i].key)) // 新节点在旧 VDOM 中有匹配项
    } else {
      newIndices.push(-1) // -1 代表新节点
    }
  }

  // 4. 寻找 LIS，标记出不需要移动的节点
  const lis = getSequence(newIndices) // 计算 LIS
  let lisIndex = lis.length - 1

  // 5. 反向遍历新 VDOM 进行插入、移动优化
  for (let i = newIndices.length - 1; i >= 0; i--) {
    const newVNode = newVNodes[newStart + i]
    if (newIndices[i] === -1) {
      // 插入新节点
      console.log(`插入新节点 key=${newVNode.key}`)
      resultVnodes.push(newVNode)
    } else if (lisIndex < 0 || newIndices[i] !== lis[lisIndex]) {
      // 移动节点（只在 LIS 中不匹配时）
      console.log(`移动节点 key=${newVNode.key}`)
      resultVnodes.push(newVNode)
    } else {
      // LIS 匹配，跳过
      lisIndex--
    }
  }

  // 6. 处理删除的旧节点
  while (oldStart <= oldEnd) {
    console.log(`删除旧节点 key=${oldVNodes[oldStart].key}`)
    oldStart++
  }

  return resultVnodes
}
