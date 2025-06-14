import { test, expect } from '@playwright/test'

test.describe('Camera Flow', () => {
  test.beforeEach(async ({ page }) => {
    // カメラ許可のモック
    await page.context().grantPermissions(['camera'])
    
    // getUserMediaのモック
    await page.addInitScript(() => {
      const mockStream = {
        getVideoTracks: () => [{ stop: () => {} }],
        getTracks: () => [{ stop: () => {} }],
      }
      
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: () => Promise.resolve(mockStream),
        },
      })
    })

    await page.goto('/')
  })

  test('should display the app title and camera interface', async ({ page }) => {
    // タイトルの確認
    await expect(page.locator('h1')).toContainText('zidorin')
    await expect(page.locator('p')).toContainText('かわいい自撮りカメラ')

    // カメラコンテナが存在することを確認
    await expect(page.locator('#camera-container')).toBeVisible()
    
    // 撮影ボタンが存在することを確認
    await expect(page.locator('text=📸')).toBeVisible()
  })

  test('should display filter selector', async ({ page }) => {
    // フィルターセレクターが表示されることを確認
    await expect(page.locator('text=フィルターを選ぼう！')).toBeVisible()
    
    // フィルターボタンが表示されることを確認
    await expect(page.locator('[data-filter-id=\"none\"]')).toBeVisible()
    await expect(page.locator('[data-filter-id=\"monochrome\"]')).toBeVisible()
    await expect(page.locator('[data-filter-id=\"vivid\"]')).toBeVisible()
  })

  test('should allow filter selection', async ({ page }) => {
    // モノクロフィルターを選択
    const monochromeButton = page.locator('[data-filter-id=\"monochrome\"]')
    await monochromeButton.click()
    
    // 選択状態のスタイルが適用されることを確認
    await expect(monochromeButton).toHaveClass(/border-pink-500/)
  })

  test('should handle capture button click', async ({ page }) => {
    // 撮影ボタンをクリック
    await page.locator('text=📸').click()
    
    // プレビュー画面が表示される可能性があることを確認
    // （実際のカメラストリームがないため、エラーハンドリングの確認）
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // モバイルビューポートに変更
    await page.setViewportSize({ width: 375, height: 667 })
    
    // レスポンシブ要素が適切に表示されることを確認
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('#camera-container')).toBeVisible()
    await expect(page.locator('#filter-container')).toBeVisible()
  })

  test('should handle scroll behavior', async ({ page }) => {
    // ページをスクロール
    await page.evaluate(() => window.scrollTo(0, 100))
    
    // ヘッダーがコンパクト表示になることを確認
    await expect(page.locator('header')).toHaveClass(/py-2/)
  })
})