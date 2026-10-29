import type { ComponentProps } from "react"

function StrokeIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
      {...props}
    />
  )
}

export function IconArrowDown(props: ComponentProps<"svg">) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 5.33V18.67M17.83 12.83L12 18.67L6.17 12.83" />
    </StrokeIcon>
  )
}

export function IconArrowUpRight(props: ComponentProps<"svg">) {
  return (
    <StrokeIcon {...props}>
      <path d="M7 17L17 7M17 16V7H8" />
    </StrokeIcon>
  )
}

export function IconMenu(props: ComponentProps<"svg">) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 8H20M4 16H20" />
    </StrokeIcon>
  )
}

export function IconClose(props: ComponentProps<"svg">) {
  return (
    <StrokeIcon {...props}>
      <path d="M6 6L18 18M18 6L6 18" />
    </StrokeIcon>
  )
}

export function LogoMark(props: ComponentProps<"svg">) {
  return (
    <svg
      width="29"
      height="42"
      viewBox="0 0 29 42"
      aria-hidden="true"
      {...props}
    >
      <path
        className="fill-paper"
        d="M9.53125 38.3125C7.04427 38.3125 5.03906 37.5378 3.51562 35.9883C2.00521 34.4388 1.25 32.2708 1.25 29.4844V13.625C1.25 10.2917 1.90755 7.73958 3.22266 5.96875C4.55078 4.19792 6.70573 3.3125 9.6875 3.3125C11.3151 3.3125 12.7604 3.61198 14.0234 4.21094C15.2995 4.8099 16.3021 5.70833 17.0312 6.90625C17.7604 8.09115 18.125 9.58854 18.125 11.3984V17.3359H11.2891V12.2578C11.2891 11.2292 11.1589 10.5391 10.8984 10.1875C10.638 9.82292 10.2344 9.64062 9.6875 9.64062C9.04948 9.64062 8.61979 9.875 8.39844 10.3438C8.17708 10.7995 8.06641 11.4115 8.06641 12.1797V29.3867C8.06641 30.3372 8.20312 31.0078 8.47656 31.3984C8.76302 31.7891 9.16667 31.9844 9.6875 31.9844C10.2734 31.9844 10.6836 31.7435 10.918 31.2617C11.1654 30.7799 11.2891 30.1549 11.2891 29.3867V23.1953H18.2031V29.6992C18.2031 32.7201 17.4414 34.9141 15.918 36.2812C14.3945 37.6354 12.2656 38.3125 9.53125 38.3125Z"
      />
      <path
        className="fill-red"
        d="M20.2586 37.9805V32.1602H27.2508V37.9805H20.2586Z"
      />
    </svg>
  )
}
