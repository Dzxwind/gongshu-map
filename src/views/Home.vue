<template>
  <div class="home">
    <div ref="mapView"></div>
    <div class="search-wrapper">
      <a-input-search class="search-input" v-model="searchKeyWords" placeholder="请输入地名以搜索" enter-button @search="onPlaceSearch"></a-input-search>
      <transition name="fade-right" mode="out-in">
        <div class="result-wrapper" v-if="resultList.length > 0">
          <div class="search-result">
            <div class="search-result_i" v-for="(item, index) in resultList" :class="{active: activeItem ? activeItem.id === item.id : false }" :key="item.id" @click="onResultClick(item)">
              <div class="search-result-name">{{index + 1}}. {{item.name}}</div>
              <div class="search-result-type">{{item.type.split(';')[0]}}</div>
              <div class="search-result-address">{{item.address}}</div>
            </div>
          </div>
          <a-pagination class="search-page" :current="resultPage" size="small" :pageSize="10" simple :total="resultTotal" @change="onPageChange" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import mapSearch from './mapSearch'
export default {
  name: 'Home',
  mixins: [mapSearch]
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  .amap-container {
    width: 100%;
    height: 100%;
  }
  .search-wrapper {
    position: absolute;
    top: 20px;
    left: 20px;
    .search-input {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 300px;
    }
    .result-wrapper {
      position: absolute;
      width: 300px;
      top: 50px;
      left: 10px;
      height: 550px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      .search-result {
        height: calc(100% - 40px);
        overflow-y: auto;
        .search-result_i {
          padding: 10px 20px;
          box-sizing: border-box;
          cursor: pointer;
          transition: all .3s;
          position: relative;
          min-height: 83px;
          &:hover {
            background-color: #f7f7f7;
          }
          &::after {
            content: "";
            display: block;
            height: 1px;
            width: 100%;
            background-color: #e8e8e8;
            position: absolute;
            left: 0;
            bottom: 0;
          }
          &.active {
            background-color: #eee;
          }
          .search-result-name {
            font-size: 16px;
            font-weight: bold;
          }
          .search-result-address {
            color: #999;
            font-size: 12px;
          }
        }
      }
      .search-page {
        text-align: center;
        margin-top: 6px;
      }
    }
  }
}
</style>
