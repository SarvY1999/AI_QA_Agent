import { test, expect } from '../fixtures';

test('events page loads with correct heading and description', async ({ eventsPage }) => {
  await eventsPage.goto();

  await expect(eventsPage.heading).toBeVisible();
  await expect(eventsPage.description).toBeVisible();
});

test('event cards are visible with titles', async ({ eventsPage }) => {
  await eventsPage.goto();

  await expect(eventsPage.getEventCard('Colors of India – Cultural Night')).toBeVisible();
  await expect(eventsPage.getEventCard('Jaipur Literature Festival')).toBeVisible();
  await expect(eventsPage.getEventCard('Yoga & Meditation Festival')).toBeVisible();
});

test('each event card has Learn More and Book Now buttons', async ({ eventsPage }) => {
  await eventsPage.goto();

  await expect(eventsPage.learnMoreButtons).toHaveCount(3);
  await expect(eventsPage.bookNowButtons).toHaveCount(3);
});
