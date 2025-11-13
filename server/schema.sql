-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    age INTEGER,
    gender TEXT,
    health_goals TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 每日健康记录表
-- 支持多种健康指标的通用记录
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    -- 睡眠数据
    sleep_hours REAL,
    sleep_quality INTEGER CHECK(sleep_quality >= 1 AND sleep_quality <= 5),
    -- 运动数据
    exercise_minutes INTEGER,
    exercise_type TEXT,
    exercise_intensity INTEGER CHECK(exercise_intensity >= 1 AND exercise_intensity <= 5),
    -- 饮食数据
    diet_breakfast TEXT,
    diet_lunch TEXT,
    diet_dinner TEXT,
    diet_snacks TEXT,
    water_intake INTEGER,
    -- 心理健康
    mood INTEGER CHECK(mood >= 1 AND mood <= 5),
    stress_level INTEGER CHECK(stress_level >= 1 AND stress_level <= 5),
    anxiety_level INTEGER CHECK(anxiety_level >= 1 AND anxiety_level <= 5),
    -- 生理指标
    body_temperature REAL,
    weight REAL,
    heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    -- 其他
    symptoms TEXT,
    medications TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
);

-- Web Push 订阅表
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    notification_enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, endpoint)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_records_user_date ON records(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_records_user ON records(user_id);
CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_enabled ON push_subscriptions(notification_enabled);
