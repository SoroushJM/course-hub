import React, { useState } from 'react';
import { useCurriculum } from '../store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { LayoutGrid, FileJson, Trash2, Check, Upload } from "lucide-react";
import { toast } from "sonner";

export const TemplateManager: React.FC = () => {
  const { customTemplates, loadTemplate, deleteCustomTemplate, template } =
    useCurriculum();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [officialTemplates, setOfficialTemplates] = useState<
    { id: string; title: string; university?: string }[]
  >([]);

  React.useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}templates/registry.json`)
      .then((res) => res.json())
      .then((data) => setOfficialTemplates(data))
      .catch((err) => console.error("Failed to load registry", err));
  }, []);

  const handleLoad = async (id: string) => {
    await loadTemplate(id);
    setIsOpen(false);
    toast.success("چارت با موفقیت بارگذاری شد");
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCustomTemplate(deleteId);
      toast.success("چارت حذف شد");
      setDeleteId(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            مدیریت چارت‌ها
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>انتخاب چارت درسی</DialogTitle>
            <DialogDescription>
              چارت مورد نظر خود را انتخاب کنید یا چارت‌های شخصی خود را مدیریت
              کنید.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="official" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="official">چارت‌های رسمی</TabsTrigger>
              <TabsTrigger value="custom">چارت‌های من</TabsTrigger>
            </TabsList>

            <TabsContent value="official" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-4">
                  {officialTemplates.map((t) => (
                    <Card
                      key={t.id}
                      className={`cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50 ${
                        template?.id === t.id
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                      onClick={() => handleLoad(t.id)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">
                          {t.title}
                        </CardTitle>
                        {template?.id === t.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{t.university}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="custom" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                {customTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground gap-4">
                    <FileJson className="h-12 w-12 opacity-20" />
                    <p>هنوز هیچ چارت شخصی نساخته‌اید.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {customTemplates.map((t) => (
                      <Card
                        key={t.id}
                        className={`cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50 ${
                          template?.id === t.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() => handleLoad(t.id)}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle
                            className="text-base font-medium truncate max-w-[300px]"
                            title={t.title}
                          >
                            {t.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {template?.id === t.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(t.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="flex justify-between">
                            <span>{t.university}</span>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full font-mono">
                              {t.id}
                            </span>
                          </CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="mt-4 pt-4 border-t flex justify-end">
            <div className="relative">
              <input
                type="file"
                id="load-template-json"
                className="hidden"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const json = JSON.parse(event.target?.result as string);
                      // Validation: Check for required template fields
                      if (
                        !json.id ||
                        !json.title ||
                        !json.groups ||
                        typeof json.totalUnitsRequired !== "number"
                      ) {
                        toast.error("فایل انتخاب شده یک چارت معتبر نیست");
                        return;
                      }

                      // It seems valid
                      useCurriculum.getState().importTemplate(json);
                      toast.success("چارت با موفقیت بارگذاری شد");
                      setIsOpen(false);
                    } catch (err) {
                      console.error(err);
                      toast.error("خطا در خواندن فایل");
                    }
                  };
                  reader.readAsText(file);
                  // Reset input
                  e.target.value = "";
                }}
              />
              <Button variant="outline" className="gap-2" asChild>
                <label htmlFor="load-template-json" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  بارگذاری فایل چارت
                </label>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              آیا از حذف این چارت مطمئن هستید؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات غیرقابل بازگشت است. این چارت برای همیشه از حافظه مرورگر
              شما پاک خواهد شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
