import { Subtle } from "@app/components/UI/Typography/Subtle.tsx";
import {
  type MessageWithState,
  useDevice,
} from "@app/core/stores/deviceStore.ts";
import { Message } from "@components/PageComponents/Messages/Message.tsx";
import { MessageInput } from "@components/PageComponents/Messages/MessageInput.tsx";
import type { Types } from "@meshtastic/js";
import { InboxIcon } from "lucide-react";
import type { JSX } from "react";

export interface ChannelChatProps {
  messages?: MessageWithState[];
  channel: Types.ChannelNumber;
  to: Types.Destination;
}

const EmptyState = () => (
  <div className="flex flex-col place-content-center place-items-center p-8 text-white">
    <InboxIcon className="h-8 w-8 mb-2" />
    <span className="text-sm">No Messages</span>
  </div>
);

export const ChannelChat = ({
  messages,
  channel,
  to,
}: ChannelChatProps): JSX.Element => {
  const { nodes } = useDevice();

  if (!messages?.length) {
    return (
      <>
        <div className="flex place-content-center place-items-center h-full">
          <EmptyState />
        </div>
        <div className="mt-auto pb-4 w-full">
          <MessageInput to={to} channel={channel} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="w-full">
          {messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              lastMsgSameUser={
                index > 0 && messages[index - 1].from === message.from
              }
              sender={nodes.get(message.from)}
            />
          ))}
        </div>
        <div className="mt-auto pb-4 w-full">
          <MessageInput to={to} channel={channel} />
        </div>
      </div>
    </>
  );
};
