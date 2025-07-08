// trigger/rssTrigger.ts
import { schedules, logger } from "@trigger.dev/sdk/v3";

export const rssTriggerTask = schedules.task({
  id: "rss-fetch-trigger",
  cron: "0 * * * *",
  run: async (_, { ctx }) => {
    logger.log("🛰️ Sending request to n8n webhook...");

    const webhookUrl = "https://store-news-korea.conpie.kr/webhook/store";

    try {
      const res = await fetch(webhookUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        logger.error("❌ n8n responded with error", {
          status: res.status,
          statusText: res.statusText,
        });
      } else {
        logger.log("✅ n8n webhook triggered successfully");
      }
    } catch (err) {
      logger.error("❌ Error triggering n8n webhook", { error: err });
    }
  },
});