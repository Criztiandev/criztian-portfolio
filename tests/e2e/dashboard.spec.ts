import { expect, test } from "@playwright/test"

import { DASHBOARD_PATH, LOGIN_PATH } from "@/data/auth.data"

test("sends a logged-out visitor from the dashboard to the login page", async ({
  page,
}) => {
  await page.goto(DASHBOARD_PATH)

  await expect(page).toHaveURL(function isLoginWithReturnPath(url: URL) {
    return (
      url.pathname === LOGIN_PATH &&
      url.searchParams.get("next") === DASHBOARD_PATH
    )
  })

  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
})
