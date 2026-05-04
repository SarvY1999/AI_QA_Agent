import { test, expect } from '../fixtures';

test('has title', async ({ page, homePage }) => {
  await homePage.goto();

  await expect(page).toHaveTitle('CityPulse');
});

test('get started link', async ({ page, homePage }) => {
  await homePage.goto();

  await expect(page.getByRole('heading', { name: 'Welcome to CityPulse' })).toBeVisible();
});
