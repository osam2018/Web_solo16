<template>
    <div class="main">
        <el-container>
            <el-container>
                <el-header class="header">
                    <el-row class="row-bg" justify="space-between">
                        <el-col :span="7"><div class="grid-content headTap">
                            <el-tabs v-model="activeName">
                                <el-tab-pane label="Info" name="first">
                                    <el-row>
                                        <el-col :span="6" style="text-align: right;">
                                            <div style="text-align: left; font-weight: bold;"">
                                                <p>Lat / Long </p>
                                                <p>       UTM </p>
                                                <p>      MGRS </p>
                                                <p>      Name </p>
                                            </div>
                                        </el-col>
                                        <el-col :span="18">
                                            <div style="text-align: left;">
                                                <p>{{coordInfos.ll}}</p>
                                                <p>{{coordInfos.utm}}</p>
                                                <p>{{coordInfos.mgrs}}</p>
                                                <p style="height: 50px; margin-top: -1px;" v-show="coordInfos.name != ''">{{coordInfos.name}}</p>
                                                <p style="height: 50px; margin-top: -1px;" v-show="coordInfos.name == ''"><i class="el-icon-loading"></i></p>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-button plain size="mini" @click="addMarker()" id="addMarker">Add Marker</el-button>
                                </el-tab-pane>
                                <el-tab-pane label="Setting" name="second" style="text-align: center">
                                    <div v-show="!session">
                                        <el-popover
                                                placement="top"
                                                width="160"
                                                v-model="visible3">
                                            <div style="text-align: right; margin: 0">
                                                <el-input placeholder="ID" size="small" v-model="tempId">
                                                </el-input>
                                                <el-input placeholder="Password" size="small" v-model="tempPw" @keydown.enter.native="login()" type="password">
                                                </el-input>
                                                <div style="text-align: left; padding-top: 5px;">
                                                    <el-button type="text" @click="junbee()">&nbsp;Create Account&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                                                    <el-button style="left:0px;" id="login" size="mini" icon="el-icon-check" @click="login()" circle></el-button>
                                                </div>
                                            </div>
                                            <el-button slot="reference" type="primary">&nbsp;Login&nbsp;</el-button>
                                        </el-popover>
                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <el-tooltip effect="dark" content="DBF 파일을 읽어들여 마커를 생성합니다." placement="top-start">
                                            <el-button @click="junbee()">Upload</el-button>
                                        </el-tooltip>
                                    </div>
                                    <div v-show="session">
                                        <el-button-group>
                                            <el-button @click="saveMark()">Save</el-button>
                                            <el-button @click="loadMark()">Load</el-button>
                                        </el-button-group>
                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <el-button @click="logout()">Logout</el-button>
                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <el-tooltip effect="dark" content="DBF 파일을 읽어들여 마커를 생성합니다." placement="top-start">
                                            <el-button @click="junbee()">Upload</el-button>
                                        </el-tooltip>
                                    </div>
                                    <hr/>
                                    <div>

                                        <el-radio-group v-model="markerLabel" style="width: 100%; align-content: center;  float: center;" >
                                            <el-tooltip effect="dark" content="경위도 좌표계입니다." placement="bottom-start">
                                                <el-radio-button label="Lat/Long">&nbsp;&nbsp;Lat / Long&nbsp;&nbsp;</el-radio-button>
                                            </el-tooltip>
                                            <el-tooltip effect="dark" content="WGS 84를 기반으로 한 UTM좌표계입니다." placement="bottom-start">
                                                <el-radio-button label="UTM">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UTM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio-button>
                                            </el-tooltip>
                                            <el-tooltip effect="dark" content="MGRS 군사좌표입니다." placement="bottom-start">
                                                <el-radio-button label="MGRS">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MGRS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-radio-button>
                                            </el-tooltip>
                                        </el-radio-group>
                                        <p style="padding-left: 10px; margin-top: 5px; margin-bottom: 5px;"><i class="el-icon-location"></i>&nbsp;<span style="font-weight: bold;">Label Style </span>&nbsp; 마커의 이름을 지정합니다. </p>
                                    </div>
                                <hr/>
                                    <div>

                                        <el-radio-group v-model="st" @change="setMapType()" style="width: 100%; align-content: center; float: center;" >
                                            <el-tooltip effect="dark" content="일반 지도입니다." placement="bottom-start">
                                                <el-radio-button label="roadmap" class="maptypebtn">Roadmap</el-radio-button>
                                            </el-tooltip>
                                            <el-tooltip effect="dark" content="위성 영상 지도입니다." placement="bottom-start">
                                                <el-radio-button label="satellite" class="maptypebtn">Satellite</el-radio-button>
                                            </el-tooltip>
                                            <el-tooltip effect="dark" content="일반 지도와 위성 영상이 혼합된 지도입니다." placement="bottom-start">
                                                <el-radio-button label="terrain" class="maptypebtn">Terrain</el-radio-button>
                                            </el-tooltip>
                                            <el-tooltip effect="dark" content="위성 영상과 지명을 함께 표시한 지도입니다." placement="bottom-start">
                                                <el-radio-button label="hybrid" class="maptypebtn">Hybrid</el-radio-button>
                                            </el-tooltip>
                                        </el-radio-group>
                                        <p style="padding-left: 10px; margin-top: 5px; margin-bottom: 5px;"><i class="el-icon-picture"></i>&nbsp;<span style="font-weight: bold;">Map Type </span> &nbsp;&nbsp;&nbsp;지도의 유형을 지정합니다.</p>
                                    </div><hr/>
                                </el-tab-pane>
                                <el-tab-pane label="Help" name="third">
                                    <p style="font-weight: bold; text-align: center;">Find Yourself Immediately!</p>
                                    <p style=" text-align: center;">좌표 위치를 직접 검색할 수 있는 지도, 파이시입니다.</p>
                                    <br/>
                                    <p>드래그 : 맵 이동<br/>좌클릭 : 클릭한 지점에 마커생성<br/>우클릭 : 클릭한 지점의 좌표 확인<br/>
                                    검색창에서 엔터 : 검색값으로 좌표 확인<br/>검색창에서 컨트롤+엔터 : 현재 좌표에 마커 생성</p>
                                </el-tab-pane>
                            </el-tabs>

                        </div></el-col>
                    </el-row>
                </el-header>

                <el-footer class="footer">
                    <el-row class="row-bg" :gutter="20">
                        <el-col :span="1.5">
                            <el-button @click="toggleSearch()" :icon ="toggleIcon()" circle></el-button>
                        </el-col>

                        <el-col :span="15"><div class="grid-content bg-purple" v-show="activeSearch">
                            <el-input :placeholder="getPlaceHolder()" v-model="searchInput" class="input-with-select" @keydown.enter.native="insertInput()" @keydown.ctrl.enter.native="addMarker()">
                                <el-select v-model="opt" slot="prepend" placeholder="Select" class="select">
                                    <el-option label="Lat / Long" value="ll"></el-option>
                                    <el-option label="UTM" value="utm"></el-option>
                                    <el-option label="MGRS" value="mgrs"></el-option>
                                </el-select>
                                <el-button slot="append" icon="el-icon-search" @click="insertInput()"></el-button>
                            </el-input>
                        </div></el-col>
                    </el-row>
                </el-footer>
            </el-container>
            <el-aside width="265px">
                <div id="markers" float="right">
                    <li v-for="(item, idx) in markers" class="marker" @scroll="manageScroll()">
                        <el-button-group class="marker_label">
                            <el-button icon="el-icon-location" id="mark_move" size="mini" @click="getMarkerPosition(idx)">{{idx+1}}. {{getMarkerLabel(idx)}}</el-button>
                            <el-button icon="el-icon-close" id="mark_del" size="mini" @click="delMarker(idx)"></el-button>
                        </el-button-group>
                    </li>
                </div>
            </el-aside>
        </el-container>
        <div id="ml" v-show="markerLength">
            <el-popover
                    placement="left"
                    width="240"
                    v-model="visible2">
                <span style="vertical-align: middle">모든 마커를 삭제합니다.</span>
                <div style="text-align: right; margin: 0; float: right">
                    <el-button type="primary" size="mini" @click="delAllMarker()">확인</el-button>
                </div>
                <el-button slot="reference" size="mini">{{markers.length}}</el-button>
            </el-popover>
        </div>
    </div>
</template>

<script lang="ts">
    declare var google:any;
    /*
    declare module '*.json' {
        const data: any
        export default data
    }*/

    //import jd from "../../public/mockup_data/data1.json";

    var utm = require('utm');
    var mgrs = require('mgrs');
    import { Component, Vue } from 'vue-property-decorator';
    import MainFacade from '../MainFacade'

    @Component
    export default class mainPage extends Vue {
        public bus = MainFacade.getInstance();
        public temp:any;
        public st:string = "roadmap";
        public opt:string = 'll';
        public markerLength:boolean = false;
        public visible3:boolean = false;
        public visible2:boolean = true;
        public searchInput:string = "";
        public session:boolean = false;
        public coordInfos:any ={
            ll: "",
            utm: "",
            mgrs: "",
            name: ""
        };
	
		public beforeMount(){
			utm = require('utm');
    		mgrs = require('mgrs');
		}
	
        public mounted(){
            this.bus.main = this;

            this.searchInput = "37.5635, 126.9354";
            this.insertInput(true);
        }

        public markerLabel:string = "Lat/Long";

        public markers:any =[];

        public activeName:string = 'first';
        public activeSearch:boolean = false;

        toggleIcon():string {
            if(this.activeSearch) return "el-icon-close";
            return "el-icon-search";
        }

        getPlaceHolder():string{
            var ret:string = "";
            switch(this.opt) {
                case 'll':
                    ret = "ex. 37.6390, 126.8731";
                    break;
                case 'utm':
                    ret = "ex. 52S 312345 4167890";
                    break;
                case 'mgrs':
                    ret = "ex. 52SCG1234567890";
                    break;
            }

            return ret;
        }

        getMarkerLabel(idx:number):string{
            //console.log(this.markerLabel);

            if(this.markerLabel == 'Lat/Long'){
                return this.markers[idx].ll;
            }
            else if(this.markerLabel == 'UTM'){
                return this.markers[idx].utm;
            }
            else{
                return this.markers[idx].mgrs;
            }
        }

        toggleSearch():void{
            this.activeSearch = !this.activeSearch;
        }

        setMapType(){
            this.bus.app.map.setMapTypeId(this.st);
        }

        insertInput2(donmove:boolean = false){
            alert("asd");
        }

        insertInput(donmove:boolean = false){
            try{
                if(this.searchInput.trim() === "")
                    return;

            if(this.opt == 'll'){

                var temp:any = this.ll_valid(this.searchInput);
                temp = temp.split(",", 2);
                this.coordInfos.ll = parseFloat(temp[0]).toFixed(4) + ", " + parseFloat(temp[1]).toFixed(4);
                var aa = mgrs.LLtoUTM({lat: parseFloat(temp[0]), lon: parseFloat(temp[1])});
                this.coordInfos.utm = aa.zoneNumber + aa.zoneLetter + " " + aa.easting + " " + aa.northing;
                this.coordInfos.mgrs = mgrs.encode(aa, 5)
            }
            else if(this.opt == 'utm'){
                var temp:any = this.searchInput.trim().toUpperCase();
                this.coordInfos.utm = temp;
                temp = temp.split(" ", 3);
                temp = {
                    zoneLetter : temp[0][2],
                    zoneNumber : temp[0][0] + temp[0][1],
                    easting : temp[1],
                    northing : temp[2],
                    accuracy: 1
                };
                console.log(mgrs.UTMtoLL(temp));

                this.coordInfos.ll = mgrs.UTMtoLL(temp).bottom.toFixed(4) + ", " + mgrs.UTMtoLL(temp).left.toFixed(4);
                this.coordInfos.mgrs = mgrs.encode(temp);
            }
            else if(this.opt == 'mgrs'){
                var temp:any = this.searchInput.trim().replace(" ", "").toUpperCase();
                this.coordInfos.mgrs = temp;
                var aa = mgrs.decode(temp);
                this.coordInfos.utm = aa.zoneNumber + aa.zoneLetter + " " + aa.easting + " " + aa.northing;
                this.coordInfos.ll = mgrs.inverse(temp)[1].toFixed(4) + ", " + mgrs.inverse(temp)[0].toFixed(4);
            }} catch (e){
                alert("적절하지 않은 입력입니다.");
            }

            //this.coordInfos.name = this.bus.app.geocodeLatLng(this.coordInfos.ll);

            this.searchInput = "";
            if(!donmove) {
                this.bus.app.onMoveCenter(this.coordInfos.ll);
            }

            var temp:any = this.coordInfos.ll.split(",", 2);
            //this.bus.app.centerX.setPosition(new google.maps.LatLng(parseFloat(temp[0]),temp[1]));

            this.changeInfo(parseFloat(temp[0]),temp[1]);
        }

        changeInfo(lat:number, lon:number){
            var temp:any = this.ll_valid(lat + ", " + lon);
            temp = temp.split(",", 2);
            this.coordInfos.ll = parseFloat(temp[0]).toFixed(4) + ", " + parseFloat(temp[1]).toFixed(4);
            var aa = mgrs.LLtoUTM({lat: parseFloat(temp[0]), lon: parseFloat(temp[1])});
            this.coordInfos.utm = aa.zoneNumber + aa.zoneLetter + " " + aa.easting + " " + aa.northing;
            this.coordInfos.mgrs = mgrs.encode(aa, 5);
            if(this.bus.app != undefined) {
                this.coordInfos.name = this.bus.app.geocodeLatLng(this.coordInfos.ll);
                this.bus.app.centerX.setPosition(new google.maps.LatLng(parseFloat(temp[0]), temp[1]));
            }
            return;
        }

        getMarkerPosition(idx:number){
            this.coordInfos.ll = this.markers[idx].ll;
            this.coordInfos.utm = this.markers[idx].utm;
            this.coordInfos.mgrs = this.markers[idx].mgrs;
            this.coordInfos.name = this.bus.app.geocodeLatLng(this.coordInfos.ll);
            this.bus.app.onMoveCenter(this.markers[idx].ll);
        }

        ll_valid(raw:string):string{

            var aaa:any = raw.trim();
            if (raw.indexOf(",") > 0)
                aaa = aaa.split(",", 5);
            else
                aaa = aaa.split(" ", 5);

            if(aaa.length != 2) throw new Error('err');
            if(isNaN(aaa[0]) || isNaN(aaa[1])) throw new Error('err');

            if(parseFloat(aaa[0]) != 90)
                aaa[0] = (parseFloat(aaa[0]) + 90)%180 - 90;
            if(parseFloat(aaa[1]) != 180)
                aaa[1] = (parseFloat(aaa[1]) + 180)%360 - 180;

            return aaa[0] + ", " + aaa[1];
        }

        addMarker():void {
            if(this.coordInfos.ll == "") {
                alert("좌표 값이 비어있습니다.")
                return;
            }

            this.markers.push(Object.assign({}, this.coordInfos));
            this.bus.app.addMarker(parseFloat(this.coordInfos.ll.split(",", 2)[0]), parseFloat(this.coordInfos.ll.split(",", 2)[1]));

            var objDiv = document.getElementById("markers");
            if(objDiv != null)
                objDiv.scrollTop = 1e10;
            //console.log(objDiv.scrollTop);

            this.markerLength = this.markers.length > 3;
        }

        addMarkerll(ll:string){
            var qweq:any = ll.split(",", 2);
            var aa = mgrs.LLtoUTM({lat: parseFloat(qweq[0]), lon: parseFloat(qweq[1])});
            var tempList = {
                ll: parseFloat(qweq[0]).toFixed(4) + ", " + parseFloat(qweq[1]).toFixed(4),
                utm:  aa.zoneNumber + aa.zoneLetter + " " + aa.easting + " " + aa.northing,
                mgrs: mgrs.encode(aa, 5)
            }

            this.markers.push(Object.assign({}, tempList));
            this.bus.app.addMarker(parseFloat(tempList.ll.split(",", 2)[0]), parseFloat(tempList.ll.split(",", 2)[1]));

            var objDiv = document.getElementById("markers");
            if(objDiv != null)
                objDiv.scrollTop = 1e10;
            //console.log(objDiv.scrollTop);

            this.markerLength = this.markers.length > 3;
        }

        manageScroll():void{
            var objDiv = document.getElementById("markers");
            if(objDiv != null)
                objDiv.scrollTop = 1e10;
        }

        delMarker(idx:number) {
            this.markers.splice(idx, 1);
            this.bus.app.delMarker(idx);
            this.markerLength = this.markers.length > 3;
        }

        delAllMarker(){
            while(this.markers.length>0){
                this.delMarker(0);
            }
            this.visible2 = false;
        }

        junbee(){
            this.$message("준비중입니다.");
        }

        public tempId:string = "";
        public tempPw:string = "";
        login(){
            if(this.tempId == "wogur" && this.tempPw == "wogur"){
                this.session = true;
                this.visible3 = false;
            }
            else{
                this.$message.error("아이디 혹은 비밀번호가 일치하지 않습니다.")
            }

            this.tempId = "";
            this.tempPw = "";
        }

        logout(){
            this.session = false;
        }

        saveMark(){
            this.$message("준비중입니다.");
        }

        loadMark(){
            this.$message("준비중입니다.");
        }
    }
</script>

<style scoped>
    .headTap {
        padding: 0px 10px 10px 10px;
        min-width: 400px;
        border-style: solid;
        border-width: 1px;
        border-color: #cccccc;
        border-radius: 4px;
        background-color: #ffffff;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px;
    }
    #coordInfo{
        margin-top: -10px;
        text-align: left;
        padding: 10px;
    }
    .input-with-select{
        width: 500px;
    }

    .input-with-select .select{
        width: 120px;
    }
    .footer {
        position: absolute;
        padding: 0;
        bottom: 15px;
        margin: 0;
    }
    .header {
        padding: 0;
        top: 0;
        margin: 0;
        width: 100px;
    }

    li {
        list-style-type: none;
    }

    #mark_move {
        padding-left: 5px;
        text-align: left;
        width: 160px;
    }
    .marker {
        margin: 5px 0px 5px 0px;
        padding:0px;
    }
    #addMarker{
        float: right;
    }
    #markers{
        margin: 10px 0px 0px 0px;
        padding: 0px 10px 0px 10px;
        align-items: right;
        z-index: 1;
        top: 10px;
        right: 10px;
        height: 335px;
        overflow-y: scroll;
        direction: rtl;
    }

    .marker_label{
        margin: 0px;
        direction: ltr;
    }

    #ml {
        position: absolute;
        top: 15px;
        right: 215px;
        border-radius: 5px;
        background-color: #ffffff;

        text-align: center;
        vertical-align: middle;

        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>