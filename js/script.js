// =======================================
// 1) 공통: 퍼센트 -> 레벨 판정 함수
//    return: 'low' | 'mid' | 'high'
// =======================================
function getLevelByPercent(percent) {
  if (percent <= 25) {
    return 'low';   // 적색
  } else if (percent <= 60) {
    return 'mid';   // 오렌지
  } else {
    return 'high';  // 녹색
  }
}

// =======================================
// 2) 배터리 바 색상 적용
//    (applyBatteryColor + updateAllBatteryBars 통합/정리)
// =======================================

// 배터리 바에 색상 클래스 적용
function applyBatteryColor(el, percent) {
  el.classList.remove('battery-red', 'battery-orange', 'battery-green');

  const level = getLevelByPercent(percent);

  if (level === 'low') {
    el.classList.add('battery-red');
  } else if (level === 'mid') {
    el.classList.add('battery-orange');
  } else {
    el.classList.add('battery-green');
  }
}

/**
 * 상태 테이블(.state-row.child) + 센서 테이블(.sensor-row)
 * 두 곳 모두 자동 적용
 */
function updateAllBatteryBars() {
  document.querySelectorAll('.battery-bar-fill').forEach((fillEl) => {
    let percent = null;

    // 1) battery-text가 있는 경우 → 텍스트 숫자 사용
    const row = fillEl.closest('.state-row.child, .sensor-row');
    const textEl = row ? row.querySelector('.battery-text') : null;

    if (textEl) {
      const match = textEl.textContent.match(/[\d.]+/);
      if (match) {
        percent = parseFloat(match[0]);
      }
    }

    // 2) battery-text 없으면 width: 65% 같은 스타일에서 추출
    if (percent === null) {
      const widthMatch = fillEl.style.width.match(/([\d.]+)%/);
      if (widthMatch) {
        percent = parseFloat(widthMatch[1]);
      }
    }

    // 값이 없으면 건너뜀
    if (percent === null || isNaN(percent)) return;

    // 값 클램프 0~100
    percent = Math.max(0, Math.min(100, percent));

    // width 강제 적용 (혹시 text에서 값 추출 시)
    fillEl.style.width = percent + '%';

    // 색상 적용
    applyBatteryColor(fillEl, percent);
  });
}

// =======================================
// 3) Weak Section Gauge Color 적용
//    (마크업 그대로, width %만 보고 색상 클래스 적용)
// =======================================
function updateWeakSensorGauges() {
  document.querySelectorAll('.weak-sensor-gauge-fill').forEach((fillEl) => {
    // width % 가져오기
    const widthMatch = fillEl.style.width.match(/([\d.]+)%/);
    if (!widthMatch) return;

    let percent = parseFloat(widthMatch[1]);
    if (isNaN(percent)) return;

    // 기존 상태 클래스 제거
    fillEl.classList.remove(
      'weak-sensor-gauge-fill--danger',
      'weak-sensor-gauge-fill--warning',
      'weak-sensor-gauge-fill--normal'
    );

    // 공통 함수로 레벨만 판정
    const level = getLevelByPercent(percent);

    if (level === 'low') {
      fillEl.classList.add('weak-sensor-gauge-fill--danger');
    } else if (level === 'mid') {
      fillEl.classList.add('weak-sensor-gauge-fill--warning');
    } else {
      fillEl.classList.add('weak-sensor-gauge-fill--normal');
    }
  });
}

// =======================================
// 4) 공통 로드 이벤트에서 한 번에 호출
// =======================================
window.addEventListener('load', function () {
  updateAllBatteryBars();      // 배터리 바 색상
  updateWeakSensorGauges();    // weak-section 게이지 색상
});



// 카드 헤더 토글 칩 on/off
  document.querySelectorAll('.card-toggle-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-on');

      // 여기에서 실제 필터 동작 넣으면 됨
      // const filterKey = btn.dataset.filter;
      // const isOn = btn.classList.contains('is-on');
      // console.log(filterKey, isOn);
    });
  });
  


// 상태 테이블 그룹 토글
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.state-row.group').forEach((row) => {
      const groupId = row.dataset.group;
      const toggleBtn = row.querySelector('.state-toggle-btn');
      const subrows = document.querySelector(
        '.state-subrows[data-group="' + groupId + '"]'
      );
      if (!toggleBtn || !subrows) return;

      toggleBtn.addEventListener('click', () => {
        const isOpen = row.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        subrows.classList.toggle('is-open', isOpen);
      });
    });
  });


 // 기본 오른쪽 패딩(px) – 위 CSS와 반드시 동일하게 맞추세요

  // const BASE_PADDING_RIGHT = 24;

  // function updateStateTablesScroll() {
  //   document.querySelectorAll('.state-table').forEach((table) => {
  //     const body = table.querySelector('.state-table-body');
  //     const head = table.querySelector('.state-table-head');
  //     if (!body || !head) return;

  //     // 현재 영역에서 실제 스크롤이 필요한지 체크
  //     const needScroll = body.scrollHeight > body.clientHeight + 1;

  //     if (needScroll) {
  //       // 스크롤 켜기
  //       body.style.overflowY = 'auto';

  //       // 스크롤바 너비 계산 (레이아웃 틀어짐 방지용)
  //       const scrollbarWidth = body.offsetWidth - body.clientWidth;

  //       // 헤더 오른쪽 패딩을 같은 만큼 더 줘서
  //       // 바디에 스크롤바가 먹은 만큼 헤더도 좁혀줌 → 컬럼 정렬 유지
  //       head.style.paddingRight =
  //         BASE_PADDING_RIGHT + scrollbarWidth + 'px';
  //     } else {
  //       // 스크롤 필요 없음 → 감추기
  //       body.style.overflowY = 'hidden';
  //       head.style.paddingRight = BASE_PADDING_RIGHT + 'px';
  //     }
  //   });
  // }

  // // 최초 로딩 / 리사이즈 시 갱신
  // window.addEventListener('load', updateStateTablesScroll);
  // window.addEventListener('resize', updateStateTablesScroll);

  


// card-body의 width 기준으로 flex-direction 변경
function updateStateCardBodyByWidth() {
  document.querySelectorAll('.state-card .card-body').forEach((bodyEl) => {
    const bodyWidth = bodyEl.clientWidth;

    if (bodyWidth <= 900) {
      // 900 이하 → row
      bodyEl.style.display = 'flex';
      bodyEl.style.flexDirection = 'row';
    } else {
      // 900 초과 → column
      bodyEl.style.display = 'flex';
      bodyEl.style.flexDirection = 'column';
    }
  });
}

window.addEventListener('load', () => {
  updateStateCardBodyByWidth();
});

window.addEventListener('resize', () => {
  updateStateCardBodyByWidth();
});




// 전역에 InfoWindow들을 보관하는 객체
window.stationInfoWindows = {};

// 전역 닫기 함수 (팝업 안에서 호출)
function closeStationPopup(id) {
  const iw = window.stationInfoWindows[id];
  if (iw) {
    iw.close();
  }
}

// 위치 카드 - 네이버 지도 + 공통 생성 함수
function initLocationMap() {
  const mapContainer = document.getElementById('location-map');
  if (!mapContainer || typeof naver === 'undefined' || !naver.maps) return;

  // 좌표 세팅
  const nopoLatLng = new naver.maps.LatLng(35.283966763, 129.095053241); // 노포역
  const beomeosaLatLng = new naver.maps.LatLng(35.2894, 129.0940);       // 범어사역 근처 (대략)

  // 두 지점 중간 지점으로 센터
  const centerLat = (nopoLatLng.lat() + beomeosaLatLng.lat()) / 2;
  const centerLng = (nopoLatLng.lng() + beomeosaLatLng.lng()) / 2;
  const center = new naver.maps.LatLng(centerLat, centerLng);

  const map = new naver.maps.Map('location-map', {
    center: center,
    zoom: 15,
    minZoom: 8,
    maxZoom: 18,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  });

  const allInfoWindows = [];

  // 노포역
  createStationMarkerWithPopup(
    map,
    'nopo', // 팝업 ID
    {
      position: nopoLatLng,
      title: '노포역',
      kitId: 'KIT-BUSAN-L1-NOPO-01',
      org: '노포 차량기지',
      sensorSummary: '10 (진동5 / 온도5)',
      batteryMinMax: '15% / 72%',
      rssiMinMax: '-88 dBm / -60 dBm',
      lastSeen: '2025.11.09 - 12:00:03',
      batteryAvg: '76%',
      rssiMedian: '-68 dBm',

      // 팝업 라인 그래프용 데이터 (예시)
      timeLabels: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'D'],
      batterySeries: [70, 72, 73, 74, 75, 76, 76],   // %
      rssiSeries:   [-60, -65, -70, -78, -82, -88, -80],
      rssiBaseline: -80                               // 기준선(dBm)
    },
    allInfoWindows
  );

  // 범어사역
  createStationMarkerWithPopup(
    map,
    'beomeosa',
    {
      position: beomeosaLatLng,
      title: '범어사역',
      kitId: 'KIT-BUSAN-L1-BEOMEOSA-01',
      org: '범어사역 구간',
      sensorSummary: '8 (진동4 / 온도4)',
      batteryMinMax: '20% / 80%',
      rssiMinMax: '-85 dBm / -62 dBm',
      lastSeen: '2025.11.09 - 12:03:40',
      batteryAvg: '82%',
      rssiMedian: '-71 dBm',

      timeLabels: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'D'],
      batterySeries: [78, 79, 80, 81, 82, 82, 83],
      rssiSeries:   [-62, -65, -69, -75, -80, -85, -78],
      rssiBaseline: -80
    },
    allInfoWindows
  );
}


function createStationMarkerWithPopup(map, id, cfg, allInfoWindows) {
  const {
    position,
    title,
    kitId,
    org,
    sensorSummary,
    batteryMinMax,
    rssiMinMax,
    lastSeen,
    batteryAvg,
    rssiMedian,
  } = cfg;

  // 1) 알람 마커 
  const alarmMarker = new naver.maps.Marker({
    position,
    map,
    icon: {
      content:
        '<div class="location-marker">' +
        `  <img src="img/icon_marker_alarm.svg" alt="${title} 알람" />` +
        '</div>',
      size: new naver.maps.Size(32, 32),
      anchor: new naver.maps.Point(16, 32),
    },
  });

// 2) 온라인 마커 — 더 위로 멀리 이동
const onlineMarker = new naver.maps.Marker({
  position: new naver.maps.LatLng(
    position.lat() + 0.00110,   // 위로 크게 이동
    position.lng()
  ),
  map,
  icon: {
    content:
      '<div class="location-marker">' +
      `  <img src="img/icon_marker_online.svg" alt="${title} 온라인" />` +
      '</div>',
    size: new naver.maps.Size(32, 32),
    anchor: new naver.maps.Point(16, 32),
  },
  clickable: false,
});

// 3) 오프라인 마커 — 더 오른쪽 아래로 이동
const offlineMarker = new naver.maps.Marker({
  position: new naver.maps.LatLng(
    position.lat() - 0.00080,   // 아래쪽으로 크게 이동
    position.lng() + 0.00110    // 오른쪽으로 크게 이동
  ),
  map,
  icon: {
    content:
      '<div class="location-marker">' +
      `  <img src="img/icon_marker_offline.svg" alt="${title} 오프라인" />` +
      '</div>',
    size: new naver.maps.Size(32, 32),
    anchor: new naver.maps.Point(16, 32),
  },
  clickable: false,
});

  //  팝업 템플릿/InfoWindow 생성
  const popupHtml = `
    <div class="map-popup">
      <div class="map-popup-inner">
        <div class="map-popup-header">
          <div>
            <div class="map-popup-kit-label">키트 ID</div>
            <div class="map-popup-kit-id">${kitId}</div>
          </div>
                  <img class="map-popup-close"
                  onclick="closeStationPopup('${id}')" src="img/icon_popup_close.svg" alt="닫기" />
        </div>
        <div class="map-scroll-area">
          <div class="map-popup-info">
            <div class="map-popup-row">
              <div class="map-popup-row-label">소속</div>
              <div class="map-popup-row-divider"></div>
              <div class="map-popup-row-value">${org}</div>
            </div>
            <div class="map-popup-row">
              <div class="map-popup-row-label">센서수</div>
              <div class="map-popup-row-divider"></div>
              <div class="map-popup-row-value">${sensorSummary}</div>
            </div>
            <div class="map-popup-row">
              <div class="map-popup-row-label">배터리(min/max)</div>
              <div class="map-popup-row-divider"></div>
              <div class="map-popup-row-value">${batteryMinMax}</div>
            </div>
            <div class="map-popup-row">
              <div class="map-popup-row-label">RSSI(min/max)</div>
              <div class="map-popup-row-divider"></div>
              <div class="map-popup-row-value">${rssiMinMax}</div>
            </div>
            <div class="map-popup-row">
              <div class="map-popup-row-label">최근수신</div>
              <div class="map-popup-row-divider"></div>
              <div class="map-popup-row-value">${lastSeen}</div>
            </div>
          </div>

          <div class="map-popup-graph-block">
            <div class="map-popup-graph-label-row">
              <span>배터리 (7d avg)</span>
              <span>${batteryAvg}</span>
            </div>
            <div class="map-popup-graph-bar"></div>
          </div>

          <div class="map-popup-graph-block">
            <div class="map-popup-graph-label-row">
              <span>RSSI (24h median)</span>
              <span>${rssiMedian}</span>
            </div>
            <div class="map-popup-graph-rssi">
              그래프 영역(샘플)
            </div>
          </div>
          <div class="map-popup-footer">
            <button type="button" class="map-popup-button">자세히 보기</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const infoWindow = new naver.maps.InfoWindow({
    content: popupHtml,
    pixelOffset: new naver.maps.Point(0, -10),
    backgroundColor: 'transparent',
    borderWidth: 0,
    disableAnchor: true,
  });

  // 전역 등록
  window.stationInfoWindows[id] = infoWindow;
  allInfoWindows.push(infoWindow);

  // 알람 마커 클릭 시에만 팝업 토글
  naver.maps.Event.addListener(alarmMarker, 'click', () => {
    const isOpen = infoWindow.getMap() != null;

    // 다른 팝업 모두 닫기
    allInfoWindows.forEach((iw) => iw.close());

    if (!isOpen) {
      infoWindow.open(map, alarmMarker);

      // 팝업 DOM 렌더 이후 ECharts 초기화
      setTimeout(() => {
        applyPopupScrollBehavior(); 
        initPopupCharts(cfg);
      }, 0);
    }
  });
}



// 팝업 내부 ECharts 렌더링
function initPopupCharts(cfg) {
  if (!window.echarts) return;

  // 1) 배터리 (7d avg) 라인
  const batteryEl = document.querySelector('.map-popup-graph-bar');
  if (batteryEl) {
    const batteryChart = echarts.init(batteryEl);

    const batteryOption = {
      animation: false,
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      xAxis: {
        type: 'category',
        data: cfg.timeLabels || [],
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      series: [
        {
          type: 'line',
          data: cfg.batterySeries || [],
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#10b981' // 배터리용 초록색
          },
          areaStyle: { opacity: 0 }
        }
      ],
      tooltip: { show: false }
    };

    batteryChart.setOption(batteryOption);
  }

  // 2) RSSI (24h median) 라인 + 기준선
  const rssiEl = document.querySelector('.map-popup-graph-rssi');
  if (rssiEl) {
    const rssiChart = echarts.init(rssiEl);

    const labels = cfg.timeLabels || [];
    const base = cfg.rssiBaseline;

    const rssiOption = {
      animation: false,
      grid: { left: 4, right: 4, top: 2, bottom: 2 },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      yAxis: {
        type: 'value',
        inverse: true, // dBm 값이 작을수록(음수 커질수록) 아래로 내려가게
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      series: [
        {
          name: 'RSSI',
          type: 'line',
          data: cfg.rssiSeries || [],
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#f97316' // RSSI 오렌지 라인
          },
          areaStyle: { opacity: 0 }
        },
        {
          name: 'baseline',
          type: 'line',
          data: labels.map(() => base),
          smooth: false,
          symbol: 'none',
          lineStyle: {
            width: 1,
            type: 'dashed',
            color: '#f97316'
          }
        }
      ],
      tooltip: { show: false }
    };

    rssiChart.setOption(rssiOption);
  }
}

// 페이지 로드 시 실행
window.addEventListener('load', initLocationMap);




//데이트피커
  document.addEventListener('DOMContentLoaded', function () {

  // 기간 선택 UI가 없는 페이지시 오류 방지
  if (!document.getElementById('rbPeriodBtn')) return;    

    const PERIODS = {
      '1d': { label: '1일', days: 1 },
      '1w': { label: '1주', days: 7 },
      '1m': { label: '1개월', months: 1 },
      '3m': { label: '3개월', months: 3 },
      '6m': { label: '6개월', months: 6 },
    };

    // 상태값
    let currentPeriodKey = '1d';     // 선택된 기간 단위 (1d,1w...) / 커스텀일 땐 null
    let useCustomRange = false;      // true면 시작/종료를 직접 설정한 상태

    let startDateTime = startOfDay(new Date());      // 현재 구간 시작
    let endDateTime   = endOfDay(startDateTime);     // 현재 구간 종료

    // DOM
    const periodBtn   = document.getElementById('rbPeriodBtn');
    const periodLabel = document.getElementById('rbPeriodLabel');
    const periodMenu  = document.getElementById('rbPeriodMenu');

    const prevBtn     = document.querySelector('.rb-prev');
    const nextBtn     = document.querySelector('.rb-next');

    const calendarBtn = document.getElementById('rbCalendarBtn');
    const dateInput   = document.getElementById('rbDateInput'); // 기준일 (기간 모드용)

    const startBtn       = document.getElementById('rbStartBtn');
    const endBtn         = document.getElementById('rbEndBtn');
    const startInput     = document.getElementById('rbStartInput');
    const endInput       = document.getElementById('rbEndInput');
    const startDateSpan  = document.getElementById('rbStartDate');
    const startTimeSpan  = document.getElementById('rbStartTime');
    const endDateSpan    = document.getElementById('rbEndDate');
    const endTimeSpan    = document.getElementById('rbEndTime');

    // ---------- ----------
    function startOfDay(d) {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      return nd;
    }

    function endOfDay(d) {
      const nd = new Date(d);
      nd.setHours(23, 59, 0, 0);
      return nd;
    }

    function addDays(date, days) {
      const nd = new Date(date);
      nd.setDate(nd.getDate() + days);
      return nd;
    }

    function addMonthsSafe(date, months) {
      const nd = new Date(date);
      const day = nd.getDate();
      nd.setMonth(nd.getMonth() + months);
      if (nd.getDate() < day) nd.setDate(0); // 말일보정
      return nd;
    }

    function formatDate(d) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}.${mm}.${dd}`;
    }

    function formatTime(d) {
      const hh = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mi}`;
    }

    // datetime-local value 포맷
    function toInputValue(d) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }

    function computeRangeFromPeriod(baseStart, periodKey) {
      const p = PERIODS[periodKey];
      let s = startOfDay(baseStart);
      let e;
      if (p.days) {
        e = addDays(s, p.days - 1);
      } else if (p.months) {
        const tmp = addMonthsSafe(s, p.months);
        e = addDays(tmp, -1);
      } else {
        e = s;
      }
      e = endOfDay(e);
      return { start: s, end: e };
    }

    function syncDateInput() {
      // 기간 모드에서 기준일용 date input (시작일 기준)
      dateInput.value = [
        startDateTime.getFullYear(),
        String(startDateTime.getMonth() + 1).padStart(2, '0'),
        String(startDateTime.getDate()).padStart(2, '0'),
      ].join('-');
    }

    function updateDisplay() {
      // 화면에 표시할 start/end 결정
      const s = startDateTime;
      const e = endDateTime;

      startDateSpan.textContent = formatDate(s);
      startTimeSpan.textContent = formatTime(s);
      endDateSpan.textContent   = formatDate(e);
      endTimeSpan.textContent   = formatTime(e);

      if (useCustomRange || !currentPeriodKey) {
        periodLabel.textContent = '사용자 지정';
      } else {
        periodLabel.textContent = PERIODS[currentPeriodKey].label;
      }

      syncDateInput(); // 기간 모드 기준일 동기화
    }

    function applyPeriod(periodKey) {
      currentPeriodKey = periodKey;
      useCustomRange = false; // 기간 단위 모드로 전환

      const { start, end } = computeRangeFromPeriod(startDateTime, periodKey);
      startDateTime = start;
      endDateTime = end;

      updateDisplay();
    }

    function shiftRange(direction) {
      if (!useCustomRange && currentPeriodKey) {
        // 기간 모드: period 기준 이동
        const p = PERIODS[currentPeriodKey];
        if (p.days) {
          startDateTime = addDays(startDateTime, direction * p.days);
          const { start, end } = computeRangeFromPeriod(startDateTime, currentPeriodKey);
          startDateTime = start;
          endDateTime = end;
        } else if (p.months) {
          startDateTime = addMonthsSafe(startDateTime, direction * p.months);
          const { start, end } = computeRangeFromPeriod(startDateTime, currentPeriodKey);
          startDateTime = start;
          endDateTime = end;
        }
      } else {
        // 커스텀 모드: 현재 구간 길이만큼 통째로 이동
        const lenMs = endDateTime.getTime() - startDateTime.getTime();
        const delta = lenMs + 1; // 끝 포함
        startDateTime = new Date(startDateTime.getTime() + direction * delta);
        endDateTime   = new Date(endDateTime.getTime() + direction * delta);
      }
      updateDisplay();
    }

    // ---------- 이벤트 ----------

    // 기간 드롭다운 토글
    periodBtn.addEventListener('click', () => {
      periodMenu.classList.toggle('open');
    });

    // 기간 선택
    periodMenu.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const key = li.dataset.period;
      if (!PERIODS[key]) return;
      periodMenu.classList.remove('open');
      applyPeriod(key);
    });

    // 바깥 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e) => {
      if (!periodMenu.contains(e.target) && !periodBtn.contains(e.target)) {
        periodMenu.classList.remove('open');
      }
    });

    // 이전/다음 기간 이동
    prevBtn.addEventListener('click', () => shiftRange(-1));
    nextBtn.addEventListener('click', () => shiftRange(1));

    // 캘린더 버튼 → 기간 모드 기준일 변경
    calendarBtn.addEventListener('click', () => {
      if (dateInput.showPicker) dateInput.showPicker();
      else dateInput.focus();
    });

    dateInput.addEventListener('change', function () {
      if (!this.value) return;
      const [y, m, d] = this.value.split('-').map(Number);
      startDateTime = startOfDay(new Date(y, m - 1, d));

      if (currentPeriodKey) {
        applyPeriod(currentPeriodKey);
      } else {
        // 커스텀 상태였다면, 시작만 변경 & 유지
        useCustomRange = true;
        if (startDateTime > endDateTime) {
          endDateTime = endOfDay(startDateTime);
        }
        updateDisplay();
      }
    });

    // 시작 구간 클릭 → datetime-local로 직접 선택
    startBtn.addEventListener('click', () => {
      startInput.value = toInputValue(startDateTime);
      if (startInput.showPicker) startInput.showPicker();
      else startInput.click();
    });

    startInput.addEventListener('change', function () {
      if (!this.value) return;
      startDateTime = new Date(this.value);
      // 시작이 종료보다 뒤로 가면 종료를 맞춰줌
      if (startDateTime > endDateTime) {
        endDateTime = endOfDay(startDateTime);
      }
      useCustomRange = true;
      currentPeriodKey = null;
      updateDisplay();
    });

    // 종료 구간 클릭 → datetime-local로 직접 선택
    endBtn.addEventListener('click', () => {
      endInput.value = toInputValue(endDateTime);
      if (endInput.showPicker) endInput.showPicker();
      else endInput.click();
    });

    endInput.addEventListener('change', function () {
      if (!this.value) return;
      endDateTime = new Date(this.value);
      // 종료가 시작보다 앞이면 시작을 맞춰줌
      if (endDateTime < startDateTime) {
        startDateTime = startOfDay(endDateTime);
      }
      useCustomRange = true;
      currentPeriodKey = null;
      updateDisplay();
    });

    // 초기 렌더
    // 기본은 1일 모드
    const { start, end } = computeRangeFromPeriod(startDateTime, currentPeriodKey);
    startDateTime = start;
    endDateTime = end;
    updateDisplay();
  });



// Assets 페이지 - 센서 차트
function initSensorCharts() {
  if (!window.echarts) return;

  // 공통 더미 x축 (시간)
  const times = [
    '12:25', '12:30', '12:35', '12:40', '12:45',
    '12:50', '12:55', '13:00'
  ];

  const commonTooltip = {
  trigger: 'axis',
  appendToBody: true,   // 카드 밖으로 빼서 body에 붙이기
  // 필요하면:
  // confine: true,     // 화면(viewport) 밖으로는 안 나가게
};

  // 1) Velocity RMS
  const velEl = document.getElementById('chart-velocity');
  if (velEl) {
    const velChart = echarts.init(velEl);
    velChart.setOption({
      grid: { left: 30, right: 10, top: 10, bottom: 20 },
    tooltip: commonTooltip,      
    xAxis: {
        type: 'category',
        data: times,
        axisLabel: { fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: 'mm/s',
        axisLabel: { fontSize: 10 }
      },
      series: [
        {
          name: 'X',
          type: 'line',
          data: [2.1, 2.0, 1.9, 2.2, 2.4, 2.3, 2.1, 2.0],
          smooth: true
        },
        {
          name: 'Y',
          type: 'line',
          data: [1.2, 1.3, 1.4, 1.5, 1.4, 1.3, 1.2, 1.3],
          smooth: true
        },
        {
          name: 'Z',
          type: 'line',
          data: [0.8, 0.9, 0.85, 0.88, 0.86, 0.84, 0.82, 0.8],
          smooth: true
        }
      ],
      legend: { top: 0, right: 0, itemWidth: 10, itemHeight: 6 }
    });
  }

  // 2) Acceleration RMS
  const accEl = document.getElementById('chart-accel');
  if (accEl) {
    const accChart = echarts.init(accEl);
    accChart.setOption({
      grid: { left: 30, right: 10, top: 10, bottom: 20 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: { fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: 'g',
        axisLabel: { fontSize: 10 }
      },
      series: [
        {
          name: 'X',
          type: 'line',
          data: [0.12, 0.13, 0.14, 0.13, 0.15, 0.16, 0.14, 0.13],
          smooth: true
        },
        {
          name: 'Y',
          type: 'line',
          data: [0.09, 0.1, 0.11, 0.11, 0.1, 0.1, 0.09, 0.1],
          smooth: true
        },
        {
          name: 'Z',
          type: 'line',
          data: [0.06, 0.07, 0.07, 0.08, 0.07, 0.07, 0.06, 0.06],
          smooth: true
        }
      ],
      legend: { top: 0, right: 0, itemWidth: 10, itemHeight: 6 }
    });
  }

  // 3) Temperature
  const tempEl = document.getElementById('chart-temp');
  if (tempEl) {
    const tempChart = echarts.init(tempEl);
    tempChart.setOption({
      grid: { left: 30, right: 10, top: 10, bottom: 20 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: { fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: '°C',
        axisLabel: { fontSize: 10 }
      },
      series: [
        {
          name: 'Temp',
          type: 'line',
          data: [28, 29, 28, 30, 31, 30, 29, 29],
          smooth: true
        }
      ],
      legend: { show: false }
    });
  }
}

// 페이지 로드 후 실행
window.addEventListener('load', initSensorCharts);




// 지도 높이에 맞춰 팝업 스크롤 제어
function applyPopupScrollBehavior() {
  const mapEl = document.getElementById('location-map');
  if (!mapEl) return;

  const mapHeight = mapEl.clientHeight;

  const popupInner = document.querySelector('.map-popup-inner');
  const scrollArea = document.querySelector('.map-scroll-area');
  if (!popupInner || !scrollArea) return;

  const header = popupInner.querySelector('.map-popup-header');
  const footer = popupInner.querySelector('.map-popup-footer');

  const headerH = header ? header.offsetHeight : 0;
  const footerH = footer ? footer.offsetHeight : 0;

  const cs = getComputedStyle(popupInner);
  const paddingY =
    parseFloat(cs.paddingTop || 0) + parseFloat(cs.paddingBottom || 0);

  let maxScrollAreaHeight = mapHeight - headerH - footerH - paddingY - 20;
  if (maxScrollAreaHeight < 80) maxScrollAreaHeight = 80;

  // 실제 내용보다 작으면 ⇒ 스크롤 필요
  if (scrollArea.scrollHeight > maxScrollAreaHeight) {
    scrollArea.style.maxHeight = maxScrollAreaHeight + 'px';
    scrollArea.style.overflowY = 'auto';
    scrollArea.style.paddingRight = '10px';   // 스크롤 있을 때 오른쪽 여백 추가
  } else {
    scrollArea.style.maxHeight = 'none';
    scrollArea.style.overflowY = 'hidden';
    scrollArea.style.paddingRight = '0px';    // 스크롤 없을 때 여백 제거
  }
}


// 리사이즈시 차트와 맵팝업 조정
window.addEventListener('resize', () => {

  const popupOpen = document.querySelector('.map-popup-inner');
  if (popupOpen) {
    applyPopupScrollBehavior();
  }

  if (window.echarts) {
    document.querySelectorAll('.echarts-instance').forEach((chartEl) => {
      const chart = echarts.getInstanceByDom(chartEl);
      if (chart) chart.resize();
    });
  }
});



// Live 버튼 토글
document.getElementById('liveBtn').addEventListener('click', function () {
  this.classList.toggle('is-live');
});