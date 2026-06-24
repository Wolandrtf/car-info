# car-info

Веб-интерфейс истории обслуживания автомобиля на React + Vite + TypeScript + Tailwind.

## Возможности

- Таймлайн визитов в СТО (группировка чеков и заказ-нарядов по дате)
- История запчастей по категориям
- Статистика по организациям
- Анализ интервалов замены относительно норм по пробегу
- Сводка расходов и пробега

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## GitHub Pages

Приложение публикуется автоматически при пуше в `main`.

Сайт: https://wolandrtf.github.io/car-info/

Локальная проверка сборки для Pages:

```bash
GITHUB_PAGES=true npm run build && npm run preview
```

Требуется Node.js 24+.

## Данные

История обслуживания хранится в `src/data/src.json`.
