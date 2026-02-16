

import { createClient, Transport, Client } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { VideoPlayerService  } from './gen/player/v1/player_pb';

export type VideoPlayerServiceT = Client<typeof VideoPlayerService>;

export function CreateConnectClient(): VideoPlayerServiceT {
  const apiUrl = import.meta.env.VITE_SERVER_API_URL;
  const transport: Transport = createConnectTransport({
    baseUrl: apiUrl,
  });

  // Create the client using the generated service definition and the transport
  return createClient(VideoPlayerService, transport);
}