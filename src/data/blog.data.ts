import { ABOUT } from "@/data/home.data"
import type { FooterLink } from "@/type/home.type"

export const ALL_POSTS_LINK: FooterLink = { href: "/blog", label: "All posts" }

export const LATEST_POST_COUNT = 3

export const BLOG = {
  title: "Blog",
  intro:
    "Straight answers about your website: what it costs, what it should show, and how to keep it yours.",
  readPost: "Read the post",
  minRead: "min read",
  empty: "No posts yet.",
  byline: "By Criztian",
  authorNote:
    "Written by Criztian. I design and build websites for small businesses, and I write here about what works.",
  authorPhotoSrc: ABOUT.photos.desk.src,
  readNextPost: "Read the next post",
}
