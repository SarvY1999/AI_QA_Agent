import { test, expect } from '../fixtures';

test('searching for a valid location returns results', async ({ homePage }) => {
  await homePage.goto();

  await homePage.search('Varanasi');

  await expect(homePage.searchResultsHeading('Varanasi')).toBeVisible();
  await expect(homePage.page.getByText('Found 1 result(s)')).toBeVisible();
  await expect(homePage.page.getByRole('heading', { name: 'Evening Ganga Aarti Boat Ride', level: 3 })).toBeVisible();
});

test('searching for a nonexistent term shows no results message', async ({ homePage }) => {
  await homePage.goto();

  await homePage.search('xyznonexistent');

  await expect(homePage.searchResultsHeading('xyznonexistent')).toBeVisible();
  await expect(homePage.noResultsHeading).toBeVisible();
  await expect(homePage.page.getByText('Try searching with different keywords')).toBeVisible();
});

test('clearing search removes results and restores the page', async ({ homePage }) => {
  await homePage.goto();

  await homePage.search('Varanasi');
  await expect(homePage.searchResultsHeading('Varanasi')).toBeVisible();

  await homePage.clearSearchButton.click();

  await expect(homePage.searchResultsHeading('Varanasi')).not.toBeVisible();
  await expect(homePage.heading).toBeVisible();
});
