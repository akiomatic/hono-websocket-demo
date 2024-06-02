import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const app = new Hono();

const ws = app.get(
  "/ws",
  upgradeWebSocket((c) => {
    let intervalId: Timer;
    return {
      onOpen(_event, ws) {
        intervalId = setInterval(() => {
          ws.send(new Date().toString());
        }, 200);
      },
      onMessage: (event) => {
        console.log(event.data);
      },
      onClose() {
        clearInterval(intervalId);
      },
    };
  }),
);

Bun.serve({
  fetch: app.fetch,
  websocket,
});
