-- backend/db/seed_sensors.sql

-- 센서 메타 초기화
DELETE FROM sensors;

-- 센서 메타 입력
INSERT INTO sensors (id, sensor_type, model, serial, mac) VALUES
  (2211, 'vibration',   'SVT200-V', 'SVT200-V-02211', 'c6:30:93:13:e9:60'),
  (2212, 'vibration',   'SVT200-V', 'SVT200-V-02212', 'd5:dd:03:02:a5:d6'),
  (2213, 'vibration',   'SVT200-V', 'SVT200-V-02213', 'c1:a1:6a:ac:ea:66'),
  (2214, 'vibration',   'SVT200-V', 'SVT200-V-02214', 'c9:e5:c1:31:1f:87'),
  (2217, 'vibration',   'SVT200-V', 'SVT200-V-02217', 'fe:65:44:15:9c:82'),
  (604,  'temperature', 'SVT200-T', 'SVT200-T-00604', 'c0:21:85:34:2b:b2'),
  (605,  'temperature', 'SVT200-T', 'SVT200-T-00605', 'c6:bc:07:21:f3:1f'),
  (606,  'temperature', 'SVT200-T', 'SVT200-T-00606', 'd0:10:63:23:e9:e5'),
  (607,  'temperature', 'SVT200-T', 'SVT200-T-00607', 'f7:52:ee:9e:9f:3d'),
  (608,  'temperature', 'SVT200-T', 'SVT200-T-00608', 'cc:be:a9:b8:ef:d6');
