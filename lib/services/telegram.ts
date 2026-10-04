const TELEGRAM_API_URL = "https://api.telegram.org";

export type TelegramInviteLink = {
  inviteUrl: string;
  expiresAt: string;
  memberLimit: number;
};

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }
  return token;
}

function communityChatId(): string {
  const chatId = process.env.TELEGRAM_COMMUNITY_CHAT_ID;
  if (!chatId) {
    throw new Error("TELEGRAM_COMMUNITY_CHAT_ID is not configured");
  }
  return chatId;
}

async function callTelegram<T>(method: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${TELEGRAM_API_URL}/bot${botToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload)
  });

  const json = await response.json();

  if (!json.ok) {
    throw new Error(`Telegram ${method} failed: ${json.description ?? "unknown error"}`);
  }

  return json.result as T;
}

export async function createCommunityInviteLink(options?: {
  chatId?: string;
  memberLimit?: number;
  expireSeconds?: number;
  name?: string;
}): Promise<TelegramInviteLink> {
  const chatId = options?.chatId ?? communityChatId();
  const memberLimit = options?.memberLimit ?? 1;
  const expireSeconds = options?.expireSeconds ?? 60 * 60 * 24;
  const expireDate = Math.floor(Date.now() / 1000) + expireSeconds;

  const result = await callTelegram<{
    invite_link: string;
    expire_date: number;
    member_limit: number;
  }>("createChatInviteLink", {
    chat_id: chatId,
    expire_date: expireDate,
    member_limit: memberLimit,
    name: options?.name
  });

  return {
    inviteUrl: result.invite_link,
    expiresAt: new Date(result.expire_date * 1000).toISOString(),
    memberLimit: result.member_limit
  };
}

export async function revokeCommunityInviteLink(
  inviteUrl: string,
  chatId?: string
): Promise<void> {
  await callTelegram<Record<string, never>>("revokeChatInviteLink", {
    chat_id: chatId ?? communityChatId(),
    invite_link: inviteUrl
  });
}