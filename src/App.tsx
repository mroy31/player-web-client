import * as React from 'react';
import Container from '@mui/material/Container';

import { VideoPlayerServiceT, CreateConnectClient } from "./client";
import VideoAppBar from './components/VideoAppBar';
import LibraryPanel from './components/LibraryPanel';
import PlayerToolbar from './components/PlayerToolbar';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

type AppContextT = {
  client: VideoPlayerServiceT| null; 
  error: (err: string) => void;
  info: (err: string) => void;
}

export const AppContext = React.createContext<AppContextT>({
  client: null,
  error: (_) => {},
  info: (_) => {},
})

export default function App() {
  const [grpcClient, setGrpcClient] = React.useState<VideoPlayerServiceT | null>(null)
  const [message, setMessage] = React.useState<{type: string; msg: string} | null>()
  React.useEffect(() => {
    setGrpcClient(CreateConnectClient());
  }, []);

  if (grpcClient == null) {
    return (
      <Container maxWidth="md" sx={{ 
        display: "flex",
        flexDirection: "column",
        height: "99vh",
        justifyContent: "center",
        alignItems: "center"}}>
          <CircularProgress size={40} />
          <Typography variant='h6'>Connection au client</Typography>
      </Container>
    )
  }

  return (
    <AppContext value={{
      client: grpcClient, 
      error: (err) => setMessage({type: "error", msg: err}),
      info: (msg) => setMessage({type: "info", msg}),
    }}>
      <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column", height: "99vh", padding: 0}}>
          <VideoAppBar/>
          <LibraryPanel/>
          <PlayerToolbar/>
          { message != null && (
            <Snackbar
              open={true}
              autoHideDuration={6000}
              onClose={() => setMessage(null)}
              message={message.msg}
            />
          )}
      </Container>
    </AppContext>
  );
}
