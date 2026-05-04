import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';
import { ToursPage } from '../pages/ToursPage';

type Fixtures = {
  homePage: HomePage;
  eventsPage: EventsPage;
  toursPage: ToursPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  eventsPage: async ({ page }, use) => {
    await use(new EventsPage(page));
  },
  toursPage: async ({ page }, use) => {
    await use(new ToursPage(page));
  },
});

export { expect } from '@playwright/test';
