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

  if (window.layui) {
    layui.use(['element'], function () {});
  }

  window.addEventListener('resize', resizeScreen);
  resizeScreen();
  updateClock();
  rotateMission();
  window.setInterval(updateClock, 1000);
  window.setInterval(rotateMission, 2200);
})();
