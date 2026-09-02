"use client";

import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/components/date-picker/date-picker.css";

const popperContainer = ({ children }) =>
  typeof document !== "undefined" ? createPortal(children, document.body) : children;

/**
 * Selector de año con popper en portal y z-index alto (no queda tapado por cards/layout).
 */
export default function YearPickerField({
  selected,
  onChange,
  label = "Año",
  renderYearContent,
  disabled = false,
  sx = {},
}) {
  const selectedDate =
    selected instanceof Date
      ? selected
      : selected
        ? new Date(Number(selected), 0, 1)
        : null;

  const handleChange = (date) => {
    if (!onChange) return;
    onChange(date);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        "& .react-datepicker-wrapper": { width: "100%", display: "block" },
        ...sx,
      }}
    >
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showYearPicker
        dateFormat="yyyy"
        renderYearContent={renderYearContent}
        disabled={disabled}
        popperContainer={popperContainer}
        popperClassName="app-datepicker-popper"
        popperPlacement="bottom-start"
        customInput={
          <TextField
            fullWidth
            label={label}
            size="small"
            value={selectedDate ? selectedDate.getFullYear() : ""}
            disabled={disabled}
            InputProps={{ readOnly: true }}
          />
        }
      />
    </Box>
  );
}

YearPickerField.propTypes = {
  selected: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  renderYearContent: PropTypes.func,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
