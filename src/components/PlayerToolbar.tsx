import * as React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from 'react-i18next';
import { AppContext } from "../App";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Slider from "@mui/material/Slider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FormatTime } from "../utils";
import { PlayerStateT, VideoT } from "../types";
import PlayerChannelsDialog from "./PlayerChannelsDialog";
import PlayerSeekDialog from "./PlayerSeekDialog";

export default function PlayerToolbar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { client, error } = React.useContext(AppContext);
  const [state, setState] = React.useState<PlayerStateT>({
    volume: 0,
    playingStatus: "stop",
    videoId: -1,
    timePosition: 0,
    aChannelIdx: 0,
    sChannelIdx: 0,
  });
  const [currentVideo, setCurrentVideo] = React.useState<VideoT | null>(null);
  const [anchorMenu, setAnchorMenu] = React.useState<null | HTMLElement>(null);
  const [chDialogOpen, setChDialogOpen] = React.useState(false);
  const [seekDialogOpen, setSeekDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (client != null) {
      (async () => {
        const stream = client.playerStreamState({client: "web-player"})
        for await (const st of stream) {
            setState({
              volume: st.volume,
              playingStatus: st.playingStatus,
              videoId: st.videoId,
              timePosition: st.timePosition,
              aChannelIdx: st.aid,
              sChannelIdx: st.sid,
            });
        }
      })();
    }
  }, [client]);

  React.useEffect(() => {
    if (state.videoId != -1) {
      client
        ?.libraryGetVideoByID({ videoid: state.videoId })
        .then((vid) =>
          setCurrentVideo({
            name: vid.name,
            duration: vid.duration,
            audioStreams: vid.audioStreams,
            subStreams: vid.subStreams,
          }),
        )
        .catch((err) => error(err));
    } else if (currentVideo != null) {
      setCurrentVideo(null);
    }
  }, [client, state.videoId]);

  const handleStop = React.useCallback(() => {
    client?.playerStop({}).catch((err) => error(err));
  }, [client]);

  const handlePlayPause = React.useCallback(() => {
    client?.playerPlayPause({}).catch((err) => error(err));
  }, [client]);

  const handleVolume = React.useCallback(
    (_: Event, value: number | number[], activeThumb: number) => {
      if (activeThumb) {
        return;
      }
      client
        ?.playerSetProperty({
          name: "volume",
          value: Number(value),
        })
        .catch((err) => error(err));
    },
    [client],
  );

  // Menu callbacks
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorMenu(null);
  };

  return (
    <Stack
      direction={"column"}
      spacing={1}
      sx={{
        width: "100%",
        flex: "none",
        backgroundColor: theme.palette.grey[200],
      }}
    >
      {currentVideo != null && (
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction={"row"}
          spacing={1}
          sx={{ width: "100%", padding: "5px" }}
        >
          <Typography variant="body1">
            {currentVideo.name} ({FormatTime(state.timePosition)} /{" "}
            {FormatTime(currentVideo.duration)})
          </Typography>

          <IconButton
            id="player-menu-btn"
            aria-controls={Boolean(anchorMenu) ? "player-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorMenu) ? "true" : undefined}
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="player-menu"
            anchorEl={anchorMenu}
            open={Boolean(anchorMenu)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            slotProps={{
              list: {
                "aria-labelledby": "player-menu-btn",
              },
            }}
          >
            <MenuItem 
              onClick={() => {
                handleMenuClose()
                setSeekDialogOpen(true);
              }}
            >
              {t('player.seek')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setChDialogOpen(true);
              }}
            >
              {t('player.audioSubtitleChannel')}
            </MenuItem>
          </Menu>
        </Stack>
      )}

      <Stack direction={"row"} spacing={1} sx={{ width: "100%" }}>
        <IconButton onClick={() => handlePlayPause()} color="default">
          {state.playingStatus != "play" ? <PlayArrowIcon /> : <PauseIcon />}
        </IconButton>
        <IconButton onClick={() => handleStop()} color="default">
          <StopIcon />
        </IconButton>

        <Stack
          direction={"row"}
          spacing={1}
          sx={{ alignItems: "center", flex: "1 1 0%" }}
        >
          <VolumeDown />
          <Slider
            aria-label={t('player.volume')}
            value={state.volume}
            onChange={handleVolume}
          />
          <VolumeUp />
        </Stack>
      </Stack>

      {currentVideo != null && (
        <>
          <PlayerChannelsDialog
            state={state}
            open={chDialogOpen}
            onClose={() => setChDialogOpen(false)}
            video={currentVideo}
          />
          <PlayerSeekDialog
            state={state}
            open={seekDialogOpen}
            onClose={() => setSeekDialogOpen(false)}
            video={currentVideo}
          />
        </>
      )}
    </Stack>
  );
}
