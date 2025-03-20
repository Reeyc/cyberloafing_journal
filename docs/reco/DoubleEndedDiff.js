function improvedDoubleEndedDiff(oldVNodes, newVNodes) {
  const resultVnodes = []
  let oldStart = 0,
    oldEnd = oldVNodes.length - 1,
    newStart = 0,
    newEnd = newVNodes.length - 1

  // 1. 头尾指针进行比对
  while (oldStart <= oldEnd && newStart <= newEnd) {
    if (oldVNodes[oldStart] && oldVNodes[oldStart].key === newVNodes[newStart].key) {
      // 旧头 vs 新头：相同，复用，移动指针
      resultVnodes.push(newVNodes[newStart])
      oldStart++
      newStart++
    } else if (oldVNodes[oldEnd] && oldVNodes[oldEnd].key === newVNodes[newEnd].key) {
      // 旧尾 vs 新尾：相同，复用，移动指针
      resultVnodes.push(newVNodes[newEnd])
      oldEnd--
      newEnd--
    } else if (oldVNodes[oldStart] && oldVNodes[oldStart].key === newVNodes[newEnd].key) {
      // 旧头 vs 新尾：相同，复用，移动指针
      resultVnodes.push(newVNodes[newEnd])
      oldStart++
      newEnd--
    } else if (oldVNodes[oldEnd] && oldVNodes[oldEnd].key === newVNodes[newStart].key) {
      // 旧尾 vs 新头：相同，复用，移动指针
      resultVnodes.push(newVNodes[newStart])
      oldEnd--
      newStart++
    } else {
      // 复杂情况（节点顺序不同，需要查找是否存在复用节点）
      let found = false
      for (let i = oldStart; i <= oldEnd; i++) {
        if (oldVNodes[i] && oldVNodes[i].key === newVNodes[newStart].key) {
          // 根据newStart 在 旧VNode 中找匹配项，将其移动
          resultVnodes.push(newVNodes[newStart])
          oldVNodes[i] = null // 标记为已处理
          found = true
          break
        }
      }
      if (!found) {
        // 旧VNode 中没有找到匹配项，说明是新节点，直接插入
        resultVnodes.push(newVNodes[newStart])
      }
      // 更新 newStart
      newStart++
    }
  }

  // 2. 处理多余的新节点（直接插入）
  while (newStart <= newEnd) {
    resultVnodes.push(newVNodes[newStart])
    newStart++
  }

  // 3. 处理多余的旧节点（需要删除）
  while (oldStart <= oldEnd) {
    if (oldVNodes[oldStart] !== null) {
      console.log(`节点 key=${oldVNodes[oldStart].key} 将被删除。`)
    }
    oldStart++
  }

  return resultVnodes
}
