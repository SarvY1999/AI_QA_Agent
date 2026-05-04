import { Page, Locator } from '@playwright/test';

export class EventsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly description: Locator;
  readonly learnMoreButtons: Locator;
  readonly bookNowButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Experience Unforgettable Events', level: 1 });
    this.description = page.getByText('Join the most exciting cultural, music, and community events');
    this.learnMoreButtons = page.getByRole('button', { name: 'Learn More' });
    this.bookNowButtons = page.getByRole('button', { name: 'Book Now' });
  }

  async goto() {
    await this.page.goto('/events');
  }

  getEventCard(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 3 });
  }

  async clickBookNow(index = 0) {
    await this.bookNowButtons.nth(index).click();
  }

  async clickLearnMore(index = 0) {
    await this.learnMoreButtons.nth(index).click();
  }

  get bookingModal() {
    return this.page.getByRole('heading', { name: 'Book an Event', level: 2 });
  }

  get bookingNameInput() {
    return this.page.getByPlaceholder('Enter your full name');
  }

  get bookingEmailInput() {
    return this.page.getByPlaceholder('Enter your email address');
  }

  get bookingPhoneInput() {
    return this.page.getByPlaceholder('Enter your phone number');
  }

  get confirmBookingButton() {
    return this.page.getByRole('button', { name: 'Confirm Booking' });
  }

  get closeBookingModal() {
    return this.page.getByRole('button', { name: 'Close booking modal' });
  }

  get detailModal() {
    return this.page.getByRole('heading', { name: 'About This Experience', level: 3 });
  }

  get closeDetailModal() {
    return this.page.getByRole('button', { name: 'Close modal' });
  }
}
