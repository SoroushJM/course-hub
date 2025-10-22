# راهنمای سریع - سامانه مدیریت چارت درسی

## نصب و اجرا (5 دقیقه)

### پیش‌نیازها

```bash
node --version    # باید 20 یا بالاتر باشد
pnpm --version    # اگر ندارید: npm install -g pnpm
```

### نصب و اجرا

```bash
# 1. کلون مخزن
git clone https://github.com/YOUR_USERNAME/course-hub.git
cd course-hub

# 2. نصب وابستگی‌ها
pnpm install

# 3. اجرا
pnpm dev

# 4. باز کردن در مرورگر
# به آدرس http://localhost:5173 بروید
```

## استفاده سریع (2 دقیقه)

### گام 1: راه‌اندازی اولیه

```
نام چارت: چارت درسی من
رشته: علوم کامپیوتر
مقطع: کارشناسی
حداقل واحد: 139
حداکثر واحد: 142
```

→ کلیک "ایجاد چارت درسی"

### گام 2: افزودن درس اول

```
نام: مبانی کامپیوتر
واحد: 3
دسته: دروس الزامی-پایه
پیش‌نیاز: (خالی)
```

→ کلیک "افزودن درس"

### گام 3: افزودن درس با پیش‌نیاز

```
نام: برنامه‌سازی پیشرفته
واحد: 4
دسته: دروس الزامی-پایه
پیش‌نیاز: مبانی کامپیوتر
```

→ کلیک "افزودن درس"

### گام 4: علامت‌گذاری درس گذرانده شده

- روی "مبانی کامپیوتر" کلیک کنید
- "علامت به عنوان گذرانده شده"
- ✅ حالا "برنامه‌سازی پیشرفته" قابل اخذ است!

### گام 5: مشاهده دروس قابل اخذ

- تب "دروس قابل اخذ"
- "برنامه‌سازی پیشرفته" را می‌بینید

### گام 6: ذخیره

- "خروجی JSON" → فایل ذخیره می‌شود
- می‌توانید بعداً "ورودی JSON" کنید

## نمونه‌های آماده

### استفاده از چارت نمونه

```bash
# فایل نمونه در پوشه public قرار دارد:
public/sample-curriculum.json

# برای استفاده:
1. به سایت بروید
2. "ورودی JSON" کلیک کنید
3. فایل sample-curriculum.json را انتخاب کنید
4. ✅ چارت نمونه با 17 درس آماده است!
```

### ساختار JSON برای import:

```json
{
  "curriculum": {
    "name": "نام چارت",
    "major": "رشته",
    "degree": "مقطع",
    "totalUnits": { "min": 139, "max": 142 },
    "courses": [
      {
        "id": "unique-id",
        "name": "نام درس",
        "units": 3,
        "category": "general",
        "prerequisites": [],
        "corequisites": []
      }
    ]
  },
  "progress": {
    "passedCourses": []
  },
  "version": "1.0.0"
}
```

## استقرار روی GitHub Pages (10 دقیقه)

### گام 1: ایجاد مخزن GitHub

1. به GitHub بروید
2. New Repository
3. نام: `course-hub` (یا هر نام دیگری)
4. Create Repository

### گام 2: تنظیم Base URL

```typescript
// vite.config.ts
export default defineConfig({
  base: "/course-hub/", // نام مخزن خود
  // ...
});
```

### گام 3: Push کد

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### گام 4: فعال‌سازی GitHub Pages

1. Settings > Pages
2. Source: GitHub Actions
3. Save

### گام 5: منتظر بمانید

- تب Actions را باز کنید
- منتظر بمانید تا ✅ شود
- سایت در `https://USERNAME.github.io/REPO` آماده است

## دستورات مفید

```bash
# توسعه
pnpm dev              # سرور توسعه
pnpm build            # ساخت برای production
pnpm preview          # پیش‌نمایش build

# Linting
pnpm lint             # بررسی کد

# اضافه کردن کامپوننت shadcn
pnpm dlx shadcn@latest add [component]
```

## مشکلات رایج

### ❌ پورت اشغال است

```bash
# راه حل: پورت را تغییر دهید
pnpm dev -- --port 3000
```

### ❌ Build خطا می‌دهد

```bash
# حذف و نصب مجدد
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### ❌ Tailwind کار نمی‌کند

```bash
# بررسی کنید index.css وجود دارد
# و در main.tsx import شده است
```

### ❌ localStorage پاک شد

```bash
# راه حل: فایل JSON خود را import کنید
# همیشه backup داشته باشید!
```

## نکات مهم

✅ **همیشه backup بگیرید** - خروجی JSON منظم  
✅ **Base URL را تنظیم کنید** - برای GitHub Pages  
✅ **pnpm استفاده کنید** - نه npm یا yarn  
✅ **فارسی RTL** - به صورت خودکار فعال است  
✅ **موبایل-friendly** - روی هر دستگاهی کار می‌کند

## لینک‌های مفید

- 📖 [راهنمای کامل](USAGE-GUIDE.md)
- 🚀 [راهنمای استقرار](DEPLOYMENT.md)
- 🏗️ [ساختار پروژه](PROJECT-STRUCTURE.md)
- 📝 [مستندات اصلی](README.md)

## کمک و پشتیبانی

- 🐛 گزارش باگ: [GitHub Issues](https://github.com/YOUR_USERNAME/course-hub/issues)
- 💡 پیشنهاد: [GitHub Discussions](https://github.com/YOUR_USERNAME/course-hub/discussions)
- 🤝 مشارکت: [Pull Requests](https://github.com/YOUR_USERNAME/course-hub/pulls)

---

**موفق باشید! 🎓**

در صورت بروز هر مشکل، راهنماهای تفصیلی را مطالعه کنید یا در GitHub Issues سوال بپرسید.
