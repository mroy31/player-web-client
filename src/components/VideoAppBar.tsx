
import * as React from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { AppContext } from "../App";

export default function VideoAppBar() {
  const { client } = React.useContext(AppContext)
  const [version, setVersion] = React.useState("disconnected");
  React.useEffect(() => {
    if (client != null) {
      client.getVersion({}).then((v) => {
        setVersion(v.version);
      })
      .catch((e) => console.log("Unable to get version: " + e)); 
    }

  }, [client])

  return (
    <AppBar component="nav" position="sticky">
      <Stack direction={"row"} alignItems={"center"}>
        <Typography variant="h6" sx={{ my: 1, mx: 2 }}>
          Video Player
        </Typography>

        <Box sx={{flexGrow: 1}}/>

        <Chip label={version} color={version != "disconnected" ? "success" : "warning"} />
      </Stack>
    </AppBar>
  )

}
