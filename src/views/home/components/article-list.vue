<template>
  <!-- 区域滚动:给父容器添加宽或者高 ,当容器超过这个设置后，就会形成区域滚动 -->
  <div class="article-container">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="successText"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <ArticleItem
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          :article="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { loadArticleList } from '@/api/channel'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  props: {
    channel1: {
      type: Object,
      required: true
    }
  },
  components:{
    ArticleItem
  },
  data() {
    return {
      successText: '', // 标识 刷新结果提示文案
      isRefreshLoading: false, // 标识 是否处于下拉刷新中
      list: [], // 文章列表数据
      loading: false, // 标识 是否正在获取列表数据
      error: false, // 标识 获取列表数据异常
      finished: false, // 标识 列表数据已经全部拿到
      timestamp: null // 请求前一页数据时的时间戳参数
    }
  },
  methods: {
    async onRefresh() {
      try {
        // 1. ajax 获取最新的数据
        const ret = await loadArticleList({
          channel_id: this.channel1.id,
          timestamp: Date.now(), // 获取新的传当前时间戳
          with_top: 1 // 课程固定的
        })

        // 模拟测试出异常的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('aaaa')
        // }

        // 2. 异步操作结束(成功/失败) 关闭刷新的loading
        this.isRefreshLoading = false
        // 3. 把数据放在list数组的最前面
        this.list.unshift(...(ret?.data?.data?.results || []))
        // 4. 更新一下提示文案
        this.successText = `刷新成功，更新了${ret.data.data.results.length}条数据`
      } catch (error) {
        this.successText = `刷新失败，请重试`
        this.isRefreshLoading = false
      }
    },
    async onLoad() {
      // 1. 发ajax请求拿数据
      try {
        const ret = await loadArticleList({
          channel_id: this.channel1.id,
          timestamp: this.timestamp || Date.now(), // 获取新的传当前时间戳；获取前一页传指定的时间戳
          with_top: 1 // 课程固定的
        })
        console.log('ret1 ', ret)
        // 自己测试出异常情况的代码
        // if (Math.random() > 0.5) {
        //   throw new Error('模拟的异常')
        // }

        // 2. 如果数据拿到，放入到list数组中; 如果没拿到，就不放list了
        // 后台接口返回的数据是数组，为了保障代码不出错，我们兼容一下 (后台数据 || [])
        this.list.push(...(ret?.data?.data?.results || []))

        // 2.1 如果返回的数据results不是空数组，说明还有下一页 更新下一页的时间戳参数
        if (ret.data.data.results.length) {
          this.timestamp = ret.data.data.pre_timestamp
        }
        // 4. 否则说明数据已经加载完了 把finished改为true
        else {
          this.finished = true
        }

        // 3. 不管成功失败，只要ajax请求结束了，把loading改为false
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  height: 79vh;
  overflow-y: auto;
}
</style>
