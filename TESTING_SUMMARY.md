# 🧪 Тестування функціональності: Валідація Stock Перед Додаванням

## 📋 Статус: ✅ ТЕСТИ СТВОРЕНІ І ГОТОВІ

---

## 🎯 Мета

Протестувати функціональність валідації stock перед додаванням товарів до кошика, щоб запобігти ситуаціям, коли користувач може додати більше товарів, ніж є в наявності.

---

## ✅ Acceptance Criteria - Результат Тестування

| Критерій                                | Статус     | Тести          | Деталі                                     |
| --------------------------------------- | ---------- | -------------- | ------------------------------------------ |
| ✅ **Не можна додати більше ніж stock** | ✅ Покрито | #1, #3, #4, #6 | Quantity не перевищує доступну кількість   |
| ✅ **Показується повідомлення**         | ✅ Покрито | #2, #6, #7     | Error/warning повідомлення при перевищенні |
| ✅ **UI не ламається**                  | ✅ Покрито | #7             | Сторінка залишається функціональною        |
| ✅ **Працює в cart**                    | ✅ Покрито | #4, #5         | Валідація в кошику при оновленні quantity  |
| ✅ **Працює на product page**           | ✅ Покрито | #1, #2, #3     | Валідація на сторінці товару               |

---

## 📊 Тестові Сценарії

### Сценарій 1: Cannot increment quantity beyond available stock on product page

- **Теги**: `@critical` `@stock` `@product-detail`
- **Статус**: ✅ Скомпільований
- **Опис**: Користувач не може збільшити кількість понад доступний stock
- **Кроки**:
  1. Перейти на сторінку товару
  2. Перевірити доступний stock
  3. Спробувати збільшити quantity > stock
  4. Верифікувати: quantity не перевищує stock, UI функціональний

---

### Сценарій 2: Add to cart button is disabled when out of stock

- **Теги**: `@critical` `@stock` `@product-detail`
- **Статус**: ✅ Скомпільований
- **Опис**: Кнопка "Add to Cart" вимкнена коли товар недоступний
- **Кроки**:
  1. Перейти на товар з нульовим stock
  2. Перевірити, що кнопка вимкнена
  3. Верифікувати: з'являється "out of stock" повідомлення

---

### Сценарій 3: Can add product with exact stock quantity on product page

- **Теги**: `@critical` `@stock` `@product-detail`
- **Статус**: ✅ Скомпільований
- **Опис**: Користувач може додати товар з максимальною кількістю
- **Кроки**:
  1. Перейти на товар
  2. Встановити quantity = доступному stock
  3. Клікнути "Add to Cart"
  4. Верифікувати: товар додався в кошик

---

### Сценарій 4: Cannot update cart quantity beyond available stock

- **Теги**: `@stock` `@cart` `@product-detail`
- **Статус**: ✅ Скомпільований
- **Опис**: Неможливо оновити quantity > stock в кошику
- **Кроки**:
  1. Авторизуватися → Додати товар
  2. Перейти в кошик
  3. Спробувати збільшити quantity > stock
  4. Верифікувати: quantity обмежена, показується помилка

---

### Сценарій 5: Update cart to maximum available quantity succeeds

- **Теги**: `@stock` `@cart` `@product-detail`
- **Статус**: ✅ Скомпільований
- **Опис**: Можна оновити quantity до максимуму
- **Кроки**:
  1. Авторизуватися → Додати товар
  2. Перейти в кошик
  3. Встановити quantity = max available
  4. Верифікувати: успішно оновлено

---

### Сценарій 6: Error message is displayed when exceeding stock

- **Теги**: `@regression` `@stock` `@product-detail`
- **Статус**: ✅ Скомпільований
- **Опис**: Помилка показується при перевищенні stock
- **Кроки**:
  1. Перейти на товар
  2. Спробувати додати > stock
  3. Верифікувати: "insufficient stock" помилка

---

### Сценарій 7: UI remains functional after stock validation error

- **Теги**: `@regression` `@stock` `@product-detail`
- **Статус**: ✅ Скомпільований
- **Опис**: UI залишається функціональним після помилки
- **Кроки**:
  1. Перейти на товар
  2. Спробувати перевищити stock
  3. Верифікувати: можна навігувати, взаємодіяти, сторінка не ламається

---

## 🔍 Перевірені Компоненти

### ✅ Тестова Архітектура

- **ProductPage** (`page-objects/product-page.ts`)
  - `quantityInput` - input для введення quantity
  - `addToCartButton` - кнопка додавання
  - `isAddToCartDisabled()` - перевірка disabled state
  - `lowStockMessage` - локатор повідомлення про stock

- **CartPage** (`page-objects/cart-page.ts`)
  - Методи обновлення quantity
  - Вірифікація ліміту quantity

- **ProductWebAdapter** (`adapters/product.web.adapter.ts`)
  - `incrementProductQuantity()` - збільшити quantity
  - `decrementProductQuantity()` - зменшити quantity
  - `getProductQuantity()` - отримати поточну quantity
  - `isProductAddToCartDisabled()` - перевірка disabled state

- **CartWebAdapter** (`adapters/cart.web.adapter.ts`)
  - `updateQuantity(quantity)` - оновити quantity
  - `setQuantity(quantity)` - встановити quantity

### ❓ Потрібно Перевірити (Backend/API)

- Stock інформація з API (`GET /api/products/{id}/`)
- Валідація на бекенді при додаванні в кошик
- Error responses коли quantity > stock

---

## 📁 Створені Файли

```
✅ features/product/stock-validation.feature
   └─ 7 BDD сценаріїв з повним описом

✅ steps/stock-validation.steps.ts
   └─ Step definitions для всіх сценаріїв

✅ .features-gen/features/product/stock-validation.feature.spec.js
   └─ Автогенерована Playwright spec (kompiled)
```

---

## 🚀 Як Запустити Тести

### 1️⃣ Встановити залежності

```bash
npm install
```

### 2️⃣ Запустити тестовий сервер

```bash
npm run docker:up
# або запустити локально на http://localhost:3001
```

### 3️⃣ Запустити тести

```bash
# Всі stock validation тести
npm run test:run -- --grep "@stock-validation"

# Тільки critical
npm run test:run -- --grep "@critical @stock"

# З UI
npm run test:ui
```

### 4️⃣ Переглянути звіт

```bash
npm run report:html
```

---

## 📈 Метрики Тестування

| Метрика                     | Значення   |
| --------------------------- | ---------- |
| Всього тестів               | 7          |
| Critical тести              | 3          |
| Regression тести            | 2          |
| Cart тести                  | 2          |
| Product page тести          | 5          |
| Acceptance criteria покрито | 5/5 (100%) |
| Готовність до запуску       | ✅ 100%    |

---

## 📝 Приклад Скрипту для CI/CD

```yaml
test-stock-validation:
  image: mcr.microsoft.com/playwright:v1.56.1-noble
  services:
    - postgres
    - redis
  script:
    - npm install
    - npm run test:generate
    - npm run test:run -- --grep "@stock-validation"
  artifacts:
    when: always
    paths:
      - test-results/
      - playwright-report/
  report:
    junit: test-results/junit.xml
```

---

## ✨ Результат

### ✅ Зроблено:

1. Створено 7 комплексних BDD тестів
2. Покрито 100% Acceptance Criteria
3. Тести включають critical, regression, та cart scenarios
4. Повна інтеграція з Playwright BDD фреймворком
5. Готово до запуску при готовності сервера

### 🎯 Наступні кроки:

1. Запустити тестовий сервер (docker або локально)
2. Виконати `npm run test:run -- --grep "@stock-validation"`
3. Аналізувати результати та знаходити баги
4. Усунути знайдені помилки в реалізації
5. Запустити тести повторно для верифікації

---

## 🔗 Відповідні файли

- [Feature file](./features/product/stock-validation.feature)
- [Step definitions](./steps/stock-validation.steps.ts)
- [Product page](./page-objects/product-page.ts)
- [Cart page](./page-objects/cart-page.ts)
