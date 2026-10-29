import Image from "next/image"

import { cn } from "@/lib/utils"
import type { ShotImage } from "@/type/case-study.type"

export function Shot({
  image,
  sizes,
  className,
}: {
  image: ShotImage
  sizes: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-graphite",
        className
      )}
      style={{ aspectRatio: image.aspectRatio }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover object-top"
        style={{ objectPosition: image.objectPosition }}
      />
    </div>
  )
}
