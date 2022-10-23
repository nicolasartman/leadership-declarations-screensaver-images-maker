// TODO
// - add windows help
// - favicon

import {
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Popover,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import { saveAs } from "file-saver"
import html2canvas from "html2canvas"
import JSZip from "jszip"
import { useRef, useState } from "react"

function ColorSquare(props: { color: string }) {
  return (
    <span style={{ width: 20, height: 20, background: props.color, display: "inline-block" }} />
  )
}

const colorSets = [
  ["#1AE8FF", "#FF26A2", "#FF8226", "#0DFF8E", "#960DFF", "#999999"],
  ["#FF5A0D", "#FFD60D", "#19FFE9", "#110AC4", "#FF00D3", "#999999"],
  ["#1DB312", "#1EFF0D", "#12A7B3", "#0DEEFF", "#FF1D00", "#999999"],
  ["#B5F8FF", "#FFC2E4", "#FFBE8F", "#A0FF9C", "#A9FFD7", "#BBBBBB"],
  ["#45526B", "#6B544A", "#705D34", "#3A6B65", "#3F5F6B", "#555555"],
]

const questions = [
  "My purpose is",
  "Who I am for you",
  "Who you are for me",
  "What my work makes possible",
  "In service of my purpose you can count on me to",
]

const screenWidth = window.screen.width * window.devicePixelRatio
const screenHeight = window.screen.height * window.devicePixelRatio

type InstructionsTab = "Mac" | "Windows"

function Instructions(props: { onClose: () => void }) {
  const [currentTab, setCurrentTab] = useState<InstructionsTab>("Mac")

  return (
    <Grid
      container
      item
      paddingX={4}
      paddingY={2}
      gap={2}
      direction="column"
      alignItems="center"
      justifyContent={"space-between"}
    >
      <Grid container item alignItems="center" direction="column">
        <Typography variant="h4">How To Use These As A Screen Saver</Typography>
        <Tabs
          value={currentTab}
          onChange={(_event, value: InstructionsTab) => setCurrentTab(value)}
          aria-label="basic tabs example"
        >
          <Tab label="Mac" value={"Mac"} />
          <Tab label="Windows" value={"Windows"} />
        </Tabs>
        {currentTab === "Mac" ? (
          <Grid container item>
            <ol>
              <li>Download & open the zip file. You'll get a folder of images.</li>
              <li>Put that folder anywhere you want, like your Documents folder.</li>
              <li>Open System Preferences</li>
              <li>Click Desktop & Screen Saver</li>
              <li>Click the tab labeled Screen Saver</li>
              <li>Choose the screen saver "Classic" or any other one that supports using photos</li>
              <li>
                In the right panel where it says "Source", click the choice menu and click "Choose
                Folder"
              </li>
              <li>Navigate to the folder from step 2 and click Choose</li>
            </ol>
          </Grid>
        ) : (
          <Grid container item>
            <ol>
              <li>Download & open the zip file. You'll get a folder of images.</li>
              <li>Put that folder anywhere you want, like your Documents folder.</li>
              <li>Open the Start Menu (a.k.a. Windows Menu) and click on the search box</li>
              <li>Type "Screen Saver" and click the result that says "Change the Screen Saver"</li>
              <li>Choose the "Photos" screen saver</li>
              <li>Click "Settings"</li>
              <li>Under "Use Pictures From" click the Browse button</li>
              <li>Navigate to the folder from step 2 and then click Ok</li>
            </ol>
          </Grid>
        )}
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={props.onClose}>
          Close
        </Button>
      </Grid>
    </Grid>
  )
}

function App() {
  const [answers, setAnswers] = useState(["", "", "", "", ""])
  const [selectedColorSetIndex, setSelectedColorSetIndex] = useState(0)
  const elementRefs = useRef<Array<HTMLDivElement | null>>([])
  const [instructionsAreOpen, setInstructionsAreOpen] = useState(false)

  const downloadImages = async () => {
    const imageBlobs = await Promise.all(
      elementRefs.current?.map(async (element) => {
        return new Promise<Blob>(async (resolve, reject) => {
          if (element) {
            const canvas = await html2canvas(element)

            canvas.toBlob(
              (blob) => (blob ? resolve(blob) : reject("Something went wrong!")),
              "image/png",
            )
          }
        })
      }),
    )

    let zip = new JSZip()
    let folder = zip.folder("Leadership Declaration Images")
    if (folder) {
      for (const [index, imageBlob] of imageBlobs.entries()) {
        folder.file(`Leadership Declaration ${index + 1}.png`, imageBlob, {
          base64: true,
        })
      }
      const zipContent = await zip.generateAsync({ type: "blob" })
      saveAs(zipContent, "Leadership Declaration Images.zip")
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent={"space-between"}
      padding={4}
      minHeight="100vh"
    >
      <Container component="main">
        <Grid container item justifyContent="center">
          <Typography variant="h3">Make Leadership Declaration Images</Typography>
          <Grid container item xs={12} sm={10} paddingTop={4}>
            {/* Questions & Answers */}
            <Grid container item direction="column" xs={12} md={6} gap={2} paddingX={2}>
              <Typography variant="h4" textAlign="left">
                My Declaration
              </Typography>
              {answers.map((answer, answerIndex) => (
                <TextField
                  key={`answer${answerIndex}`}
                  variant="standard"
                  label={questions[answerIndex]}
                  value={answer}
                  onChange={(e) =>
                    setAnswers([
                      ...answers.slice(0, answerIndex),
                      e.target.value,
                      ...answers.slice(answerIndex + 1, answers.length),
                    ])
                  }
                />
              ))}

              <Grid container alignItems="center" gap={2}>
                <InputLabel htmlFor="colorSetSelector">Colors</InputLabel>
                <Select
                  labelId="colorSetSelector"
                  variant="standard"
                  autoWidth
                  value={selectedColorSetIndex}
                  onChange={(event) => {
                    const colorSet = event.target.value
                    if (typeof colorSet === "number") {
                      setSelectedColorSetIndex(colorSet)
                    }
                  }}
                >
                  {colorSets.map((colorSet, colorSetIndex) => (
                    <MenuItem value={colorSetIndex} key={`colorSet${colorSetIndex}`}>
                      <Grid container gap={1} paddingY={1}>
                        {colorSet.map((color, colorIndex) => (
                          <ColorSquare color={color} key={`color${colorIndex}`} />
                        ))}
                      </Grid>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            {/* Preview */}
            <Grid container item direction="column" xs={12} md={6} gap={2} paddingX={2}>
              <Typography variant="h4" textAlign="left">
                Preview
              </Typography>

              <Grid container item direction="row" xs="auto">
                <Grid container item direction="column" alignItems="end" xs="auto" gap={2}>
                  <Grid
                    container
                    item
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    width="400px"
                    height={`${(400 * 9) / 16}px`}
                    padding="20px"
                    style={{
                      backgroundColor: "black",
                    }}
                  >
                    <Grid item style={{ fontSize: 14, color: colorSets[selectedColorSetIndex][5] }}>
                      My purpose is
                    </Grid>
                    <Grid item style={{ fontSize: 20, color: colorSets[selectedColorSetIndex][0] }}>
                      {answers[0]}
                    </Grid>
                  </Grid>

                  <Grid container item justifyContent={"space-between"}>
                    <Grid item>
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={() => setInstructionsAreOpen(true)}
                      >
                        Show Instructions
                      </Button>
                      <Modal
                        open={instructionsAreOpen}
                        onClose={() => setInstructionsAreOpen(false)}
                      >
                        <Grid
                          container
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "60%",
                            height: "50%",
                            minHeight: "min(400px, 100%)",
                            minWidth: "min(600px, 100%)",
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            borderRadius: 2,
                          }}
                        >
                          <Instructions onClose={() => setInstructionsAreOpen(false)} />
                        </Grid>
                      </Modal>
                    </Grid>
                    <Button variant="contained" onClick={downloadImages}>
                      Download Images
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* The actual elements that get rendered into the images */}
        <div style={{ overflow: "hidden", position: "relative" }}>
          {/* Keep the actual elements to snapshot off screen so they're not visible but
              can be appropriately sized */}
          <div
            style={{
              position: "absolute",
              bottom: -100000,
              right: -100000,
            }}
          >
            {answers.map((answer, answerIndex) => (
              <div
                key={`answer${answerIndex}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "black",
                  justifyContent: "center",
                  alignItems: "center",
                  width: screenWidth,
                  height: screenHeight,
                  padding: `${(screenWidth / 400) * 20}px`,
                }}
                ref={(element) => {
                  elementRefs.current[answerIndex] = element
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontSize: (screenWidth / 400) * 14,
                      lineHeight: "1.5em",
                      color: colorSets[selectedColorSetIndex][5],
                    }}
                  >
                    {questions[answerIndex]}
                  </div>
                  <div
                    style={{
                      fontSize: (screenWidth / 400) * 20,
                      lineHeight: "1.5em",
                      color: colorSets[selectedColorSetIndex][answerIndex],
                    }}
                  >
                    {answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
      <Grid item paddingTop={8}>
        Crafted with gratitude by Nick in support of{" "}
        <Link href="https://www.be-un.com/" target="_blank">
          Un
        </Link>
        . Contribute{" "}
        <Link
          href="https://github.com/nicolasartman/leadership-declarations-screensaver-images-maker"
          target="_blank"
        >
          on GitHub
        </Link>
        .
        <br />
        These questions were created by{" "}
        <Link href="https://www.be-un.com/about">Gabriel Sakakeeny &amp; Scott Forgey</Link> and all
        credit and rights are theirs.
      </Grid>
    </Box>
  )
}

export default App
