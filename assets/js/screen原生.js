(function () {
  var DESIGN_WIDTH = 1920;
  var DESIGN_HEIGHT = 1080;
  var screen = document.getElementById('screen');
  var clock = document.getElementById('clock');
  var missionRows = Array.prototype.slice.call(
    document.querySelectorAll('.mission-table tbody tr'),
  );
  var activeIndex = 0;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function resizeScreen() {
    var scale = Math.min(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT,
    );
    var offsetX = (window.innerWidth - DESIGN_WIDTH * scale) / 2;
    var offsetY = (window.innerHeight - DESIGN_HEIGHT * scale) / 2;
    screen.style.transform =
      'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + scale + ')';
  }

  function updateClock() {
    if (!clock) return;
    var now = new Date();
    var text =
      now.getFullYear() +
      '-' +
      pad(now.getMonth() + 1) +
      '-' +
      pad(now.getDate()) +
      ' ' +
      pad(now.getHours()) +
      ':' +
      pad(now.getMinutes()) +
      ':' +
      pad(now.getSeconds());
    clock.textContent = text;
  }

  function rotateMission() {
    if (!missionRows.length) return;
    missionRows.forEach(function (row, index) {
      row.classList.toggle('is-active', index === activeIndex);
    });
    activeIndex = (activeIndex + 1) % missionRows.length;
  }
  // 中间大图 start
  var zoneData = [
    {
      id: 'hangar-3',
      type: 'hangar',
      cssClass: 'hangar hangar-3',
      label: '三号机库',
      status: 'occupied',
      popup: {
        title: '无人机统计',
        rows: [
          { label: '机型X', value: '6架' },
          { label: '机型Y', value: '4架' },
          { label: '机型Z', value: '8架' },
        ],
        bar: { label: '已存放20架 / 0架可用', width: '100%' },
      },
    },
    {
      id: 'hangar-2',
      type: 'hangar',
      cssClass: 'hangar hangar-2',
      label: '二号机库',
      status: 'occupied',
      popup: {
        title: '无人机统计',
        rows: [
          { label: '机型X', value: '6架' },
          { label: '机型Y', value: '4架' },
          { label: '机型Z', value: '8架' },
        ],
        bar: { label: '已存放18架 / 2架可用', width: '90%' },
      },
    },
    {
      id: 'hangar-1',
      type: 'hangar',
      cssClass: 'hangar hangar-1',
      label: '一号机库',
      status: 'free',
      popup: {
        title: '无人机统计',
        rows: [
          { label: '机型X', value: '-' },
          { label: '机型Y', value: '-' },
          { label: '机型Z', value: '-' },
        ],
        bar: { label: '空闲', width: '0%' },
      },
    },
    {
      id: 'field-a',
      type: 'field',
      cssClass: 'field field-a',
      label: '场地A',
      status: 'free',
      popup: {
        title: '场地状态',
        rows: [
          { label: '当前状态', value: '空闲' },
          { label: '最近使用', value: '今日 10:00' },
        ],
      },
    },
    {
      id: 'runway-a',
      type: 'runway',
      cssClass: 'runway runway-a',
      label: '跑道A',
      status: 'free',
      popup: {
        title: '试验队信息',
        rows: [
          { label: '试验队名称', value: '-' },
          { label: '人数', value: '-' },
          { label: '位置', value: '-' },
          { label: '预约时间', value: '-' },
        ],
      },
    },
    {
      id: 'runway-b',
      type: 'runway',
      cssClass: 'runway runway-b',
      label: '跑道B',
      status: 'occupied',
      popup: {
        title: '试验队信息',
        rows: [
          { label: '试验队名称', value: '先锋试验队' },
          { label: '人数', value: '20人' },
          { label: '位置', value: '院内' },
          { label: '预约时间', value: '9:00-12:00' },
        ],
      },
    },
    {
      id: 'runway-c',
      type: 'runway',
      cssClass: 'runway runway-c',
      label: '跑道C',
      status: 'free',
      popup: {
        title: '试验队信息',
        rows: [
          { label: '试验队名称', value: '-' },
          { label: '人数', value: '-' },
          { label: '位置', value: '-' },
          { label: '预约时间', value: '-' },
        ],
      },
    },
  ];

  function renderZones() {
    var container = document.getElementById('map-zones');
    if (!container) return;

    zoneData.forEach(function (zone) {
      var zoneEl = document.createElement('div');
      zoneEl.className = 'zone ' + zone.cssClass;
      zoneEl.dataset.zone = zone.id;

      zoneEl.innerHTML =
        '<div class="zone-bg"></div>' +
        '<div class="zone-label">' +
        zone.label +
        '</div>' +
        '<div class="zone-popup">' +
        '<div class="popup-title">' +
        zone.popup.title +
        '</div>' +
        '<div class="popup-content">' +
        zone.popup.rows
          .map(function (row) {
            return (
              '<div class="popup-row"><span>' +
              row.label +
              '</span><span>' +
              row.value +
              '</span></div>'
            );
          })
          .join('') +
        (zone.popup.bar
          ? '<div class="popup-bar"><span>' +
            zone.popup.bar.label +
            '</span><div class="bar-fill" style="width:' +
            zone.popup.bar.width +
            '"></div></div>'
          : '') +
        '</div></div>';

      container.appendChild(zoneEl);
    });
  }

  var zoneActiveIndex = 0;
  function rotateZone() {
    var zones = document.querySelectorAll('.zone');
    zones.forEach(function (zone, index) {
      zone.classList.remove('is-active', 'occupied', 'free');
      if (index === zoneActiveIndex) {
        zone.classList.add('is-active', zoneData[index].status);
      }
    });
    zoneActiveIndex = (zoneActiveIndex + 1) % zones.length;
  }

  renderZones();
  //end
  if (window.layui && window.echarts) {
    layui.use(['element'], function () {
      var chartDom = document.getElementById('flight-chart');
      if (chartDom) {
        var chart = echarts.init(chartDom);
        var option = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(18, 80, 140, 0.8)',
            textStyle: { color: '#fff' },
          },
          // 替换成你指定grid
          grid: {
            left: 40,
            right: 10,
            top: 10,
            bottom: 30,
            containLabel: false,
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLine: {
              lineStyle: {
                color: 'rgba(76, 181, 255, 0.3)',
              },
            },
            axisTick: {
              show: false,
            },
            // 统一改成12号字体
            axisLabel: {
              color: '#a8d7f5',
              fontSize: 12,
            },
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 500,
            interval: 100,
            axisLine: {
              lineStyle: {
                color: 'rgba(76, 181, 255, 0.3)',
              },
            },
            // 统一y轴字体颜色+大小
            axisLabel: {
              color: '#7fbce8',
              fontSize: 12,
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(76, 181, 255, 0.1)',
              },
            },
          },
          series: [
            {
              name: '飞行次数',
              type: 'bar',
              barWidth: '30%',
              barGap: '-100%',
              data: [500, 500, 500, 500, 500, 500],
              itemStyle: {
                color: '#0f2a4a',
              },
            },
            {
              name: '飞行次数',
              type: 'bar',
              barWidth: '30%',
              data: [198, 325, 265, 205, 350, 232],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ab8ff' },
                  { offset: 1, color: '#00a8e8' },
                ]),
              },
            },
          ],
        };
        chart.setOption(option);
        window.addEventListener('resize', function () {
          chart.resize();
        });
      }
    });
  }

  window.addEventListener('resize', resizeScreen);
  resizeScreen();
  updateClock();
  rotateMission();
  window.setInterval(updateClock, 1000);
  window.setInterval(rotateMission, 2200);
  window.setInterval(rotateZone, 2500);
})();
