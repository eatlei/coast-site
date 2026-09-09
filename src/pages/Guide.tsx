import { BookOpen } from "lucide-react"
import { DocPage } from "@/components/site/Shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MAIL, useLang } from "@/lib/i18n"

export default function Guide() {
  const { t } = useLang()
  return (
    <DocPage title={t("使用手册", "Manual")} subtitle={t("从导入第一笔账，到看懂自由倒计时。", "From your first import to reading the freedom countdown.")}>
      <Card className="border-dashed bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary"><BookOpen className="size-6" /></div>
          <p className="font-medium">{t("内容整理中", "Coming soon")}</p>
          <p className="max-w-[360px] text-sm text-muted-foreground">{t("手册还在写。期间有任何问题，直接写信，我们通常几天内回复。", "The manual is being written. Meanwhile, email us and we usually reply within a few days.")}</p>
          <Button variant="outline" size="sm" render={<a href={`mailto:${MAIL}`} />}>{MAIL}</Button>
        </CardContent>
      </Card>
    </DocPage>
  )
}
