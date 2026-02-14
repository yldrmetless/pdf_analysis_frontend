import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Uygulamanın gerçek başlığı olan "DocuMind AI" değerini kontrol ediyoruz.
    await expect(page).toHaveTitle(/DocuMind AI/);
});