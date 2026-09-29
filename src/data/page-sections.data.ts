import type {
  AboutSectionContent,
  ContactSectionContent,
  FaqSectionContent,
  PlaceholderSectionContent,
  ServicesSceneContent,
  StatementSize,
  StepSceneContent,
  TestimonialsSectionContent,
} from "@/types/page-sections.type"

export const OWNER_EMAIL_ADDRESS = "criztiandev@gmail.com"

export const OWNER_EMAIL_HREF = `mailto:${OWNER_EMAIL_ADDRESS}`

export const SERVICES_SCENE_SHAPES = "branding web-design development"

export const FRAME_SCENE_SHAPES = "frame"

export const CONTACT_SCENE_SHAPES = "gather"

export const PROCESS_SCENE_SHAPES =
  "listening planning visualising building delivery"

export const STEP_NUMBER_DIGITS = 2

export const SECTION_POSITION_DIGITS = 2

export const SECTION_LABEL_SEPARATOR = " · "

export const SECTION_POSITION_SEPARATOR = " / "

export const SCENE_FIT_BOX_SELECTOR = "[data-fit-box]"

export const SCENE_SLOT_ATTRIBUTE = "data-dot-slot"

export const SCENE_FIT_FLOW = "flow"

export const SCENE_FLOW_SHAPES = "dust"

export const SCENE_FIT_TOLERANCE_PX = 1

export const SCENE_MIN_SLOT_PX = 64

export const SCENE_ANCHOR_TOLERANCE_PX = 1

export const SECTION_FRAME_CLASS =
  "mx-auto w-full max-w-[105rem] scroll-mt-18 px-6 md:px-10"

export const SCREEN_INSET_CLASS =
  "[--screen-top:1.75rem] [--screen-bottom:1.5rem] split:[--screen-top:min(3.5rem,6svh)] split:[--screen-bottom:min(4rem,7svh)] short:[--screen-top:1rem] short:[--screen-bottom:1rem]"

export const SCREEN_CLASS =
  "flex flex-col pt-7 pb-6 split:grid split:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] split:grid-rows-[auto_1fr] split:gap-x-10 split:gap-y-4 split:pt-[min(3.5rem,6svh)] split:pb-[min(4rem,7svh)] short:pt-4 short:pb-4"

export const SCREEN_LABEL_CLASS = "split:col-start-1 split:row-start-1"

export const SCREEN_LABEL_BOX_CLASS = "h-4 whitespace-nowrap"

export const SCREEN_HEIGHT_CLASS = "min-h-[calc(100svh_-_4.5rem)]"

export const SCREEN_CENTRED_GROUP_CLASS =
  "my-auto flex flex-col pt-3 split:contents"

export const SCREEN_OBJECT_CLASS =
  "split:col-start-2 split:row-span-2 split:row-start-1 split:self-center split:justify-self-end"

export const SCREEN_COPY_CLASS =
  "@container split:col-start-1 split:row-start-2 split:self-center"

export const PINNED_FRAME_CLASS = "sticky top-18 min-h-[calc(100svh_-_4.5rem)]"

export const PIN_SPACER_CLASS =
  "h-[50svh] group-data-[status=unsupported]/stage:hidden"

export const SHORT_SCREEN_COPY_GAP_CLASS =
  "mt-10 split:mt-0 [@media(max-height:44rem)]:mt-6 [@media(max-height:44rem)]:split:mt-0"

export const SECTION_LABEL_CLASS =
  "scroll-mt-18 text-[0.6875rem] leading-4 font-normal tracking-[0.22em] text-muted-foreground uppercase md:text-xs"

export const STATEMENT_CLASS =
  "font-display font-bold text-balance wrap-break-word text-foreground uppercase"

export const STATEMENT_SIZE_CLASSES: Record<StatementSize, string> = {
  default:
    "text-[length:min(4.5rem,calc(19cqi_+_0.5rem),max(10svh,2.5rem))]/[0.95] split:text-[length:min(11rem,calc(26cqi_+_0.5rem),20svh)]/[0.95]",
  service:
    "text-[length:min(4.5rem,calc(19cqi_+_0.5rem),max(10svh,2.5rem))]/[0.95] split:text-[length:min(11rem,calc(23cqi_+_0.5rem),20svh)]/[0.95]",
  longWord:
    "text-[length:min(4.5rem,calc(16.5cqi_+_0.5rem),max(10svh,2.5rem))]/[0.95] split:text-[length:min(11rem,calc(16.5cqi_+_0.5rem),20svh)]/[0.95]",
  belief:
    "text-[length:min(3.25rem,calc(14cqi_+_0.5rem))]/[0.95] split:text-[length:min(8.5rem,calc(18cqi_+_0.5rem),16svh)]/[0.95]",
  client:
    "text-[length:min(4.25rem,calc(17cqi_+_0.25rem))]/[0.95] split:text-[length:min(7.5rem,calc(15.5cqi_+_0.5rem),14svh)]/[0.95]",
  contact:
    "text-[length:min(3.25rem,calc(14cqi_+_0.5rem))]/[0.95] split:text-[length:min(8rem,calc(16.5cqi_+_0.5rem),15svh)]/[0.95]",
  faq: "text-[length:min(6.875rem,calc(30cqi_+_0.5rem))]/[0.95] split:text-[length:min(15rem,calc(32cqi_+_0.5rem),28svh)]/[0.95]",
}

export const BODY_CLASS =
  "max-w-[40ch] text-[0.9375rem] leading-[1.55] text-foreground/75 md:text-lg md:leading-normal"

export const TITLE_CLASS =
  "font-display text-[length:clamp(2.75rem,2.47rem_+_1.14vw,3.5rem)] leading-[0.95] font-bold uppercase"

export const ITEM_CLASS =
  "text-[0.8125rem] leading-4 tracking-[0.08em] text-foreground/75 uppercase"

export const CUE_CLASS =
  "text-[0.6875rem] leading-4 tracking-[0.22em] text-muted-foreground uppercase"

export const PLATE_CLASS =
  "relative aspect-[10/7] max-h-[28svh] w-full shrink-0 split:max-h-none [@media(max-height:44rem)]:max-h-[18svh] [@media(max-height:44rem)]:split:max-h-none"

export const PROJECT_SCREEN_COLUMNS_CLASS =
  "split:grid-cols-[minmax(0,31fr)_minmax(0,35fr)]"

export const PROJECT_PLATE_CLASS =
  "mt-6 split:mt-0 split:w-[min(100%,calc((100svh_-_12rem)_*_10_/_7))]"

export const PROJECT_SCREEN_WINDOW_CLASS =
  "isolate -mx-6 overflow-clip px-6 forced-colors:bg-background split:mx-0 split:overflow-visible split:px-0 split:forced-colors:bg-transparent staged:forced-colors:bg-transparent"

export const PROJECT_PLATE_WINDOW_CLASS =
  "absolute -inset-6 -z-10 shadow-[0_0_0_100vmax_var(--background)] split:hidden staged:hidden"

export const PROJECT_CARD_CLASS =
  "relative h-[calc(100svh_-_4.5rem)] unpinned:h-auto [@media(scripting:none)]:h-auto"

export const PROJECT_TITLE_LINK_CLASS =
  "scroll-mt-18 outline-none decoration-[length:max(2px,0.04em)] underline-offset-[0.12em] after:absolute after:inset-[3px] hover:underline focus-visible:after:ring-[3px] focus-visible:after:ring-foreground/50 focus-visible:after:outline-2 focus-visible:after:outline-transparent split:after:inset-0 staged:after:inset-[3px]"

export const ABOUT_PLATE_CLASS =
  "split:aspect-[4/5] split:w-[min(80%,calc((100svh_-_12rem)_*_0.8))]"

export const TESTIMONIAL_PLATE_CLASS =
  "split:aspect-square split:w-[min(73%,calc(100svh_-_12rem))]"

export const PLATE_CHIP_CLASS = "absolute top-4 left-4 bg-background px-2 py-1"

export const PLATE_SLOT_CLASS =
  "absolute inset-0 touch-pan-y touch-pinch-zoom group-data-[status=unsupported]/stage:hidden"

export const SECTION_HEADLINE_CLASS =
  "scroll-mt-18 font-display text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.05] font-bold text-balance wrap-break-word text-foreground uppercase"

export const FOCUS_RING_CLASS =
  "scroll-mt-18 outline-none focus-visible:ring-[3px] focus-visible:ring-foreground/50 focus-visible:outline-hidden"

export const ORBIT_CIRCLE_CLASS =
  "fill-none stroke-current [stroke-dasharray:0_10px] [stroke-linecap:round] [stroke-width:3px] [cx:50%] [cy:calc(var(--orbit-radius)_+_6px)] [r:var(--orbit-radius)] staged:orbit-spin"

export const DUST_SECTION_SPACING_CLASS =
  "pt-[max(6rem,14svh)] pb-[max(3rem,6svh)]"

export const SERVICES_SCENE: ServicesSceneContent = {
  id: "services",
  headingId: "services-heading",
  heading: "My services",
  sceneId: "services",
  shapes: SERVICES_SCENE_SHAPES,
  steps: [
    {
      title: "Branding",
      size: "service",
      body: "Brand stories that connect with your audience and build long-term trust.",
      items: [
        "Visual content strategy",
        "Research and testing",
        "Competitive analysis",
        "UI/UX strategy",
        "Key messaging",
        "Content strategy",
      ],
    },
    {
      title: "Web design",
      size: "service",
      body: "Creative and functional, with no AI slop. Every layout and interaction is made for your brand.",
      items: [
        "Responsive design",
        "Wireframing and prototyping",
        "Design systems and guidelines",
        "Accessibility compliance",
        "Motion and interaction design",
        "Conversion-focused layout",
      ],
    },
    {
      title: "Development",
      size: "longWord",
      body: "High-performance, scalable websites tailored to your business.",
      items: [
        "Web development",
        "SEO-friendly structure",
        "CMS and dynamic content",
        "Custom code extensions",
        "Performance optimization",
        "API integration",
      ],
    },
  ],
}

export const ABOUT_SECTION: AboutSectionContent = {
  id: "about",
  headingId: "about-heading",
  heading: "Who am I",
  sceneId: "about",
  shapes: FRAME_SCENE_SHAPES,
  statement: "I am Criztian.",
  body: "Branding, web design and development, made for your business.",
  story: "[Your story, in your own words]",
  stats: [
    { value: "5+", label: "Years experience" },
    { value: "500+", label: "Projects done" },
    { value: "140", label: "Happy clients" },
  ],
  plate: {
    src: "/about/placeholder.webp",
    label: "[Your photo]",
  },
}

export const PROCESS_SCENE: StepSceneContent = {
  id: "process",
  headingId: "process-heading",
  heading: "How I work",
  sceneId: "process",
  shapes: PROCESS_SCENE_SHAPES,
  steps: [
    {
      title: "Listening to your vision",
      body: "I begin by discussing your goals, audience and expectations to ensure my approach aligns perfectly with your vision.",
      items: [],
    },
    {
      title: "Planning with purpose",
      body: "I analyze trends, competitors and opportunities to craft a strategic roadmap tailored to your needs.",
      items: [],
    },
    {
      title: "Visualizing your ideas",
      body: "Creative concepts come to life as I design user-friendly and visually appealing solutions.",
      items: [],
    },
    {
      title: "Bringing it to life",
      body: "I build your project with precision and care.",
      items: [],
    },
    {
      title: "Delivering success",
      body: "I launch it, then keep supporting and improving it.",
      items: [],
    },
  ],
}

export const TESTIMONIALS_SECTION: TestimonialsSectionContent = {
  id: "testimonials",
  headingId: "testimonials-heading",
  heading: "Testimonials",
  sceneId: "testimonials",
  shapes: FRAME_SCENE_SHAPES,
  items: [
    {
      quote: "[A client's words, with their permission]",
      attribution: "[Client name] · [Role, company]",
    },
  ],
  plate: {
    src: "/testimonials/placeholder.webp",
    label: "[Client photo or logo]",
  },
}

export const TESTIMONIAL_OPEN_QUOTE = "“"

export const TESTIMONIAL_CLOSE_QUOTE = "”"

export const FAQ_SECTION: FaqSectionContent = {
  id: "faq",
  headingId: "faq-heading",
  heading: "FAQ",
  items: [
    {
      question: "What is included in your branding services?",
      answer:
        "My branding services include logo design, visual identity development, color palette selection, typography guidance and brand messaging to create a cohesive and impactful identity for your business.",
    },
    {
      question: "How long does it take to complete a branding project?",
      answer:
        "The timeline varies depending on the scope, but a typical branding project takes 4–6 weeks from initial consultation to final delivery.",
    },
    {
      question: "Do you offer mobile-friendly designs?",
      answer:
        "Yes. All my web designs are fully responsive and optimized for desktops, tablets and mobile devices to ensure a seamless user experience.",
    },
    {
      question: "Can you redesign an existing website?",
      answer:
        "Absolutely. I can revamp your current website to improve its functionality, aesthetics and performance while retaining key elements of your brand.",
    },
    {
      question: "Do you provide custom development solutions?",
      answer:
        "Yes. I specialize in creating custom web solutions tailored to your specific business needs, including e-commerce platforms, CMS integrations and more.",
    },
    {
      question: "Will I be able to update the website on my own?",
      answer:
        "Yes. I build websites on user-friendly platforms like Webflow or WordPress, so you can manage and update your site without technical expertise.",
    },
    {
      question: "How do you approach digital marketing campaigns?",
      answer:
        "I start with a deep understanding of your audience and goals, then craft data-driven strategies that include SEO, social media marketing and email campaigns.",
    },
    {
      question: "What are the payment methods and plans for a project?",
      answer:
        "I accept multiple payment methods, mostly PayPal, and can set up flexible payment plans based on the project's scale.",
    },
    {
      question: "Do you offer discounts for long-term collaboration?",
      answer:
        "Yes. I offer preferential pricing for clients in long-term collaborations. Contact me for details.",
    },
  ],
}

export const BLOG_PLACEHOLDER = "Post to come"

export const BLOG_SECTION: PlaceholderSectionContent = {
  id: "blog",
  headingId: "blog-heading",
  heading: "Stay ahead with the latest in digital marketing",
  placeholders: [BLOG_PLACEHOLDER, BLOG_PLACEHOLDER, BLOG_PLACEHOLDER],
}

export const CONTACT_SECTION: ContactSectionContent = {
  id: "contact",
  headingId: "contact-heading",
  heading: "Get in touch",
  sceneId: "contact",
  shapes: CONTACT_SCENE_SHAPES,
  statement: "Let's start your project today.",
  emailPrompt: "Or email me:",
}
