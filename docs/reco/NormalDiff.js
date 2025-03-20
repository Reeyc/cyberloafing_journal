function improvedNormalDiff(oldVNodes, newVNodes) {
  const resultVnodes = []

  // 遍历newVNodes，按照newVNodes的顺序构建最终结果
  newVNodes.forEach(newNode => {
    let exists = false

    // 查找oldVNodes中是否有相同key的节点
    for (let i = 0; i < oldVNodes.length; i++) {
      if (oldVNodes[i] !== null && oldVNodes[i].key === newNode.key) {
        exists = true
        console.log(`节点 key=${newNode.key} 存在，复用旧节点。`)
        // 合并新旧节点，通常是以新节点为主
        resultVnodes.push({ ...oldVNodes[i], ...newNode })
        // 标记为已处理（即不再参与后续匹配）
        oldVNodes[i] = null
        break
      }
    }

    // 添加newVnode新增的节点（oldVnodes没有的节点）
    if (!exists) {
      console.log(`节点 key=${newNode.key} 是新增节点。`)
      resultVnodes.push(newNode)
    }
  })

  // 删除oldVnodes多余节点（newVnodes没有的节点）
  oldVNodes.forEach(oldNode => {
    if (oldNode !== null) {
      console.log(`节点 key=${oldNode.key} 将被删除。`)
    }
  })

  return resultVnodes
}
