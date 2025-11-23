import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  FileJson,
  LayoutGrid,
  Calculator,
  Upload,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Help: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">راهنمای استفاده از سامانه</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              مدیریت چارت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-loose">
            <p>
              در این بخش می‌توانید بین چارت‌های مختلف جابجا شوید. این سامانه از
              دو نوع چارت پشتیبانی می‌کند:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>
                <span className="font-medium text-foreground">
                  چارت‌های رسمی:
                </span>{" "}
                چارت‌های پیش‌فرض دانشگاه که توسط تیم توسعه‌دهنده اضافه شده‌اند.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  چارت‌های شخصی:
                </span>
                چارت‌هایی که خودتان ساخته‌اید یا ویرایش کرده‌اید.
              </li>
            </ul>
            <p>
              با کلیک روی دکمه "مدیریت چارت‌ها" در صفحه اصلی، می‌توانید لیست
              تمام چارت‌های موجود را ببینید و چارت فعال خود را تغییر دهید.
            </p>
          </CardContent>
        </Card>

        {/* Overflow Rule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              قانون سرریز 
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-loose">
            <p>یکی از ویژگی‌های هوشمند این سامانه، محاسبه واحدهای مازاد است.</p>
            <div className="bg-muted/50 p-4 rounded-lg border text-sm">
              <p className="font-medium text-foreground mb-2">مثال:</p>
              اگر در گروه "دروس اختیاری" نیاز به گذراندن ۲۰ واحد دارید، اما ۲۴
              واحد پاس کرده‌اید، ۴ واحد اضافی هدر نمی‌رود!
            </div>
            <p>
              اگر در تنظیمات چارت تعریف شده باشد، این واحدهای اضافی به طور
              خودکار به گروه دیگری (مثلاً "دروس کهاد" یا "مازاد") منتقل می‌شوند
              و در پیشرفت آن گروه محاسبه می‌شوند.
            </p>
          </CardContent>
        </Card>

        {/* JSON Files */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              فایل‌های داده (JSON)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-loose">
              <h3 className="font-medium text-foreground text-lg">
                ۱. فایل پیشرفت (Progress JSON)
              </h3>
              <p>این فایل شامل اطلاعات شخصی شماست:</p>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>کدام درس‌ها را پاس کرده‌اید.</li>
                <li>در چه ترمی پاس شده‌اند.</li>
              </ul>
              <p>
                از دکمه{" "}
                <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs">
                  <Download className="h-3 w-3" /> خروجی پیشرفت
                </span>{" "}
                برای ذخیره و{" "}
                <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs">
                  <Upload className="h-3 w-3" /> وارد کردن پیشرفت
                </span>{" "}
                برای بازیابی آن استفاده کنید.
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground leading-loose">
              <h3 className="font-medium text-foreground text-lg">
                ۲. فایل چارت (Template JSON)
              </h3>
              <p>این فایل ساختار درسی رشته شما را تعریف می‌کند:</p>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>لیست دروس و واحدها.</li>
                <li>پیش‌نیازها و هم‌نیازها.</li>
                <li>گروه‌بندی دروس (عمومی، پایه، اصلی و...).</li>
              </ul>
              <p>
                شما می‌توانید در بخش "ویرایشگر چارت"، یک چارت را ویرایش کنید و
                فایل JSON آن را دانلود کنید تا با دوستانتان به اشتراک بگذارید.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Import / Export */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              نحوه انتقال اطلاعات (Import / Export)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-loose">
            <p>
              از آنجا که این سامانه به هیچ سروری متصل نیست و تمام داده‌ها در
              مرورگر شما ذخیره می‌شود، برای انتقال اطلاعات بین دستگاه‌ها (مثلاً
              از موبایل به لپ‌تاپ) باید از قابلیت Import/Export استفاده کنید.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="border rounded-lg p-4">
                <span className="font-bold text-foreground block mb-2">
                  انتقال پیشرفت:
                </span>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>در دستگاه اول، روی "خروجی پیشرفت" کلیک کنید.</li>
                  <li>
                    فایل{" "}
                    <code className="bg-muted px-1 rounded">progress.json</code>{" "}
                    دانلود می‌شود.
                  </li>
                  <li>این فایل را به دستگاه دوم منتقل کنید.</li>
                  <li>
                    در دستگاه دوم، روی "وارد کردن پیشرفت" کلیک کنید و فایل را
                    انتخاب کنید.
                  </li>
                </ol>
              </div>
              <div className="border rounded-lg p-4">
                <span className="font-bold text-foreground block mb-2">
                  اشتراک‌گذاری چارت:
                </span>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>در بخش ویرایشگر، چارت خود را بسازید.</li>
                  <li>روی "دانلود JSON" کلیک کنید.</li>
                  <li>فایل چارت را برای دوستانتان بفرستید.</li>
                  <li>
                    آنها می‌توانند از طریق "مدیریت چارت‌ها" "بارگذاری فایل
                    چارت"، آن را اضافه کنند.
                  </li>
                </ol>
              </div>
            </div>
            <div>لطفا در نوشتن این راهنما هم کمکم کنید 😂😂</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
