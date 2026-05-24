import PropTypes from "prop-types";

// assets
import { BorderOutlined } from "@ant-design/icons";
import { CheckSquareFilled } from "@ant-design/icons";
import { MinusSquareFilled } from "@ant-design/icons";
import { getInteractionTransition, getSubtleHover, getInteractionFocusRing } from "../appTokens";

function getSizeStyle(size) {
  switch (size) {
    case "small":
      return { fontSize: 1.15 };
    case "large":
      return { fontSize: 1.6 };
    case "medium":
    default:
      return { fontSize: 1.35 };
  }
}

function checkboxStyle(size) {
  const sizes = getSizeStyle(size);

  return {
    "& .icon": {
      fontSize: `${sizes.fontSize}rem`,
    },
  };
}

// ==============================|| OVERRIDES - CHECKBOX (MUI por defecto) ||============================== //

export default function Checkbox(theme) {
  const { palette } = theme;

  return {
    MuiCheckbox: {
      defaultProps: {
        className: "size-small",
        icon: <BorderOutlined className="icon" />,
        checkedIcon: <CheckSquareFilled className="icon" />,
        indeterminateIcon: <MinusSquareFilled className="icon" />,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          color: palette.secondary[300],
          ...getInteractionTransition(),
          ...getInteractionFocusRing(theme, "primary"),
          "&:hover": getSubtleHover(theme, "primary"),
          "&.size-small": {
            ...checkboxStyle("small"),
          },
          "&.size-medium": {
            ...checkboxStyle("medium"),
          },
          "&.size-large": {
            ...checkboxStyle("large"),
          },
        },
      },
    },
  };
}

getSizeStyle.propTypes = { size: PropTypes.string };
