import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'v1_0/authorizations',
    method: 'POST',
    data
  })
}

export function getSmsCode(mobile) {
  return request({
    url: `v1_0/sms/codes/${mobile}`
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: 'v1_0/user'
  })
}

// 获取用户频道列表
export function getUserChannels() {
  return request({
    url: 'v1_0/user/channels'
  })
}
