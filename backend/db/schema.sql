PRAGMA foreign_keys = ON;

-- 센서 기본 메타 정보
CREATE TABLE IF NOT EXISTS sensors (
  id           INTEGER PRIMARY KEY,        -- 센서 ID (예: 2211, 604)
  sensor_type  TEXT    NOT NULL,           -- vibration / temperature
  model        TEXT    NOT NULL,           -- SVT200-V / SVT200-T
  serial       TEXT    NOT NULL UNIQUE,    -- 센서 시리얼
  mac          TEXT    NOT NULL UNIQUE     -- 센서 MAC 주소
);

-- 센서 장착 이력 (시간에 따라 변하는 관계)
CREATE TABLE IF NOT EXISTS sensor_install_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT, -- 이력 레코드 ID
  sensor_id   INTEGER NOT NULL,                  -- sensors.id 참조
  fleet       INTEGER NOT NULL,                  -- 편성 / 키트 번호 (예: 11, 45)
  car_type    TEXT    NOT NULL,                  -- M1 / TC1 ...
  device      TEXT    NOT NULL,                  -- 차축베어링 / 레벨링 밸브 / 드라이빙기어 / 견인전동기
  description TEXT    NOT NULL,                  -- 설치 위치 설명
  start_date  TEXT    NOT NULL,                  -- YYYY-MM-DD (ISO date string)
  end_date    TEXT,                              -- YYYY-MM-DD 또는 NULL
  event_note  TEXT,                              -- 비고

  FOREIGN KEY (sensor_id) REFERENCES sensors(id)
);
