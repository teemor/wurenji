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
        bar: {
          used: '20',
          available: '0',
          total: 20,
          usedCount: 20,
        },
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
        bar: {
          used: '16',
          available: '2',
          total: 18,
          usedCount: 16,
        },
      },
    },
    {
      id: 'hangar-1',
      type: 'hangar',
      cssClass: 'hangar hangar-1',
      label: '一号机库',
      status: 'occupied',
      popup: {
        title: '无人机统计',
        rows: [
          { label: '机型X', value: '6架' },
          { label: '机型Y', value: '4架' },
          { label: '机型Z', value: '8架' },
        ],
        bar: {
          used: '18',
          available: '2',
          total: 18,
          usedCount: 16,
        },
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
      status: 'occupied',
      popup: {
        title: '试验队信息',
        rows: [
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
          { label: '人数', value: '-' },
          { label: '位置', value: '-' },
          { label: '预约时间', value: '-' },
        ],
      },
    },
  ];

  if (window.layui) {
    layui.use(['laytpl', 'element'], function () {
      var laytpl = layui.laytpl;
      var $ = layui.$;

      var zoneTpl = [
        '{{# layui.each(d, function(index, zone) { }}',
        '<div class="zone {{ zone.cssClass }}" data-zone="{{ zone.id }}">',
        '<div class="zone-bg"></div>',
        '<div class="zone-label">{{ zone.label }}</div>',
        '<div class="zone-popup">',
        // 无人机,场地
        '{{# if(zone.type === "hangar") { }}',
        '<div class="popup-title">{{ zone.popup.title }}</div>',
        '<div class="popup-content">',
        '{{# layui.each(zone.popup.rows, function(i, row) { }}',
        '<div class="popup-row"><span>{{ row.label }}</span><span>{{ row.value }}</span></div>',
        '{{# }); }}',
        '{{# if(zone.popup.bar) { }}',
        '<div class="popup-bar"><div class="bar-grid">',
        '{{# for(var i=0; i<zone.popup.bar.total; i++) { }}',
        "<div class=\"bar-cell{{ i < zone.popup.bar.usedCount ? ' used' : '' }}\"></div>",
        '{{# } }}',
        '</div><div class="bar-text">已存放<span class="bar-num">{{ zone.popup.bar.used }}</span>架 <span class="bar-num">{{ zone.popup.bar.available }}</span>架可用</div></div>',
        '{{# } }}',
        '</div>',
        '{{# } else { }}',
        // 试验队信息
        '<div class="popup-title">{{ zone.popup.title }}</div>',
        '<div class="popup-content">',
        '{{# layui.each(zone.popup.rows, function(i, row) { }}',
        '<div class="popup-row"><span>{{ row.label }}</span><span>{{ row.value }}</span></div>',
        '{{# }); }}',
        '</div>',
        '{{# } }}',
        '</div>',
        '</div>',
        '{{# }); }}',
      ].join('');

      laytpl(zoneTpl).render(zoneData, function (html) {
        $('#map-zones').html(html);
      });

      var zoneActiveIndex = 0;
      function rotateZone() {
        $('.zone').each(function (index) {
          $(this).removeClass('is-active occupied free');
          if (index === zoneActiveIndex) {
            $(this).addClass('is-active ' + zoneData[index].status);
          }
        });
        zoneActiveIndex = (zoneActiveIndex + 1) % zoneData.length;
      }

      window.setInterval(rotateZone, 2500);
    });
  }
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
})();
