var loc=[]
    window.lastInfoBox = null;//点位详情窗体
    var map = new BMap.Map("map", {});   // 创建Map实例
    map.centerAndZoom(new BMap.Point(118.0706176, 24.45937351), 12);     // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom();                        //启用滚轮放大缩小
    $.ajaxSettings.async = false;
        $.getJSON("script/data.json", (data)=>{   //取到所用的数据
                loc = data
            }
        )
    $.ajaxSettings.async = true;
    if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        var siteData = [], points = [];  // 添加海量点数据
        for (var i = 0; i < loc.length; i++) { //siteData为接口返回数据，此处用百度地图生成随机数
            siteData.push({center: new BMap.Point(loc[i].X, loc[i].Y), count: i,name:loc[i].name,address:loc[i].address,a_label:loc[i].a_label,c_label:loc[i].c_label});
        }
        for (var x = 0; x < siteData.length; x++) {
            points.push(siteData[x].center); //数据的经纬度集合
        }
        console.log(points);
        var options = {
            size: BMAP_POINT_SIZE_SMALL,
            shape: BMAP_POINT_SHAPE_STAR,
            color: '#d340c3'
        };
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
        pointCollection.addEventListener('click', function (e) {
            // console.log('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
            var data = '';//弹窗信息
            //由于海量星中具体某个点不能存储其他数据，故用循环的方法，将经纬度匹配来获取点位数据
            for (var i = 0; i < siteData.length; i++) {
                if (points[i].lng == e.point.lng && points[i].lat == e.point.lat) {
                    data = siteData[i];
                    break;
                }
            }
            console.log('data',data)
            var tmpPt = new BMap.Point(e.point.lng, e.point.lat);
            var info = '<div class="popup"><div class="popup-content-wrapper"><div class="popup-content">' +
                '<div class="map-air-quality-popup map-popup-model">' +
                '<div class="header modelTitle"><div class="text-center">点位详情</div></div>' +
                '<div class="popup-info" style="padding:5px 10px"><div class="siteDataArea">店名：' + data.name + '</div></div>' +
                '<div class="popup-info" style="padding:5px 10px"><div class="siteDataArea">行业：' + data.a_label + '</div></div>' +
                '<div class="popup-info" style="padding:5px 10px"><div class="siteDataArea">特点：' + data.c_label + '</div></div>' +
                '<div class="popup-info" style="padding:5px 10px"><div class="siteDataArea">地址：' + data.address + '</div></div>' +
                '<div class="popup-tip-container"><div class="popup-tip"></div></div>' +
                '</div>';
            var infoBox = new BMapLib.InfoBox(map, info, {
                boxStyle: {
                    width: "320px",
                    Height: "340px",
                    backgroundColor: "white"
                },
                closeIconUrl: 'http://api0.map.bdimg.com/images/iw_close1d3.gif',
                offset: new BMap.Size(0, 0),
                closeIconMargin: "12px 8px 4px 4px",
                enableAutoPan: true,
                align: INFOBOX_AT_TOP
            });
            if (lastInfoBox) {
                lastInfoBox.close(); //只保留一个信息窗体
            }
            lastInfoBox = infoBox;
            infoBox.open(tmpPt);

        });
        map.addOverlay(pointCollection);  // 添加Overlay
    } else {
        alert('请在chrome、safari、IE8+以上浏览器查看本示例');
    }