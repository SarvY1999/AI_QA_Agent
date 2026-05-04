import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly subHeading: Locator;
  readonly exploreButton: Locator;
  readonly learnMoreButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly logoLink: Locator;
  readonly nav: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Welcome to CityPulse', level: 1 });
    this.subHeading = page.getByRole('heading', { name: 'Feel the Rhythm of Urban Life', level: 2 });
    this.exploreButton = page.getByRole('button', { name: 'Explore Your City' });
    this.learnMoreButton = page.getByRole('button', { name: 'Learn more' });
    this.searchInput = page.getByPlaceholder('Search by location, tour name, or destination...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.logoLink = page.getByRole('banner').getByRole('link', { name: 'CityPulse' });
    this.nav = page.getByRole('navigation');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickNavLink(name: string) {
    await this.nav.getByRole('link', { name }).click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  searchResultsHeading(query: string) {
    return this.page.getByRole('heading', { name: `Search Results for "${query}"`, level: 2 });
  }

  get noResultsHeading() {
    return this.page.getByRole('heading', { name: 'No results found', level: 3 });
  }

  get clearSearchButton() {
    return this.page.getByRole('button', { name: 'Clear Search' });
  }
}
