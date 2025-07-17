import { by,device, element, expect } from 'detox';

describe('LoginScreen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should show email and password fields and login button', async () => {
    await expect(element(by.id('email'))).toBeVisible();
    await expect(element(by.id('password'))).toBeVisible();
    await expect(element(by.id('submit'))).toBeVisible();
    await expect(element(by.id('skip'))).toBeVisible();
  });

  it('should allow entering credentials and tapping login', async () => {
    await element(by.id('email')).typeText('test@example.com');
    await element(by.id('password')).typeText('password123');
    await element(by.id('password')).tapReturnKey();

    await expect(element(by.id('skip'))).toBeVisible();
    const skipButton = element(by.id('skip'));
    await skipButton.tap();
  });
});
