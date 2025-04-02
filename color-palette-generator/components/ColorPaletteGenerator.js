
import { useState } from "react"

function generatePalette() {
  const baseHue = Math.floor(Math.random() * 360)
  const palette = Array.from({ length: 6 }, (_, i) => {
    const hue = (baseHue + i * 30) % 360
    return `hsl(${hue}, 70%, 50%)`
  })
  return palette
}

function hexFromHSL(hsl) {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const a = s * Math.min(l / 100, 1 - l / 100) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState(generatePalette())
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => setDarkMode(!darkMode)
  const generate = () => setColors(generatePalette())

  const bg = darkMode ? "#121212" : "#ffffff"
  const text = darkMode ? "#f1f1f1" : "#111"
  const border = darkMode ? "#444" : "#ccc"

  return (
    <div style={{
      maxWidth: "900px",
      margin: "2rem auto",
      padding: "2rem",
      background: bg,
      color: text,
      borderRadius: "1rem",
      fontFamily: "sans-serif",
      boxShadow: "0 0 15px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🎨 Color Palette Generator</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={toggleTheme} style={{
          padding: "0.5rem 1rem",
          background: "transparent",
          color: text,
          border: `1px solid ${border}`,
          borderRadius: "0.5rem",
          marginRight: "1rem"
        }}>
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
        <button onClick={generate} style={{
          padding: "0.5rem 1rem",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem"
        }}>
          Generate Palette
        </button>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "space-between"
      }}>
        {colors.map((c, i) => (
          <div key={i} style={{
            flex: "1 1 120px",
            minWidth: "100px",
            height: "100px",
            background: c,
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.9rem",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)"
          }}>
            {hexFromHSL(c)}
          </div>
        ))}
      </div>
    </div>
  )
}
