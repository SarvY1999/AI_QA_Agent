import { Page, Locator } from '@playwright/test';

export class ToursPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly learnMoreButtons: Locator;
  readonly bookButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Discover Amazing Tours', level: 1 });
    this.learnMoreButtons = page.getByRole('button', { name: 'Learn More' });
    this.bookButtons = page.getByRole('button', { name: /Book/i });
  }

  async goto() {
    await this.page.goto('/tours');
  }

  getTourCard(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 3 });
  }
}
