import { mount, shallowMount, VueWrapper } from '@vue/test-utils'
import Uploader from '@/components/Uploader.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

let wrapper: VueWrapper<any>
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })

const mockButtonComponent = {
  template: '<button><slot></slot></button>'
}

const mockComponents = {
  'a-button': mockButtonComponent
}

const setInputValue = (input: HTMLInputElement, file = testFile) => {
  const files = [file] as any
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false
  })
}

describe('Uploader component', () => {
  beforeAll(() => {
    wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      global: {
        stubs: mockComponents
      }
    })
  })

  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button').text()).toBe('点击上传')
    expect(wrapper.get('input[type="file"]').isVisible()).toBeFalsy()
  })
  it('upload process should works fine', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 'success' })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    // button 为 disabled
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')

    // 列表长度修改，并有正确的class
    expect(wrapper.findAll('li').length).toBe(1)
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-loading')

    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')
    // 有正确的class，并且文件名称相对应
    expect(firstItem.classes()).toContain('upload-success')
    expect(firstItem.get('.filename').text()).toBe(testFile.name)
  })
  it('should return error text when post is rejected', async () => {
    mockedAxios.post.mockRejectedValueOnce({ error: 'error' })
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').text()).toBe('正在上传')
    await flushPromises()
    expect(wrapper.get('button').text()).toBe('点击上传')
    // 列表长度增加，并且有相对应的class名
    expect(wrapper.findAll('li').length).toBe(2)
    const lastItem = wrapper.get('li:last-child')
    expect(lastItem.classes()).toContain('upload-error')
    // 点击列表中右侧的按钮删除
    await lastItem.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })
  it('使用slot时需要正确显示内容', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'xyz.url'}})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      global: {
        stubs: mockComponents
      },
      slots: {
        default: '<button>Custom Button</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{ uploadedData }">
          <div class="custom-loaded">{{ uploadedData.url }}</div>
        </template>`
      }
    })

    expect(wrapper.get('button').text()).toBe('Custom Button')
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url')

    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('xyz.url') 
  })

  it('上传前验证', async () => {
    const callback = jest.fn()
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    const checkFileSize = (file: File) => {
      if (file.size > 2) {
        callback()
        return false
      }
      return true
    }
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: checkFileSize
      },
      global: {
        stubs: mockComponents
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)
    expect(callback).toHaveBeenCalled()
  })

  it('测试promise返回状态', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    const failedPromise = (file: File) => {
      return Promise.reject('wrong type')
    }
    const successPromise = (file: File) => {
      const newFile = new File([file], 'new_name.docx', { type: file.type })
      return Promise.resolve(newFile)
    }
    const successPromiseWithWrongType = (file: File) => {
      return Promise.resolve('abcd')
    }

    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
        beforeUpload: failedPromise
      },
      global: {
        stubs: mockComponents
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).not.toHaveBeenCalled()
    expect(wrapper.findAll('li').length).toBe(0)

    await wrapper.setProps({
      beforeUpload: successPromise
    })
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).toHaveBeenCalled()
    expect(wrapper.get('.filename').text()).toBe('new_name.docx')

    await wrapper.setProps({
      beforeUpload: successPromiseWithWrongType
    })
    await wrapper.get('input').trigger('change')
    await flushPromises()
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('测试onChange', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      global: {
        stubs: mockComponents
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    const events = wrapper.emitted('onChange')
    expect(events && events.length).toBe(2)
    // await flushPromises()
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('测试onSuccess和onError', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    mockedAxios.post.mockRejectedValueOnce({ error: 'error' })
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      global: {
        stubs: mockComponents
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    const events = wrapper.emitted('onSuccess')
    expect(events && events.length).toBe(1)

    await wrapper.get('input').trigger('change')
    await flushPromises()
    const eventsError = wrapper.emitted('onError')
    console.log(eventsError)
    expect(eventsError && eventsError.length).toBe(1)
  })

  it('测试onProgress', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      global: {
        stubs: mockComponents
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    // const events = wrapper.emitted('onProgress')
    // expect(events && events.length).toBe(1)
  })

  it('测试拖拽上传功能', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
        drag: true
      },
      global: {
        stubs: mockComponents
      }
    })
    const uploadArea = wrapper.get('.upload-area')
    await uploadArea.trigger('dragover')
    expect(uploadArea.element.classList).toContain('is-dragover')
    await uploadArea.trigger('dragleave')
    expect(uploadArea.element.classList).not.toContain('is-dragover')
    await uploadArea.trigger('drop', {
      dataTransfer: { files: [testFile] }
    })
    expect(mockedAxios.post).toHaveBeenCalled()
    await flushPromises()
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('测试手动上传功能', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
        autoUpload: false
      },
      global: {
        stubs: mockComponents
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(wrapper.findAll('li').length).toBe(1)
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-ready')
    wrapper.vm.uploadFiles()
    expect(mockedAxios.post).toHaveBeenCalled()
    await flushPromises()
    expect(firstItem.classes()).toContain('upload-success')
  })

  it('测试图片列表模式', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    window.URL.createObjectURL = jest.fn(() => '111')
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
        listType: 'picture'
      },
      global: {
        stubs: mockComponents
      }
    })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    await flushPromises()
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.find('.upload-list-thumbnail').exists()).toBeTruthy()
    expect(firstItem.get('.upload-list-thumbnail').attributes('src')).toEqual('111')
  })

  afterEach(() => {
    mockedAxios.post.mockReset()
  })
})