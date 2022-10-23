import { red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
  palette: {
    mode: "dark",
    primary: { main: "#1AEAFF" },
    secondary: { main: "#0DFF90" },
    error: { main: red.A400 },
  },
})

export default theme
