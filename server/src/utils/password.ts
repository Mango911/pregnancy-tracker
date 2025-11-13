// 使用 PBKDF2 进行安全的密码哈希（带盐值）
const ITERATIONS = 100000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

/**
 * 使用 PBKDF2 和随机盐值进行密码哈希
 * 返回格式: salt$hash（用 $ 分隔）
 */
export async function hashPassword(password: string): Promise<string> {
  // 生成随机盐值
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  // 导入密钥
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // 使用 PBKDF2 进行哈希
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    HASH_LENGTH * 8
  );

  const hash = new Uint8Array(derivedBits);

  // 返回 salt$hash 格式
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${saltHex}$${hashHex}`;
}

/**
 * 安全地比较密码（常数时间）
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [saltHex, storedHash] = hash.split('$');

    if (!saltHex || !storedHash) {
      return false;
    }

    // 恢复盐值
    const salt = new Uint8Array(
      saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );

    // 导入密钥
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    // 使用相同的盐值和参数进行哈希
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      key,
      HASH_LENGTH * 8
    );

    const hash2 = new Uint8Array(derivedBits);
    const computedHash = Array.from(hash2)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // 使用常数时间比较来防止时间攻击
    return constantTimeCompare(computedHash, storedHash);
  } catch (error) {
    return false;
  }
}
