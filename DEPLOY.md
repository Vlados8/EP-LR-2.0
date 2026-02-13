# 🚀 Деплой EP Energy Platform на Railway

## Предварительные требования

1. **Git** — скачайте и установите с [git-scm.com](https://git-scm.com/download/win)
2. **GitHub аккаунт** — зарегистрируйтесь на [github.com](https://github.com)
3. **Railway аккаунт** — зарегистрируйтесь на [railway.app](https://railway.app) (можно через GitHub)

---

## Шаг 1: Установите Git

Скачайте Git для Windows: https://git-scm.com/download/win

После установки **перезапустите VS Code**, затем откройте терминал и проверьте:

```bash
git --version
```

---

## Шаг 2: Создайте GitHub репозиторий

1. Зайдите на [github.com/new](https://github.com/new)
2. Введите имя репозитория, например: `energy-platform`
3. Оставьте **Private** (приватный)
4. **НЕ** добавляйте README, .gitignore или лицензию
5. Нажмите **Create repository**

---

## Шаг 3: Загрузите код на GitHub

Откройте терминал в папке проекта и выполните:

```bash
git init
git add .
git commit -m "Initial commit - EP Energy Platform"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/energy-platform.git
git push -u origin main
```

> ⚠️ Замените `ВАШ_ЛОГИН` на ваш GitHub логин

---

## Шаг 4: Создайте проект на Railway

1. Зайдите на [railway.app/dashboard](https://railway.app/dashboard)
2. Нажмите **New Project**
3. Выберите **Deploy from GitHub repo**
4. Авторизуйте Railway доступ к вашему GitHub
5. Выберите репозиторий `energy-platform`

---

## Шаг 5: Добавьте MySQL базу данных

1. В проекте Railway нажмите **+ New** → **Database** → **MySQL**
2. Railway автоматически создаст MySQL и добавит переменную `MYSQL_URL`
3. Приложение автоматически подключится к этой БД

---

## Шаг 6: Настройте переменные окружения

В Railway перейдите в сервис вашего приложения → **Variables** и добавьте:

| Переменная | Значение | Обязательно |
|---|---|---|
| `JWT_SECRET` | Сгенерируйте длинный случайный ключ (минимум 32 символа) | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://ваш-домен.up.railway.app` (узнаете после деплоя) | ✅ |
| `SMTP_HOST` | `hostde44.fornex.host` | ✅ |
| `SMTP_PORT` | `465` | ✅ |
| `SMTP_SECURE` | `true` | ✅ |
| `SMTP_USER` | `vertreter@empire-premium-bau.de` | ✅ |
| `SMTP_PASS` | Ваш пароль от SMTP | ✅ |
| `SMTP_FROM` | `vertreter@empire-premium-bau.de` | ✅ |

> 💡 `MYSQL_URL` добавляется автоматически при подключении MySQL сервиса!

### Генерация JWT_SECRET

Можно сгенерировать в терминале:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Шаг 7: Инициализируйте базу данных

После успешного деплоя нужно создать таблицы в БД. Есть два способа:

### Способ A: Через Railway CLI
```bash
# Установите Railway CLI
npm install -g @railway/cli

# Авторизуйтесь
railway login

# Привяжите проект
railway link

# Запустите скрипт инициализации БД
railway run node scripts/init-db.js
```

### Способ B: Через Railway Dashboard
1. Перейдите в MySQL сервис → **Data** (или **Query**)
2. Скопируйте и выполните SQL из файла `scripts/init-db.js` (CREATE TABLE команды)

---

## Шаг 8: Проверьте деплой

1. В Railway перейдите в сервис → **Settings** → **Networking**
2. Нажмите **Generate Domain** чтобы получить публичный URL
3. Скопируйте URL (например: `https://energy-platform-production.up.railway.app`)
4. **Обновите** переменную `NEXT_PUBLIC_APP_URL` на этот URL
5. Дождитесь повторного деплоя

### Проверьте работу:

- Откройте `https://ваш-домен.up.railway.app` — главная страница
- Откройте `https://ваш-домен.up.railway.app/api/health` — должно вернуть `{"status":"ok"}`
- Войдите как админ: `admin@ep.de` / `admin123`

---

## Структура деплоя

```
Railway Project
├── App Service (ваш Next.js код)
│   ├── Dockerfile → multi-stage build
│   ├── Standalone output (server.js)
│   └── Health check: /api/health
└── MySQL Service
    ├── Auto-provides MYSQL_URL
    └── Tables created by init-db.js
```

---

## Обновление приложения

После изменений в коде:

```bash
git add .
git commit -m "описание изменений"
git push
```

Railway автоматически пересоберёт и задеплоит при каждом push в main.

---

## Устранение проблем

### Деплой падает
- Проверьте логи в Railway: **Deployments** → нажмите на деплой → **View Logs**
- Убедитесь что все переменные окружения заданы правильно

### Ошибка подключения к БД
- Убедитесь что MySQL сервис запущен
- Проверьте что `MYSQL_URL` доступен в переменных (автоматически от Railway)
- Проверьте `/api/health` — покажет статус БД

### Страницы 500 ошибка
- Проверьте логи: обычно это отсутствие таблиц в БД
- Запустите `railway run node scripts/init-db.js`

### Смена пароля админа
Через MySQL консоль в Railway:
```sql
UPDATE users SET password = '$2a$10$...' WHERE email = 'admin@ep.de';
```
Или создайте нового админа через регистрацию и ручное обновление роли.

---

## Полезные ссылки

- [Railway Documentation](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/guides/cli)
- [Next.js Standalone](https://nextjs.org/docs/app/api-reference/next-config-js/output)
