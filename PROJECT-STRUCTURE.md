# ساختار پروژه

## دایرکتوری‌های اصلی

```
course-hub/
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml    # استقرار خودکار روی GitHub Pages
├── public/               # فایل‌های استاتیک
│   ├── sample-curriculum.json  # نمونه چارت درسی
│   ├── .nojekyll         # برای GitHub Pages
│   └── vite.svg
├── src/                  # کد منبع اصلی
│   ├── components/       # کامپوننت‌های React
│   │   ├── ui/           # کامپوننت‌های shadcn/ui
│   │   ├── CourseCard.tsx
│   │   ├── CourseForm.tsx
│   │   ├── CurriculumSetup.tsx
│   │   ├── ImportExport.tsx
│   │   └── ProgressSummary.tsx
│   ├── lib/              # توابع کمکی و utilities
│   │   ├── courseLogic.ts
│   │   ├── storage.ts
│   │   └── utils.ts
│   ├── types/            # تعاریف TypeScript
│   │   └── course.ts
│   ├── App.tsx           # کامپوننت اصلی
│   ├── main.tsx          # نقطه ورود
│   └── index.css         # استایل‌های global
├── DEPLOYMENT.md         # راهنمای استقرار
├── USAGE-GUIDE.md        # راهنمای استفاده
├── README.md             # مستندات اصلی
├── components.json       # پیکربندی shadcn/ui
├── index.html            # فایل HTML اصلی
├── package.json          # وابستگی‌های npm
├── tsconfig.json         # پیکربندی TypeScript
└── vite.config.ts        # پیکربندی Vite
```

## توضیح فایل‌ها و دایرکتوری‌ها

### `/src/types/`

تعاریف TypeScript برای type safety

- **`course.ts`**: تمام interface‌ها و type‌های مورد استفاده
  - `Course`: مدل درس
  - `Curriculum`: مدل چارت درسی
  - `StudentProgress`: پیشرفت دانشجو
  - `PassedCourse`: درس گذرانده شده
  - `CategoryInfo`: اطلاعات دسته‌بندی
  - `ExportData`: ساختار داده برای export/import

### `/src/lib/`

منطق برنامه و توابع کمکی

- **`courseLogic.ts`**: منطق مربوط به دروس

  - `arePrerequisitesMet()`: بررسی برآورده شدن پیش‌نیازها
  - `getAvailableCourses()`: دریافت دروس قابل اخذ
  - `getFullyAvailableCourses()`: دروسی که تمام پیش‌نیازها برآورده شده
  - `calculateUnitsCompleted()`: محاسبه واحدهای گذرانده شده
  - `calculateUnitsByCategory()`: محاسبه واحد به تفکیک دسته

- **`storage.ts`**: مدیریت ذخیره‌سازی

  - `saveCurriculum()`: ذخیره چارت در localStorage
  - `loadCurriculum()`: بارگذاری چارت از localStorage
  - `saveProgress()`: ذخیره پیشرفت
  - `loadProgress()`: بارگذاری پیشرفت
  - `exportData()`: تبدیل به JSON برای خروجی
  - `importData()`: وارد کردن از JSON
  - `downloadJSON()`: دانلود فایل JSON

- **`utils.ts`**: توابع کمکی عمومی
  - `cn()`: ترکیب classNameها با tailwind-merge

### `/src/components/`

کامپوننت‌های React

#### کامپوننت‌های اصلی:

- **`CurriculumSetup.tsx`**

  - فرم راه‌اندازی اولیه چارت درسی
  - اولین صفحه‌ای که کاربر می‌بیند

- **`CourseForm.tsx`**

  - فرم افزودن/ویرایش درس
  - مدیریت پیش‌نیازها و همنیازها
  - انتخاب دسته‌بندی

- **`CourseCard.tsx`**

  - نمایش اطلاعات یک درس
  - دکمه‌های ویرایش، حذف، علامت‌گذاری
  - نمایش پیش‌نیازها و همنیازها

- **`ProgressSummary.tsx`**

  - نمایش خلاصه پیشرفت تحصیلی
  - نمودار پیشرفت کلی
  - پیشرفت به تفکیک دسته

- **`ImportExport.tsx`**
  - دکمه‌های ورودی/خروجی JSON
  - مدیریت فایل upload

#### `/src/components/ui/`

کامپوننت‌های UI از shadcn/ui:

- `button.tsx`
- `card.tsx`
- `input.tsx`
- `label.tsx`
- `select.tsx`
- `dialog.tsx`
- `tabs.tsx`
- `accordion.tsx`
- `badge.tsx`

### `/src/App.tsx`

کامپوننت اصلی و مدیریت state

**State Management:**

- `curriculum`: چارت درسی فعلی
- `progress`: پیشرفت دانشجو
- `activeTab`: تب فعال
- `isAddCourseOpen`: وضعیت دیالوگ افزودن درس
- `editingCourse`: درس در حال ویرایش

**توابع اصلی:**

- `handleSetupCurriculum()`: راه‌اندازی چارت جدید
- `handleAddCourse()`: افزودن/ویرایش درس
- `handleDeleteCourse()`: حذف درس
- `handleTogglePassedCourse()`: علامت‌گذاری/لغو گذراندن درس
- `handleImport()`: وارد کردن داده‌ها

### `/public/`

فایل‌های استاتیک

- **`sample-curriculum.json`**: نمونه چارت برای رفرنس کاربران
- **`.nojekyll`**: جلوگیری از پردازش Jekyll در GitHub Pages

## جریان داده (Data Flow)

```
1. کاربر وارد سایت می‌شود
   ↓
2. App بررسی می‌کند آیا curriculum در localStorage هست؟
   ├─ خیر → نمایش CurriculumSetup
   └─ بله → نمایش صفحه اصلی
   ↓
3. کاربر درس‌ها را مدیریت می‌کند
   ↓
4. تغییرات در localStorage ذخیره می‌شود
   ↓
5. کاربر می‌تواند export بگیرد (JSON)
```

## معماری کامپوننت‌ها

```
App (مدیریت state اصلی)
├─ CurriculumSetup (راه‌اندازی اولیه)
└─ Main Layout
   ├─ Header
   ├─ Tabs
   │  ├─ "مدیریت دروس"
   │  │  └─ CourseCard (x N)
   │  ├─ "دروس گذرانده شده"
   │  │  └─ CourseCard (x N)
   │  └─ "دروس قابل اخذ"
   │     └─ CourseCard (x N)
   └─ Sidebar
      ├─ ProgressSummary
      └─ ImportExport

Dialog (برای افزودن/ویرایش)
└─ CourseForm
```

## تکنولوژی‌ها و ابزارها

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool و dev server
- **Tailwind CSS v4**: Styling
- **shadcn/ui**: کامپوننت‌های UI
- **pnpm**: Package manager
- **GitHub Actions**: CI/CD

## API‌های مرورگر

### localStorage

برای ذخیره‌سازی دائمی داده‌ها:

- `course-hub-curriculum`: چارت درسی
- `course-hub-progress`: پیشرفت دانشجو

### File API

برای import/export:

- `FileReader` برای خواندن فایل JSON
- `Blob` و `URL.createObjectURL` برای دانلود

### crypto.randomUUID()

برای تولید ID یکتا برای دروس و چارت‌ها

## نکات توسعه

### اضافه کردن فیچر جدید

1. **تعریف Type**: در `src/types/course.ts`
2. **منطق**: در `src/lib/`
3. **UI**: کامپوننت جدید در `src/components/`
4. **Integration**: در `App.tsx`

### اضافه کردن کامپوننت shadcn جدید

```bash
pnpm dlx shadcn@latest add [component-name]
```

### تست محلی

```bash
pnpm dev        # توسعه
pnpm build      # ساخت
pnpm preview    # پیش‌نمایش build
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: استفاده از `useMemo` برای محاسبات سنگین
2. **Local Storage**: تنها هنگام تغییر ذخیره می‌شود
3. **Component Splitting**: کامپوننت‌ها به صورت منطقی تقسیم شده‌اند

### Bundle Size

- React و ReactDOM: ~140KB
- shadcn/ui components: ~30KB
- Custom code: ~20KB
- Total (gzipped): ~110KB

## امنیت

- **No Backend**: هیچ داده‌ای به سرور ارسال نمی‌شود
- **Local Storage**: داده‌ها تنها در مرورگر کاربر
- **JSON Validation**: اعتبارسنجی هنگام import
- **XSS Protection**: React به طور پیش‌فرض از XSS محافظت می‌کند

## توسعه آینده

### فیچرهای پیشنهادی

- [ ] چند چارت درسی
- [ ] محاسبه معدل
- [ ] تقویم آکادمیک
- [ ] یادآوری‌ها
- [ ] نمودار وابستگی دروس
- [ ] پشتیبانی از PDF برای چارت
- [ ] حالت تاریک
- [ ] چند زبانه (انگلیسی)

### بهبودهای احتمالی

- [ ] PWA capabilities
- [ ] Offline support کامل
- [ ] Sync با Google Drive
- [ ] Export به PDF
- [ ] Import از PDF/تصویر
