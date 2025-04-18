import { mount } from 'svelte'
import './app.css'
import Test from './Test.svelte'

const app = mount(Test, {
  target: document.getElementById('app'),
})

export default app
