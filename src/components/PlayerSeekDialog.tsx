import { AppContext } from "../App";
import { PlayerStateT, VideoT } from "../types";
import { FormatTime } from "../utils";
import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
  Slider,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";

const PlayerSeekDialog = (props: {
  state: PlayerStateT;
  video: VideoT;
  open: boolean;
  onClose: () => void;
}) => {
  const { client, error } = React.useContext(AppContext);
  const [value, setValue] = React.useState(0);
  const [isDrag, setIsDrag] = React.useState(false);

  const seek = React.useCallback(
    (pos: number) => {
      client
        ?.playerSetProperty({
          name: "time-pos",
          value: Math.floor(pos),
        })
        .then(() => setIsDrag(false))
        .catch((err) => error(err));
    },
    [client, error],
  );

  const handleSliderChange = (_: Event, value: number | number[]) => {
    setValue(Math.floor(Number(value)));
    setIsDrag(true);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={props.open}
      onClose={props.onClose}
    >
      <DialogContent>
        <Stack direction={"column"}>
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            sx={{ width: "100%" }}
          >
            <Typography variant="body1">
              {FormatTime(isDrag ? value : props.state.timePosition)}
            </Typography>
            <Slider
              aria-label="Volume"
              max={props.video.duration}
              value={isDrag ? value : props.state.timePosition}
              onChange={handleSliderChange}
              onChangeCommitted={(_, v) => { seek(Number(v)); }}
            />
            <Typography variant="body1">
              {FormatTime(props.video.duration)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{ width: "100%" }}
        >
          <Button onClick={() => seek(props.state.timePosition - 60)}>
            -60s
          </Button>
          <Button onClick={() => seek(props.state.timePosition - 10)}>
            -10s
          </Button>
          <Button onClick={() => seek(props.state.timePosition + 10)}>
            +10s
          </Button>
          <Button onClick={() => seek(props.state.timePosition + 60)}>
            +60s
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerSeekDialog;
