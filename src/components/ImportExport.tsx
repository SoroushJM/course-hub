import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import { exportData, importData, downloadJSON } from "@/lib/storage";

interface ImportExportProps {
  onImport: () => void;
}

export const ImportExport = ({ onImport }: ImportExportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = exportData();
      const filename = `course-hub-${
        new Date().toISOString().split("T")[0]
      }.json`;
      downloadJSON(data, filename);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "خطا در خروجی گرفتن داده‌ها"
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        importData(jsonString);
        onImport();
        alert("داده‌ها با موفقیت وارد شد!");
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "خطا در وارد کردن داده‌ها"
        );
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ورود و خروج داده‌ها</CardTitle>
        <CardDescription>
          چارت درسی و پیشرفت خود را ذخیره کرده یا بارگذاری کنید
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button onClick={handleExport} className="flex-1">
          <Download className="w-4 h-4 ml-2" />
          خروجی JSON
        </Button>
        <Button
          onClick={handleImportClick}
          variant="outline"
          className="flex-1"
        >
          <Upload className="w-4 h-4 ml-2" />
          ورودی JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
