import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import {
  createOrUpdateRecord,
  getRecordsByDateRange,
  getRecordByDate,
  getRecentRecords,
} from '../db/records';

const records = new Hono();

// 应用认证中间件
records.use('/*', authMiddleware);

// 创建或更新记录
records.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();

    if (!data.date) {
      return c.json({ error: 'Date is required' }, 400);
    }

    const record = await createOrUpdateRecord(c.env.DB, userId, data);

    return c.json({ record });
  } catch (error) {
    console.error('Create/update record error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 获取指定日期的记录
records.get('/:date', async (c) => {
  try {
    const userId = c.get('userId');
    const date = c.req.param('date');

    const record = await getRecordByDate(c.env.DB, userId, date);

    if (!record) {
      return c.json({ record: null });
    }

    return c.json({ record });
  } catch (error) {
    console.error('Get record error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 获取日期范围内的记录
records.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const startDate = c.req.query('start');
    const endDate = c.req.query('end');
    const limit = c.req.query('limit');

    if (limit) {
      const recordList = await getRecentRecords(c.env.DB, userId, parseInt(limit));
      return c.json({ records: recordList });
    }

    if (!startDate || !endDate) {
      return c.json({ error: 'Start and end dates are required' }, 400);
    }

    const recordList = await getRecordsByDateRange(c.env.DB, userId, startDate, endDate);

    return c.json({ records: recordList });
  } catch (error) {
    console.error('Get records error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default records;
