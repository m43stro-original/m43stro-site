# M43STRO — Personal Website

> *«Истинное мастерство говорит тихо: оно преображает реальность точностью, смыслом и невидимой грацией.»*

Премиальный персональный сайт **M43STRO**, созданный на стыке двух ведущих инженерных дизайн-систем: **Apple Human Interface Guidelines (WWDC Fluid Motion)** и философии **Emil Kowalski Design Engineering**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)

---

## Особенности и Архитектура

- **Монументальная типографика «M43STRO»**:
  - Оптический отрицательный трекинг (`letter-spacing: -0.045em`).
  - Интерактивный 3D-параллакс от курсора мыши с критически демпфированной пружиной (`damping: 25, stiffness: 200`).
  - Посимвольное ступенчатое появление (stagger 50ms).
  - Спекулярный титановый градиентный блеск.

- **Секция мудрых мыслей**:
  - Коллекция глубоких афоризмов о созидании, геометрии кода и мастерстве.
  - Бесшовный переход между цитатами через блюр-мост (`filter: blur(4px)`) по рецепту Emil Kowalski.
  - Переключение в 1 клик или клавишей `Space` / `Q`.

- **Интерактивные карточки контактов**:
  - **Telegram**: [@MAESTROMKI](https://t.me/MAESTROMKI) (прямой переход + копирование).
  - **GitHub**: [m43stro-original](https://github.com/m43stro-original) (открытые проекты и концепции).
  - **Discord**: `_mki_` (мгновенное копирование в буфер обмена в один клик + Sonner-тост).
  - Динамический световой спотлайт (radial gradient), следующий точно за координатами мыши внутри каждой карточки.
  - Мгновенная тактильная отдача на нажатие: `:active { transform: scale(0.97) }`.

- **Звуковой дизайн (Audio-Haptics)**:
  - Встроенный синтезатор тактильных микро-щелчков на Web Audio API (ноль внешних mp3).
  - Переключатель Mute/Unmute с сохранением в `localStorage`.

- **Плавающий macOS Dock**:
  - Быстрый доступ к соцсетям, копированию Discord, смене цитаты, включению звука и праздничному всплеску частиц.

- **Атмосфера и производительность**:
  - 60 FPS Canvas с частицами звездной пыли, мягко расступающимися перед курсором.
  - Полная поддержка `prefers-reduced-motion` и защита сенсорных экранов от ложных ховеров (`@media (hover: hover)`).

---

## Стек технологий

- **Фреймворк**: React 19 + TypeScript
- **Сборщик**: Vite 6
- **Стилизация**: Tailwind CSS v4
- **Анимации**: Framer Motion / Motion
- **Иконки**: Lucide React
- **Звук**: Web Audio API

---

## Локальный запуск

```bash
# Клонирование репозитория
git clone https://github.com/m43stro-original/m43stro-site.git

# Переход в папку
cd m43stro-site

# Установка зависимостей
npm install

# Запуск локального сервера разработки
npm run dev

# Сборка продакшн-бандла
npm run build
```

---

Crafted by **M43STRO** with obsessive precision.
