<template>
  <div class="login-container">
    <van-nav-bar title="登录" :border="false">
      <template #left>
        <van-icon name="cross" @click="$router.back()" />
      </template>
    </van-nav-bar>

    <van-form @submit="onSubmit" ref="form">
      <van-field v-model="mobile" name="mobile" placeholder="请输入手机号" :rules="rules.mobile">
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>

      <van-field v-model="code" name="code" placeholder="请输入验证码" :rules="rules.code">
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>

        <template #button>
          <van-count-down v-if="isCountDownShow" :time="60 * 1000" @finish="isCountDownShow = false" />
          <van-button v-else size="small" type="default" class="send-sms-btn" round @click="onSendSms">
            获取验证码
          </van-button>
        </template>
      </van-field>

      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, getSmsCode } from '@/api/login'
export default {
  name: 'LoginIndex',
  data() {
    return {
      isCountDownShow: false, // false表示显示【获取验证码】；true表示显示倒计时
      mobile: '', // 手机号
      code: '', // 验证码
      rules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '请输入6位数字验证码' }
        ]
      }
    }
  },
  methods: {
    // 思路: 1. 点击提交
    async onSubmit(values) {
      // 2. 获取到表单的内容
      // 3. 校验内容是否合法: 判空拦截 是否符合特定的规则
      // 4. 提交给后台
      // console.log('submit', values)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const ret = await login(values)
        // 这里就是登录成功了
        this.$toast.success('登录成功')
        this.$store.commit('setUser', ret.data.data)
        this.$router.push('/my')
      } catch (err) {
        console.log('111 err: ', err)
        // js中null undefined 这两个没有任何属性和方法
        // if (err && err.response && err.response.status === 400) {
        if (err?.response?.status === 400) {
          this.$toast.fail('验证码错误')
        } else {
          this.$toast.fail('网络异常')
        }
      }
    },
    // 获取验证码的逻辑 点击【获取验证码】
    async onSendSms() {
      try {
        //  1.1 如果手机号不合法 阻止逻辑往下执行
        const ret = await this.$refs.form.validate('mobile').catch(err => err)
        if (ret) return this.$toast.fail(ret.message)

        // 1.2 如果手机号合法 显示倒计时
        this.isCountDownShow = true
        // 1.3 同时调接口拿验证码
        await getSmsCode(this.mobile)
        this.$toast.success('短信发送成功')
        // 2. 倒计时结束，恢复显示【获取验证码】已在VanCountDown组件的finish事件上处理
      } catch (err) {
        // 3. 如果获取验证码失败，立即恢复显示【获取验证码】
        if (err?.response?.status === 429) {
          this.$toast.fail('短信发送太频繁了')
        } else {
          this.$toast.fail('短信发送失败')
        }
        this.isCountDownShow = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 162px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
