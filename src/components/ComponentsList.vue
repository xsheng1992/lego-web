<template>
  <div class="create-component-list">
    <div v-for="(item, index) in list" :key="index" class="component-item" @click="onItemClick(item)">
      <l-text v-bind="item" />
    </div>
    <styled-uploader @success="onImageUploaded" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import LText from '../components/LText.vue'
import StyledUploader from '../components/StyledUploader.vue'
import { ComponentData } from '../store/editor'
import { imageDefaultProps, TextDefaultProps } from '../defaultProps'
import { UploadResp } from '../extraType'
import { message } from 'ant-design-vue'
import { getImageDimensions } from '../helper'

export default defineComponent({
  name: 'ComponentsList',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  emits: ['on-item-click'],
  components: {
    LText,
    StyledUploader
  },
  setup (props, context) {
    const onItemClick = (props: TextDefaultProps) => {
      const component: ComponentData = {
        name: 'l-text',
        id: uuidv4(),
        props
      }
      context.emit('on-item-click', component)
    }

    const onImageUploaded = (resp: UploadResp) => {
      const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps
        }
      }
      message.success('上传成功!')
      componentData.props.imageSrc = resp.data.url
      getImageDimensions(resp.data.url).then(({ width }) => {
        const maxWidth = 373
        componentData.props.width = ((width > maxWidth) ? maxWidth : width) + 'px'
        context.emit('on-item-click', componentData)
      })
    }

    return {
      onItemClick,
      onImageUploaded
    }
  }
})
</script>

<style lang="stylus" scoped>
.component-item
  width 100px
  margin 0 auto
  margin-bottom 15px
</style>
