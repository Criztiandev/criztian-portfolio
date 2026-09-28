import type {
  AboutSectionContent,
  ConnectSectionContent,
  FaqSectionContent,
  PageSectionHeading,
  PlaceholderSectionContent,
  StepSceneContent,
} from "@/types/page-sections.type"

export const OWNER_EMAIL_ADDRESS = "criztiandev@gmail.com"

export const OWNER_EMAIL_HREF = `mailto:${OWNER_EMAIL_ADDRESS}`

export const SERVICES_SCENE_SHAPES = "sphere"

export const ABOUT_SCENE_SHAPES = "sphere"

export const PROCESS_SCENE_SHAPES = "sphere"

export const STEP_NUMBER_DIGITS = 2

export const SCENE_FIT_BOX_SELECTOR = "[data-fit-box]"

export const SCENE_SLOT_ATTRIBUTE = "data-dot-slot"

export const SCENE_FIT_FLOW = "flow"

export const SCENE_FLOW_SHAPES = "dust"

export const SCENE_FIT_TOLERANCE_PX = 1

export const SCENE_ANCHOR_TOLERANCE_PX = 1

export const SECTION_FRAME_CLASS =
  "mx-auto max-w-[80rem] scroll-mt-18 px-6 md:px-10"

export const SECTION_HEADLINE_CLASS =
  "scroll-mt-18 font-display text-[clamp(1.75rem,1rem+3vw,3.5rem)] leading-[1.05] font-bold text-balance wrap-break-word text-foreground uppercase"

export const SECTION_TITLE_CLASS =
  "font-display text-[clamp(1.5rem,1rem+1.5vw,2.25rem)] leading-[1.05] font-bold uppercase"

export const SECTION_BODY_CLASS = "text-base text-foreground/75"

export const SECTION_LEDE_CLASS =
  "text-[0.8125rem] leading-[1.7] tracking-[0.05em] uppercase md:text-sm md:leading-relaxed md:tracking-[0.14em]"

export const SECTION_LABEL_CLASS = "text-xs tracking-[0.025em] uppercase"

export const FOCUS_RING_CLASS =
  "scroll-mt-18 outline-none focus-visible:ring-[3px] focus-visible:ring-foreground/50 focus-visible:outline-hidden"

export const DUST_SECTION_SPACING_CLASS =
  "pt-[max(6rem,14svh)] pb-[max(3rem,6svh)]"

export const SERVICES_SCENE: StepSceneContent = {
  id: "services",
  headingId: "services-heading",
  heading: "My services",
  sceneId: "services",
  shapes: SERVICES_SCENE_SHAPES,
  isNumbered: false,
  steps: [
    {
      title: "Branding",
      body: "I craft impactful brand stories that connect with your audience and build long-term trust. Through strategic thinking and visual storytelling, your brand gains clarity, consistency and character.",
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
      body: "My design approach blends creativity with functionality, with no AI slop. Every layout, interaction and element is thoughtfully created to deliver seamless user experiences that reflect your brand identity.",
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
      body: "From static sites to full CMS solutions, I develop high-performance, scalable websites tailored to your business needs, ensuring fast loading speeds, security and flexibility.",
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
  shapes: ABOUT_SCENE_SHAPES,
  intro: "I am Criztian.",
  body: "I specialize in crafting custom web solutions, including branding, web design and development tailored to meet your business.",
  stats: [
    { value: "5+", label: "Years experience" },
    { value: "500+", label: "Projects done" },
    { value: "140", label: "Happy clients" },
  ],
}

export const PROCESS_SCENE: StepSceneContent = {
  id: "process",
  headingId: "process-heading",
  heading: "How I work",
  sceneId: "process",
  shapes: PROCESS_SCENE_SHAPES,
  isNumbered: true,
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
      body: "Using cutting-edge technologies, I develop and implement your project with precision and care.",
      items: [],
    },
    {
      title: "Delivering success",
      body: "After a seamless launch, I provide ongoing support and optimization to ensure long-term success.",
      items: [],
    },
  ],
}

export const CONNECT_SECTION: ConnectSectionContent = {
  id: "connect",
  headingId: "connect-heading",
  heading: "Let's connect",
  actionLabel: "Email me",
}

export const TESTIMONIAL_PLACEHOLDER = "Client quote to come"

export const TESTIMONIALS_SECTION: PlaceholderSectionContent = {
  id: "testimonials",
  headingId: "testimonials-heading",
  heading: "Testimonials that inspire confidence",
  placeholders: [
    TESTIMONIAL_PLACEHOLDER,
    TESTIMONIAL_PLACEHOLDER,
    TESTIMONIAL_PLACEHOLDER,
  ],
}

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

export const CONTACT_SECTION: PageSectionHeading = {
  id: "contact",
  headingId: "contact-heading",
  heading: "Let's start your project today",
}
