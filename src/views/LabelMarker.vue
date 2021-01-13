<template>
  <div class="label-marker" :class="{ active: parent.activeItem ? parent.activeItem.id === detail.id : false }">
    <a-icon :component="markerSVG"></a-icon>
    <div class="marker-text">{{label}}</div>
  </div>
</template>
<script>
import marker from './marker.svg'
export default {
  props: {
    label: Number,
    detail: Object,
    parent: Object
  },
  data() {
    return {
      markerSVG: marker
    }
  },
  methods: {

  },
}
</script>
<style lang="scss" scoped>
.label-marker {
  font-size: 32px;
  color: #f34234;
  transition: all .5s;
  position: relative;
  transform-origin: center bottom;
  &:hover {
    color: #3d93fd;
    transform: scale(1.2);
  }
  &.active {
    color: #3d93fd;
    transform: scale(1.5);
  }
  .marker-text {
    color: #fff;
    font-size: 14px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 22%;
    width: max-content;
  }
}
</style>