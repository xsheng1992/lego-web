<template>
  <uploader
    class="styled-uploader"
    action="http://123.57.138.48/api/upload"
    :showUploadList="false"
    :beforeUpload="commonUploadCheck"
    @onSuccess="({ file }) => handleUploadSuccess(file.resp)">
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>上传图片</h4>
    </div>

    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>

    <template #uploaded>
      <div class="uploader-container">
        <FileImageOutlined />
        <h4>上传图片</h4>
      </div>
    </template>
  </uploader>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Uploader from './Uploader.vue'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { commonUploadCheck } from '../helper'

export default defineComponent({
  name: 'StyledUploader',
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined
  },
  emits: ['success'],
  setup(props, { emit }) {
    const handleUploadSuccess = (resp: any) => {
      emit('success', resp)
    }

    return {
      commonUploadCheck,
      handleUploadSuccess
    }
  },
})
</script>

<style lang="stylus" scoped>
.styled-uploader
  .uploader-container
    width 100px
    padding 10px
    color #fff
    background-color #1890ff
    display flex
    justify-content center
    align-items center
    border-radius 5px
    cursor pointer
    transition all .3s cubic-bezier(0.645, 0.045, 0.355, 1)
    &:hover
      background-color #40a9ff
    h4
      color #fff
      margin-bottom 0
      margin-left 10px
</style>
