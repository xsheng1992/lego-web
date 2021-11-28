<template>
  <div class="file-uploader">
    <!-- 普通模式 -->
    <div class="upload-button-container"
      v-if="!drag"
      v-on="events">
      <slot v-if="isUploading" name="loading">
        <a-button :disabled="true">正在上传</a-button>
      </slot>
      <slot v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
        name="uploaded">
        <a-button>点击上传</a-button>
      </slot>
      <slot v-else>
        <a-button>点击上传</a-button>
      </slot>
    </div>
    <!-- 拖拽模式 -->
    <div class="upload-button-container upload-area"
      v-else
      :class="{
        'is-dragover': drag && isDragover
      }"
      v-on="events">
      <slot v-if="isUploading" name="loading">
        <p class="drag-tip">正在上传</p>
      </slot>
      <slot v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
        name="uploaded">
        <p class="drag-tip">点击或拖拽上传</p>
      </slot>
      <slot v-else>
        <p class="drag-tip">点击或拖拽上传</p>
      </slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :style="{ display: 'none' }"
      @change="handleFileChange"
    >
    <ul class="file-list" v-if="showUploadList">
      <li
        :class="`file-item upload-${file.status} ${listType === 'picture' ? 'upload-image-list' : ''}`"
        v-for="file in filesList"
        :key="file.uid">
        <img
          v-if="file.url && listType === 'picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name">
        <span :class="`progress ${ file.progress === 100 ? 'complete' : '' }`"
          :style="{ width: `${file.progress}%` }"></span>
        <template v-if="listType !== 'picture'">
          <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined /></span>
          <span v-else class="file-icon"><FileOutlined /></span>
        </template>
        <span class="filename">{{ file.name }}</span>
        <a-button class="delete-icon" @click="handleFileDelete(file.uid)">
          <DeleteOutlined />
        </a-button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosRequestHeaders } from 'axios'
import { last } from 'lodash-es'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type FileListType = 'picture' | 'text'
type CheckUpload = (file: File) => boolean | Promise<File>

export interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
  resp?: any
  url?: string
  progress: number
}

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>
    },
    name: {
      type: String,
      default: 'file'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    headers: {
      type: Object as PropType<Partial<AxiosRequestHeaders>>,
      default: () => ({})
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object as PropType<{ [key: string]: any }>,
      default: () => ({})
    },
    drag: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String as PropType<FileListType>,
      default: 'text'
    },
    showUploadList: {
      type: Boolean,
      default: true
    }
  },
  components: {
    LoadingOutlined,
    FileOutlined,
    DeleteOutlined
  },
  emits: ['onProgress', 'onSuccess', 'onError', 'onChange'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const filesList = ref<UploadFile[]>([])
    const isDragover = ref(false)

    const isUploading = computed(() => {
      return filesList.value.some(file => file.status === 'loading')
    })

    const lastFileData = computed(() => {
      const lastFile = last(filesList.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp
        }
      }
      return false
    })

    const triggerUpload = () => {
      if (fileInput.value && !isUploading.value) {
        fileInput.value.click()
      }
    }

    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData()
        formData.append(props.name, readyFile.raw)
        readyFile.status = 'loading'
        for (let key in props.data) {
          formData.append(key, props.data[key])
        }
        axios.post(props.action, formData, {
          headers: {
            ...props.headers,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: props.withCredentials,
          onUploadProgress: progressEvent => {
            readyFile.progress = progressEvent.loaded / progressEvent.total * 100 | 0
            context.emit('onProgress', readyFile.progress)
          }
        }).then(resp => {
          readyFile.status = 'success'
          readyFile.resp = resp.data
          context.emit('onChange', { file: readyFile, fileList: filesList.value })
          context.emit('onSuccess', { file: readyFile, fileList: filesList.value })
        }).catch(() => {
          readyFile.status = 'error'
          context.emit('onChange', { file: readyFile, fileList: filesList.value })
          context.emit('onError', { file: readyFile, fileList: filesList.value })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
    }

    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: 'ready',
        raw: uploadedFile,
        progress: 0
      })
      if (props.listType === 'picture') {
        try {
          fileObj.url = URL.createObjectURL(uploadedFile)
        } catch (err) {
          console.error('upload File Error!', err)
        }
      }
      filesList.value.push(fileObj)
      context.emit('onChange', { file: fileObj, fileList: filesList.value })
      if (props.autoUpload) {
        postFile(fileObj)
      }
    }

    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        const uploadedFile = files[0]
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          if (result && result instanceof Promise) {
            result.then(processedFile => {
              if (processedFile instanceof File) {
                addFileToList(processedFile)
              } else {
                throw new Error('上传文件类型不正确')
              }
            }).catch(e => console.error(e))
          } else if (result) {
            addFileToList(uploadedFile)
          }
        } else {
          addFileToList(uploadedFile)
        }
      }
    }

    const uploadFiles = () => {
      filesList.value.filter(file => file.status === 'ready').forEach(readyFile => postFile(readyFile))
    }

    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload
    }

    const handleFileDelete = (id: string) => {
      filesList.value = filesList.value.filter(file => file.uid !== id)
    }

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      beforeUploadCheck(target.files)
    }

    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault()
      isDragover.value = over
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      isDragover.value = false
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files)
      }
    }

    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => { handleDrag(e, true) },
        dragleave: (e: DragEvent) => { handleDrag(e, false) },
        drop: handleDrop
      }
    }

    return {
      fileInput,
      isUploading,
      filesList,
      lastFileData,
      triggerUpload,
      handleFileChange,
      handleFileDelete,
      isDragover,
      events,
      uploadFiles
    }
  },
})
</script>

<style lang="stylus" scoped>
.upload-area
  width 150px
  height 150px
  border 1px dashed #aaa
  display flex
  align-items center
  justify-content center
  cursor pointer
  &.is-dragover
    border-color #1890ff
    background-color rgba(#1890ff, .1)
  .drag-tip
    font-size 12px
    color #666
.file-item
  width 300px
  color #1890ff
  cursor pointer
  display flex
  align-items center
  padding 2px 10px
  border-radius 4px
  overflow hidden
  margin-top 5px
  position relative
  .progress
    height 2px
    position absolute
    background-color #1890ff
    left 0
    bottom 0
    opacity 1
    transition width .1s linear
    &.complete
      opacity 0
      transition opacity .2s .3s ease
  .upload-list-thumbnail
    width 50px
    height 50px
    margin-right 10px
  .file-icon
    display inline-block
    margin-right 10px
    color rgba(#000, .45)
  .filename
    width 100%
    flex 1
    overflow hidden
    text-overflow ellipsis
  .delete-icon
    height auto
    padding 0
    border none
    color rgba(#000, .45)
    margin-left 10px
    background-color transparent
    display none
  &:hover
    background-color #e6f7ff
    .delete-icon
      display block
  &.upload-error
    color #f5222d
    .file-icon,
    .delete-icon
      color #f5222d
      display block
</style>
