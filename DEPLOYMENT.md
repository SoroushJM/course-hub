# راهنمای استقرار روی GitHub Pages

## مراحل استقرار

### 1. آماده‌سازی مخزن

1. یک مخزن GitHub جدید ایجاد کنید
2. کد را به مخزن خود push کنید:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. پیکربندی Base URL

اگر نام مخزن شما متفاوت از `course-hub` است، فایل `vite.config.ts` را ویرایش کنید:

```typescript
export default defineConfig({
  base: "/YOUR_REPO_NAME/", // نام مخزن خود را اینجا قرار دهید
  // ...
});
```

### 3. فعال‌سازی GitHub Pages

1. به مخزن خود در GitHub بروید
2. به Settings > Pages بروید
3. در قسمت "Source"، گزینه "GitHub Actions" را انتخاب کنید
4. ذخیره کنید

### 4. اجرای خودکار

- هر بار که کد را به branch اصلی push می‌کنید، GitHub Actions به صورت خودکار:
  - پروژه را build می‌کند
  - آن را روی GitHub Pages مستقر می‌کند
- می‌توانید وضعیت deployment را در تب "Actions" مخزن مشاهده کنید

### 5. دسترسی به سایت

پس از موفقیت‌آمیز بودن deployment، سایت شما در آدرس زیر در دسترس خواهد بود:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## نکات مهم

### کش مرورگر

اگر پس از بروزرسانی، تغییرات را نمی‌بینید، کش مرورگر خود را پاک کنید:

- Chrome/Edge: `Ctrl + Shift + Delete`
- Firefox: `Ctrl + Shift + Delete`
- Safari: `Cmd + Option + E`

### دامنه سفارشی

اگر می‌خواهید از دامنه سفارشی استفاده کنید:

1. یک فایل `CNAME` در پوشه `public` ایجاد کنید
2. آدرس دامنه خود را در آن بنویسید (مثلاً `example.com`)
3. در تنظیمات DNS دامنه، یک رکورد CNAME به `YOUR_USERNAME.github.io` اضافه کنید

### محدودیت‌ها

- GitHub Pages برای سایت‌های static طراحی شده است
- فضای مخزن حداکثر 1GB
- پهنای باند حداکثر 100GB در ماه
- حداکثر 10 build در ساعت

## عیب‌یابی

### Build ناموفق

اگر build ناموفق شد:

1. لاگ‌های GitHub Actions را بررسی کنید
2. مطمئن شوید که به صورت محلی build موفق است: `pnpm build`
3. مطمئن شوید که تمام dependencies در `package.json` موجود است

### صفحه 404

اگر صفحه 404 دریافت کردید:

1. مطمئن شوید که `base` در `vite.config.ts` صحیح است
2. چند دقیقه صبر کنید، گاهی استقرار کمی زمان می‌برد
3. کش مرورگر را پاک کنید

### سبک‌های CSS اعمال نمی‌شوند

اگر سبک‌ها درست نمایش داده نمی‌شوند:

1. در DevTools مرورگر، Network را بررسی کنید
2. مطمئن شوید که فایل‌های CSS با موفقیت بارگذاری می‌شوند
3. مسیرهای فایل را بررسی کنید

## بروزرسانی سایت

برای بروزرسانی سایت مستقر شده، کافی است:

```bash
git add .
git commit -m "Update message"
git push
```

GitHub Actions به صورت خودکار سایت را بروزرسانی خواهد کرد.
