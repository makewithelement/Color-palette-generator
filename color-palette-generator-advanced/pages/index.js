import dynamic from "next/dynamic"
import Head from "next/head"

const ColorPaletteGenerator = dynamic(() => import("../components/ColorPaletteGenerator"), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <Head>
        <title>Advanced Color Palette Generator</title>
      </Head>
      <ColorPaletteGenerator />
    </>
  )
}
