import { schedules, logger } from "@trigger.dev/sdk/v3";

export const heartbeatTask = schedules.task({
  id: "heartbeat-task",
  cron: "*/10 * * * *", // 매 10분마다
  run: async (payload, { ctx }) => {
    const now = new Date().toISOString();
    logger.log("🔁 Heartbeat triggered!", { now });
  },
});