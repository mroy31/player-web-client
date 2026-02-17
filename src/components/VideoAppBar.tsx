import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import { AppContext } from "../App";

export default function VideoAppBar() {
  const { t } = useTranslation();
  const { client } = React.useContext(AppContext);
  const [version, setVersion] = React.useState("disconnected");
  React.useEffect(() => {
    if (client != null) {
      client
        .getVersion({})
        .then((v) => {
          setVersion(v.version);
        })
        .catch((e) => console.log("Unable to get version: " + e));
    }
  }, [client]);

  return (
    <AppBar component="nav" position="sticky">
      <Stack direction={"row"} alignItems={"center"}>
        <Typography variant="h6" sx={{ my: 1, mx: 2 }}>
          {t("appBar.title")}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Chip
          label={version != "disconnected" ? version : t("appBar.disconnected")}
          color={version != "disconnected" ? "success" : "warning"}
        />
      </Stack>
    </AppBar>
  );
}
