import { Footer, Header } from "@/components/site/Shell"
import { Contact } from "@/components/site/FaqContact"

/** 与首页同一段内容的独立页（顶部导航的落点）；`Section` 自带上下留白，这里只留出顶栏的高度 */
export default function Page() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Contact />
      </main>
      <Footer />
    </>
  )
}
