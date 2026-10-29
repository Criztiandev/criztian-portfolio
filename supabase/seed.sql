insert into public.cms_entries (collection, draft, published, published_at, updated_at)
values
  (
    'posts',
    jsonb_build_object(
      'title', 'Holiday sale is coming',
      'slug', 'holiday-sale-is-coming',
      'summary', 'Save the date for our biggest sale of the year.',
      'body', $$## Save the date

Our biggest sale of the year starts soon. Sign up below and we will tell you the day it opens.

- Up to **40% off** selected items
- Free delivery on every order$$,
      'publishDate', '2026-10-08',
      'visible', true
    ),
    null,
    null,
    '2026-10-08 09:00:00+00'
  ),
  (
    'posts',
    jsonb_build_object(
      'title', 'Our opening hours this holiday',
      'slug', 'our-opening-hours-this-holiday',
      'summary', $$When we're open, and how to reach us on holidays.$$,
      'body', $$We stay open through the holidays, with shorter days.

| Day | Hours |
| --- | --- |
| Weekdays | 9:00 to 18:00 |
| Weekends | 10:00 to 16:00 |

Closed on the holiday itself. Email us any time.$$,
      'publishDate', '2026-10-05',
      'visible', true
    ),
    jsonb_build_object(
      'title', 'Our opening hours this holiday',
      'slug', 'our-opening-hours-this-holiday',
      'summary', $$When we're open, and how to reach us on holidays.$$,
      'body', $$We stay open through the holidays, with shorter days.

| Day | Hours |
| --- | --- |
| Weekdays | 9:00 to 17:00 |
| Weekends | 10:00 to 14:00 |

Closed on the holiday itself. Email us any time.$$,
      'publishDate', '2026-10-05',
      'visible', true
    ),
    '2026-10-05 09:00:00+00',
    '2026-10-07 09:00:00+00'
  ),
  (
    'posts',
    null,
    jsonb_build_object(
      'title', 'Welcome to our new website',
      'slug', 'welcome-to-our-new-website',
      'summary', $$A quick look at what's new and where to find things.$$,
      'body', $$## What's new

The site is faster, easier to read on a phone, and has a blog.

## Where to find things

Use the menu at the top.$$,
      'publishDate', '2026-10-06',
      'visible', true
    ),
    '2026-10-06 09:00:00+00',
    '2026-10-06 09:00:00+00'
  ),
  (
    'posts',
    null,
    jsonb_build_object(
      'title', 'Meet the team',
      'slug', 'meet-the-team',
      'summary', 'The people behind the work.',
      'body', $$We are a small team that likes clear words and fast pages.

Say hello any time. We read every message.$$,
      'publishDate', '2026-10-02',
      'visible', true
    ),
    '2026-10-02 09:00:00+00',
    '2026-10-02 09:00:00+00'
  );
