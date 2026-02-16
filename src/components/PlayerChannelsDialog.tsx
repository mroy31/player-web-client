import { AppContext } from "../App";
import { PlayerStateT, VideoT } from "../types";
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";

const PlayerChannelsDialog = (props: {
  state: PlayerStateT;
  video: VideoT;
  open: boolean;
  onClose: () => void;
}) => {
  const { client, error } = React.useContext(AppContext);

  const setProperty = React.useCallback(
    (name: string, value: number) => {
      client
        ?.playerSetProperty({ name, value })
        .then(() => {})
        .catch((err) => error(err));
    },
    [client],
  );

  return (
    <Dialog 
        open={props.open} 
        onClose={props.onClose}
    >
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Audio</TableCell>
              <TableCell>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="achannel-label">Lang</InputLabel>
                  <Select
                    labelId="achannel-label"
                    id="achannel-select"
                    value={props.state.aChannelIdx}
                    label="Age"
                    onChange={(e) => setProperty("aid", e.target.value)}
                  >
                    {props.video.audioStreams.map((s) => (
                      <MenuItem value={s.idx} key={s.idx}>
                        {s.lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Subtitle</TableCell>
              <TableCell>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="schannel-label">Lang</InputLabel>
                  <Select
                    labelId="schannel-label"
                    id="schannel-select"
                    value={props.state.sChannelIdx}
                    label="Age"
                    onChange={(e) => setProperty("sid", e.target.value)}
                  >
                    <MenuItem value={0} key={0}>
                      disable
                    </MenuItem>
                    {props.video.subStreams.map((s) => (
                      <MenuItem value={s.idx} key={s.idx}>
                        {s.lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerChannelsDialog;
