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
    missionRows.forEach(function (row, index) {
      row.classList.toggle('is-active', index === activeIndex);
    });
    activeIndex = (activeIndex + 1) % missionRows.length;
  }

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
