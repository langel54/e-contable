import React from "react";
import {
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import { FileExcelFilled, FilePdfFilled } from "@ant-design/icons";

const IncomesActionsPopover = ({
  anchorElPop,
  handleActionOpen,
  handleGenerateExcel,
  exportingExcel,
  onOtherAction,
  handleClosePop,
}) => (
  <Popover
    open={Boolean(anchorElPop)}
    anchorEl={anchorElPop}
    onClose={handleActionOpen}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <List>
      <ListItem sx={{ cursor: "pointer" }} onClick={handleGenerateExcel} disabled={exportingExcel}>
        <ListItemIcon sx={(theme) => ({ color: theme.palette.success.main })}>
          {exportingExcel ? <CircularProgress size={20} color="success" /> : <FileExcelFilled />}
        </ListItemIcon>
        <ListItemText primary={exportingExcel ? "Exportando..." : "Exportar Excel"} />
      </ListItem>
      <Divider />
      <ListItem sx={{ cursor: "pointer" }} onClick={() => { onOtherAction(); handleClosePop(); }}>
        <ListItemIcon sx={(theme) => ({ color: theme.palette.error.main })}>
          <FilePdfFilled />
        </ListItemIcon>
        <ListItemText primary="Imprimir PDF" />
      </ListItem>
    </List>
  </Popover>
);

export default IncomesActionsPopover;
