# Сайт "Пиротска 123" — техническа документация

Статичен сайт за жилищна сграда Пиротска 123 в София. Изграден с HTML, CSS и vanilla JavaScript — без build система, без зависимости, без backend.

## Структура на проекта

```
site/
├── index.html              ← Начална страница
├── apartments.html         ← Списък с апартаменти + филтри + модал
├── floors.html             ← Архитектурни планове на етажите
├── parking.html            ← Гаражи, паркоместа, търговски обекти
├── gallery.html            ← Галерия с 3D рендери и планове
├── location.html           ← Локация, район, Google Maps
├── about.html              ← За инвеститора (placeholder)
├── contact.html            ← Контактна форма
├── README.md               ← Този файл
│
├── css/
│   └── style.css           ← Всички стилове
│
├── js/
│   ├── common.js           ← Навигация, помощни функции
│   └── apartments.js       ← Логика за филтри и модал
│
├── data/
│   ├── apartments.json     ← БАЗА ДАННИ — апартаменти, гаражи, паркоместа
│   └── projects.json       ← Реализирани обекти на инвеститора (за about.html)
│
├── assets/
│   ├── render-corner.jpg       ← 3D ъглов изглед
│   ├── render-corner-thumb.jpg ← миниатюра
│   ├── render-front.jpg        ← 3D фронтален изглед
│   ├── render-front-thumb.jpg  ← миниатюра
│   ├── parter.jpg              ← схема на партера
│   └── suteren.jpg             ← схема на сутерена
│
├── projects/                   ← Снимки от реализирани обекти
│   ├── img/                    ← голям размер (макс 1400px)
│   └── thumbs/                 ← миниатюри (макс 600px)
│
└── floors/
    ├── img/                ← JPG превюта на чертежите
    │   ├── floor-1-parter.jpg
    │   ├── floor-2.jpg ... floor-7.jpg
    │   └── *-thumb.jpg
    └── pdf/                ← Оригинални PDF чертежи
        ├── floor-1-parter.pdf
        └── floor-2.pdf ... floor-7.pdf
```

## Как да обновяваш данните

### Промяна на статус (Свободен / Резервиран / Продаден)

Отвори файла `data/apartments.json` в текстов редактор (Notepad++, VS Code или дори Notepad). Намери реда на апартамента и промени `"status"`:

```json
{"id": "A5", ..., "status": "available", "price": null}   ← беше свободен
{"id": "A5", ..., "status": "sold", "price": 250000}       ← стана продаден
```

Възможни стойности за `status`:
- `available` → Свободен
- `reserved` → Резервиран
- `sold` → Продаден

### Добавяне на цени

Промени `"price": null` на `"price": 250000` (число, без кавички, в лева).

### Добавяне на бележка

Попълни `"notes": "С тераса 12 м²"` или каквото е подходящо.

### Цялостен пример

```json
{
  "id": "A10",
  "type": "апартамент",
  "number": 10,
  "floor": 3,
  "area_net": 105.00,
  "area_total": 117.97,
  "status": "reserved",
  "price": 285000,
  "notes": "Двустранно изложение, тераса"
}
```

> **Внимание:** JSON е чувствителен към запетаи и кавички. Ако след редакция сайтът покаже грешка, провери:
> - Има ли запетая след всеки елемент (освен последния в обект/масив)
> - Всички текстови стойности са в двойни кавички `"..."`
> - Числата са без кавички
>
> Можеш да валидираш JSON-а на: https://jsonlint.com

### Връзка между Excel/Google Sheets и JSON

Препоръчителен работен процес:
1. Поддържай Google Sheet с колоните: id, type, number, floor, area_net, area_total, status, price, notes
2. Когато правиш промени, експортирай като CSV
3. Конвертирай CSV → JSON онлайн (например: csvjson.com)
4. Замени `data/apartments.json`

## Какво трябва да добавиш по-късно

Във файловете има placeholder-и, маркирани с `[предстои]` или `[Място за текст: ...]`:

| Какво | Къде |
|---|---|
| Лого | Замени брандинга `Пиротска 123` в navbar и footer на всички страници |
| Телефон, email | `index.html`, `apartments.html`, `floors.html`, `parking.html`, `gallery.html`, `location.html`, `about.html`, `contact.html` (търси `[предстои]`) |
| Информация за инвеститора | `about.html` (търси `[Място за текст: ...]`) |
| Цени и статуси | `data/apartments.json` |
| Снимки от строежа | `gallery.html` — добави нови `gallery-item` блокове |
| Работещ контактен формуляр | `contact.html` — препоръчвам [Formspree](https://formspree.io) или [Web3Forms](https://web3forms.com) |

## Как да добавиш нов реализиран проект

Структура на `data/projects.json`:

```json
{
  "projects": [
    {
      "id": "unique_slug",
      "city": "София",
      "address": "ул. Пример 15",
      "fullName": "София, ул. Пример 15",
      "images": [
        { "src": "projects/img/primer_1.jpg", "thumb": "projects/thumbs/primer_1_thumb.jpg" },
        { "src": "projects/img/primer_2.jpg", "thumb": "projects/thumbs/primer_2_thumb.jpg" }
      ]
    }
  ]
}
```

**За добавяне:**
1. Качи снимките в `projects/img/` (препоръчителен размер: до 1400px ширина)
2. Създай thumbnails (до 600px) и ги сложи в `projects/thumbs/`
3. Добави блок в JSON-а като горния пример

Ако искаш автоматично обработване на нови снимки, използвай скрипта `scripts/process-projects.py` (ще бъде добавен при нужда).

## Как да добавиш лого

1. Запази логото в `assets/logo.svg` (или logo.png)
2. Във всеки HTML файл намери:
   ```html
   <a href="index.html" class="nav-brand">Пиротска <span>123</span></a>
   ```
   Замени с:
   ```html
   <a href="index.html" class="nav-brand">
     <img src="assets/logo.svg" alt="Пиротска 123" style="height: 40px">
   </a>
   ```

## Качване на хостинг

### Опция 1: Netlify (препоръчвам — безплатно, лесно)

1. Регистрирай се на [netlify.com](https://netlify.com)
2. Drag & drop цялата папка `site/` в Netlify
3. Получаваш безплатен URL вида `random-name.netlify.app`
4. След това добавяш домейна `pirotska123.bg` в Settings → Domain management

### Опция 2: Cloudflare Pages

1. Регистрирай се на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Качи папката `site/` чрез wrangler CLI или GitHub
3. Получаваш безплатен URL

### Опция 3: Класически хостинг (cPanel, SuperHosting и др.)

1. Купи домейн `pirotska123.bg` (около 45 лв/година от регистратор като SuperHosting, ICN.bg)
2. Купи хостинг план (около 50-100 лв/година — за статичен сайт стига най-евтиният)
3. През FTP клиент (FileZilla) качи цялото съдържание на `site/` в `public_html/`

### Покупка на домейна `.bg`

`.bg` домейните се регистрират чрез акредитирани регистратори:
- SuperHosting.BG
- ICN.bg
- Register.bg

Цена: ~45 лв/година + еднократна такса за първоначална регистрация.

## Технически бележки

- **Без зависимости** — Сайтът работи директно от файлова система или всеки уеб сървър.
- **Адаптивен дизайн** — Изглежда добре на телефон, таблет и компютър.
- **SEO-готов** — Има title, description и Open Graph мета тагове.
- **Шрифт Inter** — Зарежда се от Google Fonts (изисква интернет).
- **Без cookies, без tracking** — Чист сайт. Ако искаш Google Analytics или Meta Pixel, добави преди `</head>`.

## Локално тестване

JSON файлове не могат да се зареждат директно от файловата система в браузъра. За локално тестване:

**Опция 1: Python (ако имаш Python)**
```
cd site
python -m http.server 8000
```
След това отвори: http://localhost:8000

**Опция 2: VS Code**
Инсталирай разширението "Live Server" и десен клик върху `index.html` → "Open with Live Server".

**Опция 3: Просто качи на Netlify** и отвори от там.

## Поддръжка

При проблеми:
1. Провери JSON синтаксиса на jsonlint.com
2. Отвори браузъра с F12 → Console — там ще видиш грешките
3. Свържи се с разработчика на сайта
