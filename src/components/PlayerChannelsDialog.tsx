import { AppContext } from "../App";
import { PlayerStateT, VideoT } from "../types";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
              <TableCell>{t('player.audio')}</TableCell>
              <TableCell>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="achannel-label">{t('player.language')}</InputLabel>
                  <Select
                    labelId="achannel-label"
                    id="achannel-select"
                    value={props.state.aChannelIdx}
                    label={t('player.language')}
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
              <TableCell>{t('player.subtitle')}</TableCell>
              <TableCell>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="schannel-label">{t('player.language')}</InputLabel>
                  <Select
                    labelId="schannel-label"
                    id="schannel-select"
                    value={props.state.sChannelIdx}
                    label={t('player.language')}
                    onChange={(e) => setProperty("sid", e.target.value)}
                  >
                    <MenuItem value={0} key={0}>
                      {t('common.disable')}
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
        <Button onClick={props.onClose}>{t('common.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerChannelsDialog;
