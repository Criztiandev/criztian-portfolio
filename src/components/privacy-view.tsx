import type { ReactNode } from "react"

import { SiteFooterBar } from "@/components/site-footer-bar"
import { FOOTER } from "@/data/home.data"
import { PRIVACY } from "@/data/privacy.data"

function BodyWithEmailLink({ body }: { body: string }) {
  const nodes: ReactNode[] = []
  for (const [index, part] of body.split(FOOTER.email).entries()) {
    if (index > 0) {
      nodes.push(
        <a
          key={`email-${index}`}
          href={`mailto:${FOOTER.email}`}
          className="underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-paper"
        >
          {FOOTER.email}
        </a>
      )
    }
    nodes.push(part)
  }
  return nodes
}

export function PrivacyView() {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-page px-4 pt-16 pb-6 md:px-8 md:pt-24 md:pb-8 xl:px-10 xl:pt-30 xl:pb-10">
        <header className="flex flex-col gap-4">
          <h1 className="font-heading text-heading-h1 text-paper md:text-display-l">
            {PRIVACY.title}
          </h1>
          <p className="text-body-small text-smoke">{PRIVACY.lastUpdated}</p>
        </header>
        <div className="mt-16 flex max-w-180 flex-col gap-12 md:mt-24 md:gap-16">
          {PRIVACY.sections.map((section) => (
            <section
              key={section.heading}
              className="flex flex-col gap-4 border-t border-graphite pt-6 text-paper"
            >
              <h2 className="font-heading text-heading-h2">{section.heading}</h2>
              <p className="text-body-base">
                <BodyWithEmailLink body={section.body} />
              </p>
            </section>
          ))}
        </div>
        <SiteFooterBar className="mt-16 md:mt-24" />
      </div>
    </div>
  )
}
