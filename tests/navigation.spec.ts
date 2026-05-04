import { test, expect } from '../fixtures';

test('navbar links are present', async ({ homePage }) => {
  await homePage.goto();

  await expect(homePage.nav.getByRole('link', { name: 'Events' })).toBeVisible();
  await expect(homePage.nav.getByRole('link', { name: 'Hotels' })).toBeVisible();
  await expect(homePage.nav.getByRole('link', { name: 'Restaurants' })).toBeVisible();
  await expect(homePage.nav.getByRole('link', { name: 'Tours' })).toBeVisible();
});

test('Tours nav link navigates to tours page', async ({ page, homePage, toursPage }) => {
  await homePage.goto();
  await homePage.clickNavLink('Tours');

  await expect(page).toHaveURL('/tours');
  await expect(toursPage.heading).toBeVisible();
});

test('Events nav link navigates to events page', async ({ page, homePage, eventsPage }) => {
  await homePage.goto();
  await homePage.clickNavLink('Events');

  await expect(page).toHaveURL('/events');
  await expect(eventsPage.heading).toBeVisible();
});

test('CityPulse logo navigates back to homepage', async ({ page, homePage, toursPage }) => {
  await toursPage.goto();
  await homePage.logoLink.click();

  await expect(page).toHaveURL('/');
  await expect(homePage.heading).toBeVisible();
});
