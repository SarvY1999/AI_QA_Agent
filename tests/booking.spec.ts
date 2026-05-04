import { test, expect } from '../fixtures';

test('clicking Book Now opens the booking modal', async ({ eventsPage }) => {
  await eventsPage.goto();

  await eventsPage.clickBookNow(0);

  await expect(eventsPage.bookingModal).toBeVisible();
  await expect(eventsPage.bookingNameInput).toBeVisible();
  await expect(eventsPage.bookingEmailInput).toBeVisible();
  await expect(eventsPage.bookingPhoneInput).toBeVisible();
  await expect(eventsPage.confirmBookingButton).toBeVisible();
});

test('booking modal closes when Cancel is clicked', async ({ eventsPage }) => {
  await eventsPage.goto();

  await eventsPage.clickBookNow(0);
  await expect(eventsPage.bookingModal).toBeVisible();

  await eventsPage.page.getByRole('button', { name: 'Cancel' }).click();

  await expect(eventsPage.bookingModal).not.toBeVisible();
});

test('clicking Learn More opens the event detail modal', async ({ eventsPage }) => {
  await eventsPage.goto();

  await eventsPage.clickLearnMore(0);

  await expect(eventsPage.detailModal).toBeVisible();
  await expect(eventsPage.page.getByRole('heading', { name: 'Colors of India – Cultural Night', level: 1 })).toBeVisible();
  await expect(eventsPage.page.getByRole('button', { name: 'Book Now' }).last()).toBeVisible();
});

test('event detail modal closes when Close modal is clicked', async ({ eventsPage }) => {
  await eventsPage.goto();

  await eventsPage.clickLearnMore(0);
  await expect(eventsPage.detailModal).toBeVisible();

  await eventsPage.closeDetailModal.click();

  await expect(eventsPage.detailModal).not.toBeVisible();
});
