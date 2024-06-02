import { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export const WebSocketDemo = () => {
  const [fullMessageHistory, setFullMessageHistory] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000/ws",
    {
      onOpen: () => console.log("opened"),
      onMessage: (e) => console.log("message", e),
    },
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const handleClickShowFullMessages = useCallback(() => {
    setFullMessageHistory((prev) => !prev);
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: "1.5rem",
      }}
    >
      <span
        style={{
          fontSize: "1.5rem",
          color: readyState === ReadyState.OPEN ? "lime" : "red",
        }}
      >
        The WebSocket is currently {connectionStatus}
      </span>

      {lastMessage && <span>Last message: {lastMessage.data}</span>}

      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>

      <button onClick={handleClickShowFullMessages}>
        Click Me to show all messages
      </button>

      {fullMessageHistory && (
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      )}
    </div>
  );
};
