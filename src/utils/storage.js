// 专门处理数据的存 取的转换操作
export function setItem(key, value) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }

  localStorage.setItem(key, value)
}

export function getItem(key) {
  // 如果是json字符串，可以使用JSON.parse解析
  // 如果不是，则会报错
  let value = localStorage.getItem(key)
  try {
    value = JSON.parse(value)
  } catch (err) {}

  return value
}

export function removeItem(key) {
  localStorage.removeItem(key)
}
