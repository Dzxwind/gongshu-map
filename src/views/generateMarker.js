import LabelMarker from './LabelMarker'
import Vue from 'vue'
const generateMarker = ({ index, detail, parent }) => {
  const Profile = Vue.extend(LabelMarker)
  const div = document.createElement('div')
  return new Profile({
    propsData: {
      label: index,
      detail,
      parent
    }
  }).$mount(div).$el
}
export default generateMarker
