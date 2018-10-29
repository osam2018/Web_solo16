<template>
    <div id="app">
        <div id="mainMap"></div>
        <div id="mapController">
            <el-button-group>
                <el-button icon="el-icon-arrow-up" @click="zoomControl(true)" ></el-button>
                <el-button icon="el-icon-arrow-down" @click="zoomControl(false)" ></el-button>
            </el-button-group>
        </div>
        <router-view/>
    </div>
</template>
<script lang="ts">
    declare var google:any;
    var eventBus = MainFacade.getInstance();

    import { Component, Vue } from 'vue-property-decorator';
    import MainFacade from './MainFacade'
    @Component({

    })
    export default class App extends Vue {
        public bus = MainFacade.getInstance();
        public map:any = {};
        public geoc:any = {};
        public markers:any = [];
        public iconBase:string = 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png';
        public centerX:any;
        public llStore:string = "";



        public mounted () {
            this.bus.app = this;
            this.initMap();
        }

        initMap():void {
            this.iconBase = 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png';

            this.map = new google.maps.Map(document.getElementById('mainMap'), {
                center: {lat: 37.5635, lng: 126.9354},
                zoom: 8,
                disableDefaultUI: true,
            });

            this.geoc = new google.maps.Geocoder;

            var markerPos = eventBus.main.coordInfos.ll.split(",", 2);
            this.centerX = new google.maps.Marker({
                position: {lat: parseFloat(markerPos[0]), lng: parseFloat(markerPos[1])},
                map: this.map,
                icon: this.iconBase
            });
            this.geocodeLatLng(eventBus.main.coordInfos.ll);

            this.map.addListener("click", function(e:any){
                var lat = e.latLng.lat();
                var lng = e.latLng.lng();

                eventBus.app.map.setCenter( {lat: lat, lng: lng});
                eventBus.main.changeInfo(lat, lng);
                eventBus.main.addMarker();
                //eventBus.app.geocodeLatLng(lat+","+lng);
            })

            this.map.addListener("rightclick", function(e:any){
                var lat = e.latLng.lat();
                var lng = e.latLng.lng();

                eventBus.main.changeInfo(lat, lng);
                //console.log(lat + " " + lng);
            })
        }

        geocodeLatLng(ll:string) {
            if(this.llStore === ll) {return eventBus.main.coordInfos.name;}
            this.llStore = ll;

            var latlngStr = ll.split(',', 2);
            var ret:string = "";
            var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
            this.geoc.geocode({'location': latlng}, function(results:any, status:any) {
                if (status === 'OK') {
                    if (results[0]) {
                        eventBus.main.changeInfo(parseFloat(latlngStr[0]), parseFloat(latlngStr[1]));
                        eventBus.main.coordInfos.name = results[0].formatted_address;

                    } else {
                        eventBus.main.coordInfos.name = "알수없음";
                    }
                } else {
                    if(status == "ZERO_RESULTS")
                        eventBus.main.coordInfos.name = "알수없음";
                    eventBus.main.coordInfos.name = status;
                }
            });
        }

        addMarker(lat:number, lng:number){
            var marker:any = new google.maps.Marker({
                position: {lat: lat, lng: lng},
                map: this.map,
                index: this.bus.main.markers.length+1,
            });
            this.markers.push(marker);
        }

        setMaponAll(map:any){
            for(var i:number = 0; i < this.markers.length; i++){
                this.markers[i].setMap(map);
            }
        }

        delMarker(idx:number){
            this.setMaponAll(null);
            this.markers.splice(idx, 1);
            this.setMaponAll(this.map);
        }

        zoomControl(isZoom:boolean){
            this.map.setZoom(this.map.zoom + (isZoom ? 1 : -1));
        }

        public onMoveCenter(ll:string){
            var temp = ll.split(",", 2);
            temp = new google.maps.LatLng(temp[0], temp[1]);
            this.map.setCenter(temp);
        }
    }
</script>

<style >
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

    height: 100%;
    width : 100%;
}

    #mainMap {
        position: absolute;
        //z-index: -1;
        width: 100%;
        height: 100%;
        line-height: 100%;

        text-align: center;
        vertical-align: middle;
    }
    #mapController{
        position: absolute;
        bottom: 25px;
        right: 10px;
    }
</style>
