<template>
  <div class="image-processer">
    <div class="image-area" v-if="src">
      <img :src="src">
    </div>
    <uploader
      class="styled-uploader"
      action="http://123.57.138.48/api/upload"
      :showUploadList="false"
      :beforeUpload="commonUploadCheck"
      @onSuccess="({ file }) => handleUploadSuccess(file.resp)">
      <a-button class="uploader-container">
        <UploadOutlined />
        <h4>更换图片</h4>
      </a-button>

      <template #loading>
        <a-button class="uploader-container">
          <LoadingOutlined spin />
          <h4>上传中</h4>
        </a-button>
      </template>

      <template #uploaded>
        <a-button class="uploader-container">
          <UploadOutlined />
          <h4>更换图片</h4>
        </a-button>
      </template>
    </uploader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Uploader from './Uploader.vue'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { commonUploadCheck } from '../helper'

export default defineComponent({
  name: 'ImageProcesser',
  components: {
    Uploader,
    UploadOutlined,
    LoadingOutlined
  },
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const handleUploadSuccess = (resp: any) => {
      emit('change', resp.data.url)
    }

    return {
      commonUploadCheck,
      handleUploadSuccess
    }
  }
})
</script>

<style lang="stylus" scoped>
.image-processer
  width 100%
  margin-bottom 10px
  display flex
  align-items center
  .image-area
    width 100%
    flex 1
    height 60px
    border 1px dashed #ddd
    border-radius 5px
    margin 0 10px
    padding 5px
    display flex
    align-items center
    justify-content center
    img
      max-width 100%
      max-height 100%
  .uploader-container
    width 110px
    display flex
    align-items center
    justify-content center
    padding 5px 10px
    border-radius 5px
    h4
      margin 0
      color inherit
      margin-left 10px
      font-weight normal
</style>
