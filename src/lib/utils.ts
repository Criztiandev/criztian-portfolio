import { createCn } from "cn/config"

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-giant-phone",
            "display-giant-tablet",
            "display-giant-desktop",
            "display-xl",
            "display-l",
            "heading-h1",
            "heading-h2",
            "body-large",
            "body-base",
            "body-small",
            "label",
            "button",
          ],
        },
      ],
    },
  },
})
