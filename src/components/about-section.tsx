import Image from "next/image"

import { ABOUT } from "@/data/home.data"

export function AboutSection() {
  return (
    <section className="bg-black">
      <div className="mx-auto flex max-w-page flex-col gap-12 px-4 py-20 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-0 md:px-8 md:py-24 xl:grid-cols-3 xl:grid-rows-[auto_auto_1fr] xl:gap-x-10 xl:px-10 xl:py-30">
        <h2 className="font-heading text-heading-h1 text-paper md:col-start-2 md:row-start-1 md:text-display-l xl:col-span-2 xl:col-start-2">
          {ABOUT.heading}
        </h2>
        <div className="group relative aspect-4/5 md:col-start-1 md:row-span-2 md:row-start-1 md:self-start xl:row-span-3 xl:row-start-1">
          <Image
            src={ABOUT.photos.desk.src}
            alt={ABOUT.photos.desk.alt}
            fill
            sizes="(min-width: 1280px) 434px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <Image
            src={ABOUT.photos.client.src}
            alt={ABOUT.photos.client.alt}
            fill
            sizes="(min-width: 1280px) 434px, (min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-0 transition-opacity duration-(--motion-slow) ease-out group-hover:opacity-100 motion-reduce:transition-none"
          />
        </div>
        <p className="text-body-large text-paper md:col-start-2 md:row-start-2 md:mt-6 xl:col-span-2 xl:col-start-2 xl:mt-8 xl:w-160">
          {ABOUT.body}
        </p>
        <ul className="flex flex-col md:col-span-2 md:mt-12 md:grid md:grid-cols-3 md:gap-8 xl:col-start-2 xl:row-start-3 xl:mt-0 xl:gap-10 xl:self-end">
          {ABOUT.stats.map((stat) => (
            <li
              key={stat.value}
              className="grid grid-cols-2 items-center gap-4 border-t border-graphite pt-6 pb-4 md:flex md:flex-col md:items-start md:gap-2 md:pb-0"
            >
              <p className="font-heading text-heading-h1 text-red xl:text-display-l">
                {stat.value}
              </p>
              <p className="text-body-small text-smoke">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
