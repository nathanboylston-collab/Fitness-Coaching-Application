import { randomBytes } from "node:crypto";

export function generateInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function inviteExpiryDate() {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  return expires;
}
