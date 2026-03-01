import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

export function FeedbackSystemDialog() {
  const [activeTab, setActiveTab] = useState("statistics");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");

  const handleGenerateReport = () => {
    console.log({
      department: selectedDepartment,
      employee: selectedEmployee,
      startDate,
      endDate,
    });
  };

  const handleExportReport = () => {
    console.log("Exporting as", exportFormat);
  };

  const tabs = [
    { id: "statistics", label: "Статистика" },
    { id: "surveys", label: "Опросы" },
    { id: "settings", label: "Настройки" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 p-4">
      <div className="bg-white rounded-lg border border-[var(--general-border)] shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--general-border)]">
          <h2 className="text-xl font-semibold text-[var(--general-foreground)]">
            Система обратной связи
          </h2>
          <button className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-0.5 px-4 pt-3 border-b border-[var(--general-border)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--unofficial-ghost-hover)] text-[var(--general-foreground)]"
                  : "text-[var(--unofficial-ghost-foreground)] hover:text-[var(--general-foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "statistics" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5 items-end">
                <div className="md:col-span-1">
                  <Label className="text-sm font-medium mb-2 block">
                    Отдел
                  </Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберете необходимый отдел" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dept1">Отдел 1</SelectItem>
                      <SelectItem value="dept2">Отдел 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-1">
                  <Label className="text-sm font-medium mb-2 block">
                    Сотрудники
                  </Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберете необходимого сотрудника" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp1">Сотрудник 1</SelectItem>
                      <SelectItem value="emp2">Сотрудник 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Начало
                  </Label>
                  <Input
                    type="text"
                    placeholder="ДД.ММ.ГГГГ"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Конец
                  </Label>
                  <Input
                    type="text"
                    placeholder="ДД.ММ.ГГГГ"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div>
                  <Button
                    onClick={handleGenerateReport}
                    className="w-full bg-[var(--general-accent)] hover:bg-[#4a7fd7] text-white"
                  >
                    Сформировать
                  </Button>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1 */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[var(--general-border)]">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.125 9.5V1.5C1.125 1.29289 1.29289 1.125 1.5 1.125C1.70711 1.125 1.875 1.29289 1.875 1.5V9.5C1.875 9.66576 1.9409 9.82468 2.05811 9.94189C2.17532 10.0591 2.33424 10.125 2.5 10.125H10.5C10.7071 10.125 10.875 10.2929 10.875 10.5C10.875 10.7071 10.7071 10.875 10.5 10.875H2.5C2.13533 10.875 1.78569 10.73 1.52783 10.4722C1.26997 10.2143 1.125 9.86467 1.125 9.5Z"
                        fill="#737373"
                      />
                    </svg>
                    <span className="text-xs text-[var(--general-muted-foreground)]">
                      Количество отзывов по выбранному периоду
                    </span>
                  </div>
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    [Chart placeholder]
                  </div>
                </Card>

                {/* Chart 2 */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[var(--general-border)]">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.23486 4.23486C9.38131 4.08842 9.61869 4.08842 9.76514 4.23486C9.91158 4.38131 9.91158 4.61869 9.76514 4.76514L7.26514 7.26514C7.11869 7.41158 6.88131 7.41158 6.73486 7.26514L5 5.53027L3.76514 6.76514C3.61869 6.91158 3.38131 6.91158 3.23486 6.76514C3.08842 6.61869 3.08842 6.38131 3.23486 6.23486L4.73486 4.73486L4.76318 4.70898C4.91047 4.58883 5.12783 4.59756 5.26514 4.73486L7 6.46973L9.23486 4.23486Z"
                        fill="#737373"
                      />
                    </svg>
                    <span className="text-xs text-[var(--general-muted-foreground)]">
                      Статистика положительных и отрицательных отзывов
                    </span>
                  </div>
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    [Chart placeholder]
                  </div>
                </Card>
              </div>

              {/* Export Section */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--general-border)]">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Выберете тип файла:
                  </Label>
                  <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="csv" id="csv" />
                        <Label htmlFor="csv" className="font-normal">
                          .csv
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="xlsx" id="xlsx" />
                        <Label htmlFor="xlsx" className="font-normal">
                          .xlsx
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleExportReport}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Экспортировать отчет
                </Button>
              </div>
            </div>
          )}

          {activeTab === "surveys" && (
            <div className="text-center text-gray-500 py-12">
              Опросы - Раздел в разработке
            </div>
          )}

          {activeTab === "settings" && (
            <div className="text-center text-gray-500 py-12">
              Настройки - Раздел в разработке
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
