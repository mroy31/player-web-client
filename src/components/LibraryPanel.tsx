import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import RefreshIcon from "@mui/icons-material/Refresh";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import IconButton from "@mui/material/IconButton";
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from "react-i18next";
import { AppContext } from "../App";
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FormatTime, UnixToDate } from "../utils";

type VideoT = {
  id: number;
  name: string;
  duration: number;
  playerAt: number;
  lastPosition: number;
};

type FolderContentT = {
  folders: string[];
  files: VideoT[];
};

type PlayDialogProps = {
  open: boolean;
  onClose: () => void;
  video: VideoT;
  onPlay: (at: number) => void;
};

function PlayDialog({ open, onClose, video, onPlay }: PlayDialogProps) {
  const { t } = useTranslation();
  const handlePlay = () => {
    onPlay(0);
    onClose();
  };

  const handleResume = () => {
    onPlay(video.lastPosition);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{video.name}</DialogTitle>
      <DialogContent>
        <List>
          <ListItem onClick={handlePlay} sx={{ cursor: "pointer", userSelect: "none" }}>
            <ListItemText
              primary={t("library.playFromBeginning")}
              secondary={`${t("library.duration")}: ${FormatTime(video.duration)}`}
            />
          </ListItem>

          <ListItem onClick={handleResume} sx={{ cursor: "pointer", userSelect: "none" }}>
            <ListItemText
              primary={t("library.resumeAt")}
              secondary={`${t("common.at")} ${FormatTime(video.lastPosition)}/${FormatTime(video.duration)}`}
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}

function LibraryTabContent(props: { value: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { client, error, info } = React.useContext(AppContext);
  const [currentPath, setCurrentPath] = React.useState("");
  const [content, setContent] = React.useState<FolderContentT>({
    files: [],
    folders: [],
  });
  const [selectedVideo, setSelectedVideo] = React.useState<VideoT | null>(null);
  const [updateLoading, setUpdateLoading] = React.useState(false)

  const getFolderContent = React.useCallback(
    (path: string) => {
      client
        ?.libraryGetFolderContent({
          folder: path,
          name: props.value,
        })
        .then((r) => {
          setContent({
            folders: r.folders.map((f) => f.name),
            files: r.videos.map((v) => {
              return {
                id: v.id,
                name: v.name,
                duration: v.duration,
                playerAt: Number(v.playedAt),
                lastPosition: v.lastPosition,
              };
            }),
          });
          setCurrentPath(path);
        });
    },
    [props.value, client],
  );

  const playVideoFile = React.useCallback(
    (video: VideoT, at: number) => {
      client
        ?.playerOpenVideo({
          videoid: video.id,
          position: at,
        })
        .catch((err) => error(err));
    },
    [client],
  );

  const updateLibrary = React.useCallback(() => {
    setUpdateLoading(true)
    client
      ?.libraryUpdate({ name: props.value })
      .then(() => {
        info(t("library.libraryUpdated"));
        setUpdateLoading(false)
      })
      .catch((err) => error(err));
  }, [client, props.value, t, info]);

  React.useEffect(() => {
    getFolderContent("");
  }, [props.value, client]);

  const getParentPath = (path: string): string => {
    if (path === "") return "";
    const parts = path.split("/").filter((p) => p !== "");
    parts.pop();
    return parts.length === 0 ? "" : "/" + parts.join("/");
  };

  const handlePlayButton = (video: VideoT) => {
    video.lastPosition == 0 ? playVideoFile(video, 0) : setSelectedVideo(video);
  };

  return (
    <Stack
      direction={"column"}
      spacing={0}
      sx={{
        flex: "1 1 0%",
        height: "100%",
        minHeight: 0,
        backgroundColor: theme.palette.grey[200],
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ flex: "none", py: "5px" }}
      >
        <Breadcrumbs sx={{ mx: "5px", userSelect: "none" }}>
          {currentPath != "" && (
            <Typography
              onClick={() => getFolderContent("")}
              sx={{ cursor: "pointer" }}
            >
              {t("library.root") || "/"}
            </Typography>
          )}
          {currentPath
            .split("/")
            .filter((p) => p !== "")
            .map((p, i, arr) => {
              const path = "/" + arr.slice(0, i + 1).join("/");
              return (
                <Typography
                  key={path}
                  onClick={() => getFolderContent(path)}
                  sx={{ cursor: "pointer" }}
                >
                  {p}
                </Typography>
              );
            })}
        </Breadcrumbs>

        { updateLoading ? (
          <CircularProgress color="secondary"  size="30px"/>
        ) : (
          <IconButton onClick={updateLibrary}>
            <RefreshIcon />
          </IconButton>
        )}
      </Stack>

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          flex: "1 1 0%",
          height: "100%",
          minHeight: 0,
          overflowY: "scroll",
        }}
      >
        {currentPath != "" && (
          <ListItem
            key="parent"
            onClick={() => getFolderContent(getParentPath(currentPath))}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary=".." />
          </ListItem>
        )}

        {content.folders.map((f) => (
          <ListItem
            key={f}
            onClick={() => getFolderContent(currentPath + "/" + f)}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={f} />
          </ListItem>
        ))}

        {content.files.map((f) => (
          <ListItem
            key={f.id}
            sx={{ cursor: "pointer", userSelect: "none" }}
            secondaryAction={
              <IconButton edge="end" onClick={() => handlePlayButton(f)}>
                <PlayArrowIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <VideoFileIcon
                  color={f.playerAt == 0 ? "secondary" : "inherit"}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={f.name}
              secondary={
                `${t("library.duration")}: ` +
                FormatTime(f.duration) +
                " -- " +
                UnixToDate(f.playerAt)
              }
            />
          </ListItem>
        ))}
      </List>
      {selectedVideo != null && (
        <PlayDialog
          open={true}
          onClose={() => setSelectedVideo(null)}
          onPlay={(at) => playVideoFile(selectedVideo, at)}
          video={selectedVideo}
        />
      )}
    </Stack>
  );
}

export default function LibraryPanel() {
  const { t } = useTranslation();
  const [value, setValue] = React.useState("tvshows");

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        marginTop: "0px",
        borderBottom: 1,
        borderColor: "divider",
        width: "100%",
        heigth: "100%",
        minHeight: 0,
        flex: "1 1 0%",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <Tabs value={value} onChange={handleChange} sx={{ flex: "none" }}>
        <Tab label={t("library.tvShows")} value="tvshows" />
        <Tab label={t("library.movies")} value="movies" />
      </Tabs>
      <LibraryTabContent value={value} />
    </Box>
  );
}
