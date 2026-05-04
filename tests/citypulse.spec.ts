import { test, expect } from '../fixtures';

test('page loads and key content is visible', async ({ page, homePage}) => {
  await homePage.goto();

  await expect(page).toHaveTitle('CityPulse');
  await expect(homePage.heading).toBeVisible();
  await expect(homePage.subHeading).toBeVisible();
  await expect(homePage.exploreButton).toBeVisible();
  await expect(homePage.learnMoreButton).toBeVisible();
  await expect(homePage.searchInput).toBeVisible();
});