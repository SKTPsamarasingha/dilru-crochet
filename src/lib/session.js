import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dilru-crochet-access-token-secret-2026-xyz-abc-12345"
);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "dilru-crochet-refresh-token-secret-2026-xyz-abc-54321"
);

export async function signAccessToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

export async function signRefreshToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
