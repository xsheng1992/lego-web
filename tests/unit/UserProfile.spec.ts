import { mount, VueWrapper } from '@vue/test-utils'
import { message } from 'ant-design-vue'
import UserProfile from '@/components/UserProfile.vue'
import store from '@/store/index'

jest.mock('ant-design-vue', () => ({
  message: {
    success: jest.fn()
  }
}))
const mockedRoutes: string[] = []
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: (url: string) => mockedRoutes.push(url)
  })
}))
// jest.mock('vuex', () => ({
//   useStore: () => ({
//     commit: jest.fn()
//   })
// }))

const mockComponent = {
  template: '<div><slot></slot></div>'
}

const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>'
}

const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent
}

let wrapper: VueWrapper<any>

describe('UserProfile.vue', () => {
  jest.useFakeTimers()
  beforeAll(() => {
    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false }
      },
      global: {
        components: globalComponents,
        provide: {
          store
        }
      }
    })
  })

  it('should render login button when login is false', async () => {
    expect(wrapper.get('div').text()).toBe('登陆')
    await wrapper.get('div').trigger('click')
    expect(message.success).toHaveBeenCalled()
    expect(store.state.user.userName).toBe('xiangsheng')
  })

  it('should render username when login is true', async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: 'xiangsheng' }
    })
    expect(wrapper.get('.user-profile-component').html()).toContain('xiangsheng')
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy()
  })

  it('should call logout and show message, call router.push after timeout', async () => {
    // console.log(wrapper.get('.user-profile-dropdown .logout').html())
    expect(store.state.user.isLogin).toBeTruthy()
    await wrapper.get('.user-profile-dropdown .logout').trigger('click')
    expect(store.state.user.isLogin).toBeFalsy()
    expect(message.success).toHaveBeenCalledTimes(1)
    jest.runAllTimers()
    expect(mockedRoutes).toEqual(['/'])
  })

  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset()
  })
})