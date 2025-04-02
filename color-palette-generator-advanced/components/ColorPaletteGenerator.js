
import { useState } from "react"

function generatePalette(baseHue = null) {
  const startHue = baseHue !== null ? baseHue : Math.floor(Math.random() * 360)
  return Array.from({ length: 6 }, (_, i) => {
    const hue = (startHue + i * 30) % 360
    return `hsl(${hue}, 70%, 50%)`
  })
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

function contrastRatio(hex1, hex2) {
  const luminance = hex => {
    const a = hex.replace('#', '').match(/.{2}/g).map(x =>
      parseInt(x, 16) / 255
    ).map(v =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    )
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
  }

  const L1 = luminance(hex1)
  const L2 = luminance(hex2)
  return ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2)
}

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState(generatePalette())
  const [locks, setLocks] = useState(Array(6).fill(false))
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => setDarkMode(!darkMode)

  const generate = () => {
    const baseHue = Math.floor(Math.random() * 360)
    const newColors = generatePalette(baseHue)
    const result = colors.map((color, i) => locks[i] ? color : newColors[i])
    setColors(result)
  }

  const toggleLock = (index) => {
    const updated = [...locks]
    updated[index] = !updated[index]
    setLocks(updated)
  }

  const downloadPDF = () => {
    alert("🧾 PDF export is a placeholder here – implement with jsPDF or server-side function.")
  }

  const bg = darkMode ? "#121212" : "#ffffff"
  const text = darkMode ? "#f1f1f1" : "#111"
  const border = darkMode ? "#444" : "#ccc"

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "2rem auto",
      padding: "2rem",
      background: bg,
      color: text,
      borderRadius: "1rem",
      fontFamily: "sans-serif",
      boxShadow: "0 0 20px rgba(0,0,0,0.15)"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎨 Advanced Color Palette Generator</h1>

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
          borderRadius: "0.5rem",
          marginRight: "1rem"
        }}>
          Generate Palette
        </button>
        <button onClick={downloadPDF} style={{
          padding: "0.5rem 1rem",
          background: "#444",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem"
        }}>
          Export PDF
        </button>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "space-between"
      }}>
        {colors.map((c, i) => {
          const hex = hexFromHSL(c)
          const contrast = contrastRatio(hex, darkMode ? "#121212" : "#ffffff")
          const barWidth = Math.min(100, Math.round((contrast / 21) * 100))
          const barColor = contrast >= 7 ? "#4caf50" : contrast >= 4.5 ? "#ffc107" : "#f44336"

          return (
            <div key={i} style={{
              flex: "1 1 150px",
              minWidth: "140px",
              height: "160px",
              background: c,
              borderRadius: "0.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "0.5rem",
              color: "#fff",
              fontWeight: "bold",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
              position: "relative"
            }}>
              <div>{hex}</div>
              <div style={{ fontSize: "0.75rem" }}>Contrast: {contrast}</div>
              <div style={{
                height: "6px",
                width: "100%",
                background: "#00000033",
                borderRadius: "3px",
                overflow: "hidden",
                marginTop: "4px"
              }}>
                <div style={{
                  width: barWidth + "%",
                  background: barColor,
                  height: "100%"
                }}></div>
              </div>
              <button onClick={() => toggleLock(i)} style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "#00000055",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "2px 6px",
                fontSize: "0.7rem",
                cursor: "pointer"
              }}>
                {locks[i] ? "🔒" : "🔓"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
