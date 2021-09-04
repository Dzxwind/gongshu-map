import AMap from 'AMap'
import gongshu_wgs84 from '@/assets/geojson/gongshu.json'
import generateMarker from './generateMarker'
const transCoords = require('coordtransform-cli')
const gongshu = transCoords(gongshu_wgs84, 'wgs84togcj02')
const colorList = [
  '#e74c3c',
  '#e67e22',
  '#f1c40f',
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#c0392b',
  '#d35400',
  '#f39c12',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
]
const middleTeamList = [...new Set(gongshu.features.map(item => item.properties.seconedTeam))]
export default {
  data() {
    return {
      map: null,
      polygonDistrict: null,
      placeSearch: null,
      resultList: [],
      resultMarkers: [],
      resultPage: 1,
      resultTotal: 0,
      searchKeyWords: null,
      activeItem: null,
      labelMarkerList: [],
    }
  },
  methods: {
    mapInit() {
      this.map = new AMap.Map(this.$refs.mapView, {
        zoom: 12,
        viewMode: '3D',
      })
      this.map.on('click', (e) => {
        console.log(e)
      })
    },
    searchInit() {
      this.placeSearch = new AMap.PlaceSearch({
        city: '330100',
        pageSize: 10,
        citylimit: true,
      })
    },
    polygonInit() {
      this.polygonDistrict = new AMap.GeoJSON({
        geoJSON: gongshu,
        getPolygon: (geojson, lnglat) => {
          const areaColor = colorList[middleTeamList.findIndex(item => item === geojson.properties.seconedTeam)]
          let labelMarker = new AMap.Marker({
            name: geojson.properties.name,
            position: geojson.properties.center,
            anchor: 'center',
            content: `<div class="map-label" style="color: ${areaColor}">${geojson.properties.name}</div>`,
          })
          this.labelMarkerList.push(labelMarker)
          this.map.add(labelMarker)
          let polygon = new AMap.Polygon({
            path: lnglat,
            fillColor: areaColor,
            fillOpacity: 0.2,
            strokeColor: areaColor,
            strokeWeight: 3,
            extData: geojson.properties,
          })
          polygon.on('click', (e) => {
            console.log(e)
          })
          return polygon
        },
      })
      this.map.add(this.polygonDistrict)
      this.map.setFitView(this.polygonDistrict.getOverlays())
    },
    onPageChange(val) {
      this.resultPage = val
      this.placeSearch.setPageIndex(val)
      this.onPlaceSearch(this.searchKeyWords)
    },
    onPlaceSearch(val) {
      if (val.length === 0) {
        this.map.remove(this.resultMarkers)
        this.resultMarkers = []
        this.resultList = []
        this.resultTotal = 0
        return
      }
      this.placeSearch.search(val, (status, result) => {
        this.map.remove(this.resultMarkers)
        if (status === 'complete') {
          this.resultTotal = result.poiList.count
          this.resultList = result.poiList.pois
          this.resultMarkers = this.resultList.map((item, index) => {
            const marker = new AMap.Marker({
              content: generateMarker({
                index: index + 1,
                detail: item,
                parent: this,
              }),
              anchor: 'bottom-center',
              position: item.location,
              title: item.name,
              extData: item,
              topWhenClick: true,
            })
            marker.on('click', (e) => {
              this.activeItem = e.target.getExtData()
            })
            this.map.add(marker)
            return marker
          })
          // this.map.setFitView(this.resultMarkers)
        } else {
          this.$message.warning('高德接口发生错误！')
        }
      })
    },
    onResultClick(item) {
      this.activeItem = item
      const containArea = this.polygonDistrict.getOverlays().find((overlay) => overlay.contains(item.location))
      this.openNotification(containArea)
    },
    openNotification(overlay) {
      if (overlay) {
        this.$notification.open({
          message: '区域定位',
          description: (h) => {
            return (
              <span>
                您点击的地点位于
                <div style={`color: ${overlay.getExtData().color}; font-weight: bold; font-size: 18px`}>
                  {overlay.getExtData().firstTeam}
                </div>
                <div style={`color: ${overlay.getExtData().color}; font-weight: bold; font-size: 18px`}>
                  {overlay.getExtData().seconedTeam}
                </div>
                <div style={`color: ${overlay.getExtData().color}; font-weight: bold; font-size: 18px`}>
                  {overlay.getExtData().defendArea}
                </div>
                <div style={`color: ${overlay.getExtData().color}; font-weight: bold; font-size: 18px`}>
                  {overlay.getExtData().name}
                </div>
              </span>
            )
          },
        })
      } else {
        this.$notification.open({
          message: '区域定位',
          description: `您点击的地点不在区域内！`,
        })
      }
    },
  },
  mounted() {
    this.mapInit()
    this.searchInit()
    this.polygonInit()
  },
}
