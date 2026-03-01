import { useState } from "react";
import { X, Plus, Calendar, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Survey = {
  id: string;
  name: string;
  deadline: string;
  assignee: string;
  extraCount: number;
};

const INITIAL_SURVEYS: Survey[] = [
  {
    id: "1",
    name: "Опрос 01.06.2025-01.12.2025",
    deadline: "01.12.2025",
    assignee: "Иванонов И.И.",
    extraCount: 20,
  },
  {
    id: "2",
    name: "Опрос 01.01.2025-01.06.2025",
    deadline: "01.06.2025",
    assignee: "Иванонов И.И.",
    extraCount: 20,
  },
];

export function FeedbackSystemDialog() {
  const [activeTab, setActiveTab] = useState("statistics");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const [surveysExportFormat, setSurveysExportFormat] = useState("csv");
  const [surveys, setSurveys] = useState<Survey[]>(INITIAL_SURVEYS);
  const [selectedSurveys, setSelectedSurveys] = useState<Set<string>>(new Set());

  const handleGenerateReport = () => {
    console.log({ department: selectedDepartment, employee: selectedEmployee, startDate, endDate });
  };

  const handleDeleteSurvey = (id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
    setSelectedSurveys((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSurveySelection = (id: string, checked: boolean) => {
    setSelectedSurveys((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllSurveys = (checked: boolean) => {
    setSelectedSurveys(checked ? new Set(surveys.map((s) => s.id)) : new Set());
  };

  const allSelected = surveys.length > 0 && selectedSurveys.size === surveys.length;
  const someSelected = selectedSurveys.size > 0 && !allSelected;

  const tabs = [
    { id: "statistics", label: "Статистика" },
    { id: "surveys", label: "Опросы" },
    { id: "settings", label: "Настройки" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 p-4">
      <div className="bg-white rounded-[10px] border border-[var(--general-border)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] w-full max-w-4xl max-h-[90vh] flex flex-col">

        {/* Dialog Header */}
        <div className="flex justify-between items-center px-4 py-4">
          <h2 className="text-xl font-semibold leading-6 text-[var(--general-foreground)]">
            Система обратной связи
          </h2>
          <button className="text-[#525252] hover:text-[var(--general-foreground)] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-0.5 px-4 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="flex-1 overflow-y-auto px-9 py-4">

          {/* ─── Statistics Tab ─── */}
          {activeTab === "statistics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5 items-end">
                <div className="md:col-span-1">
                  <Label className="text-sm font-medium mb-2 block">Отдел</Label>
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
                  <Label className="text-sm font-medium mb-2 block">Сотрудники</Label>
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
                  <Label className="text-sm font-medium mb-2 block">Начало</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252] w-4 h-4 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="ДД.ММ.ГГГГ"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Конец</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252] w-4 h-4 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="ДД.ММ.ГГГГ"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
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
                <Card className="overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--general-border)]">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
                      <path d="M1.125 9.5V1.5C1.125 1.293 1.293 1.125 1.5 1.125C1.707 1.125 1.875 1.293 1.875 1.5V9.5C1.875 9.666 1.941 9.825 2.058 9.942C2.175 10.059 2.334 10.125 2.5 10.125H10.5C10.707 10.125 10.875 10.293 10.875 10.5C10.875 10.707 10.707 10.875 10.5 10.875H2.5C2.135 10.875 1.786 10.73 1.528 10.472C1.27 10.214 1.125 9.865 1.125 9.5Z" fill="#737373"/>
                      <path d="M9.125 3C9.125 2.931 9.069 2.875 9 2.875H8C7.931 2.875 7.875 2.931 7.875 3V8C7.875 8.069 7.931 8.125 8 8.125H9C9.069 8.125 9.125 8.069 9.125 8V3ZM9.875 8C9.875 8.483 9.483 8.875 9 8.875H8C7.517 8.875 7.125 8.483 7.125 8V3C7.125 2.517 7.517 2.125 8 2.125H9C9.483 2.125 9.875 2.517 9.875 3V8Z" fill="#737373"/>
                      <path d="M5.125 4.5C5.125 4.431 5.069 4.375 5 4.375H4C3.931 4.375 3.875 4.431 3.875 4.5V8C3.875 8.069 3.931 8.125 4 8.125H5C5.069 8.125 5.125 8.069 5.125 8V4.5ZM5.875 8C5.875 8.483 5.483 8.875 5 8.875H4C3.517 8.875 3.125 8.483 3.125 8V4.5C3.125 4.017 3.517 3.625 4 3.625H5C5.483 3.625 5.875 4.017 5.875 4.5V8Z" fill="#737373"/>
                    </svg>
                    <span className="text-xs text-[var(--general-muted-foreground)]">
                      Количество отзывов по выбранному периоду
                    </span>
                  </div>
                  <div className="flex p-6 gap-4" style={{ height: 280 }}>
                    <div className="flex flex-col justify-between items-end text-xs text-[var(--general-muted-foreground)] shrink-0">
                      {[100,90,80,70,60,50,40,30,20,10,0].map((v) => (
                        <span key={v}>{v}</span>
                      ))}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      {[100,90,80,70,60,50,40,30,20,10,0].map((v) => (
                        <div key={v} className="border-t border-[var(--unofficial-border-1)] w-full" />
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--general-border)]">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
                      <path d="M1.125 9.5V1.5C1.125 1.293 1.293 1.125 1.5 1.125C1.707 1.125 1.875 1.293 1.875 1.5V9.5C1.875 9.666 1.941 9.825 2.058 9.942C2.175 10.059 2.334 10.125 2.5 10.125H10.5C10.707 10.125 10.875 10.293 10.875 10.5C10.875 10.707 10.707 10.875 10.5 10.875H2.5C2.135 10.875 1.786 10.73 1.528 10.472C1.27 10.214 1.125 9.865 1.125 9.5Z" fill="#737373"/>
                      <path d="M9.235 4.235C9.381 4.088 9.619 4.088 9.765 4.235C9.912 4.381 9.912 4.619 9.765 4.765L7.265 7.265C7.119 7.412 6.881 7.412 6.735 7.265L5 5.53L3.765 6.765C3.619 6.912 3.381 6.912 3.235 6.765C3.088 6.619 3.088 6.381 3.235 6.235L4.735 4.735L4.763 4.709C4.91 4.589 5.128 4.598 5.265 4.735L7 6.47L9.235 4.235Z" fill="#737373"/>
                    </svg>
                    <span className="text-xs text-[var(--general-muted-foreground)]">
                      Статистика положительных и отрицательных отзывов
                    </span>
                  </div>
                  <div className="flex p-6 gap-4" style={{ height: 280 }}>
                    <div className="flex flex-col justify-between items-end text-xs text-[var(--general-muted-foreground)] shrink-0">
                      {[100,90,80,70,60,50,40,30,20,10,0].map((v) => (
                        <span key={v}>{v}</span>
                      ))}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      {[100,90,80,70,60,50,40,30,20,10,0].map((v) => (
                        <div key={v} className="border-t border-[var(--unofficial-border-1)] w-full" />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Export Section */}
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--general-foreground)]">Выберете тип файла:</p>
                  <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="csv" id="stat-csv" />
                        <Label htmlFor="stat-csv" className="font-normal text-[var(--unofficial-ghost-foreground)]">.csv</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="xlsx" id="stat-xlsx" />
                        <Label htmlFor="stat-xlsx" className="font-normal text-[var(--unofficial-ghost-foreground)]">.xlxs</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus size={16} />
                  Экспортировать отчет
                </Button>
              </div>
            </div>
          )}

          {/* ─── Surveys Tab ─── */}
          {activeTab === "surveys" && (
            <div className="space-y-4">
              {/* Create Survey Button */}
              <div className="flex justify-end">
                <Button className="bg-[var(--general-accent)] hover:bg-[#4a7fd7] text-white flex items-center gap-2">
                  <Plus size={16} />
                  Создать опрос
                </Button>
              </div>

              {/* Surveys Table */}
              <div className="w-full">
                {/* Table Header */}
                <div className="flex items-center gap-4 px-4 py-2">
                  <Checkbox
                    checked={allSelected}
                    data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                    onCheckedChange={(v) => toggleAllSurveys(!!v)}
                    className="shrink-0"
                  />
                  <div className="flex-1 grid grid-cols-[2fr_auto_2fr] gap-4">
                    <span className="text-sm font-medium text-[var(--general-foreground)]">Наименование</span>
                    <span className="text-sm font-medium text-[var(--general-foreground)] text-center">Срок</span>
                    <span className="text-sm font-medium text-[var(--general-foreground)]">Назначения</span>
                  </div>
                  <div className="w-8 shrink-0" />
                </div>

                {/* Survey Rows */}
                <div className="space-y-1">
                  {surveys.map((survey) => (
                    <SurveyRow
                      key={survey.id}
                      survey={survey}
                      isSelected={selectedSurveys.has(survey.id)}
                      onToggle={(checked) => toggleSurveySelection(survey.id, checked)}
                      onDelete={() => handleDeleteSurvey(survey.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Export Section */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--general-foreground)]">Выберете тип файла:</p>
                  <RadioGroup value={surveysExportFormat} onValueChange={setSurveysExportFormat}>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="csv" id="surv-csv" />
                        <Label htmlFor="surv-csv" className="font-normal text-[var(--unofficial-ghost-foreground)]">.csv</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="xlsx" id="surv-xlsx" />
                        <Label htmlFor="surv-xlsx" className="font-normal text-[var(--unofficial-ghost-foreground)]">.xlxs</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus size={16} />
                  Экспортировать ответы
                </Button>
              </div>
            </div>
          )}

          {/* ─── Settings Tab ─── */}
          {activeTab === "settings" && (
            <div className="text-center text-[var(--general-muted-foreground)] py-12">
              Настройки — раздел в разработке
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Survey Row Component ─── */
type SurveyRowProps = {
  survey: Survey;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  onDelete: () => void;
};

function SurveyRow({ survey, isSelected, onToggle, onDelete }: SurveyRowProps) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
        isSelected
          ? "bg-[var(--unofficial-ghost-hover)] border-[var(--general-border)]"
          : "bg-white border-[var(--general-border)]"
      }`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(v) => onToggle(!!v)}
        className="shrink-0"
      />

      <div className="flex-1 grid grid-cols-[2fr_auto_2fr] gap-4 items-center min-w-0">
        {/* Name */}
        <span className="text-sm text-[var(--general-foreground)] truncate">{survey.name}</span>

        {/* Deadline */}
        <div className="flex items-center gap-2 justify-self-center">
          <div className="flex items-center gap-2 border border-[var(--general-border)] rounded-lg px-3 py-1.5 bg-white min-w-[130px]">
            <Calendar className="w-4 h-4 text-[#525252] shrink-0" />
            <span className="text-sm text-[var(--general-foreground)]">{survey.deadline}</span>
          </div>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 border border-[var(--unofficial-border-3)] rounded-lg px-3 py-1.5 bg-white cursor-pointer hover:bg-[var(--unofficial-ghost-hover)] transition-colors min-w-0">
          <div className="w-5 h-5 rounded-full bg-[#D4D4D4] flex items-center justify-center shrink-0">
            <span className="text-[9px] font-medium text-[#525252]">CN</span>
          </div>
          <span className="text-sm text-[var(--general-foreground)] truncate">
            {survey.assignee}{" "}
            <span className="text-[var(--general-muted-foreground)]">+{survey.extraCount}</span>
          </span>
          <ChevronDown className="w-4 h-4 text-[#525252] shrink-0 ml-auto" />
        </div>
      </div>

      {/* Context Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--unofficial-ghost-hover)] transition-colors text-[#525252] shrink-0">
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>Редактировать</DropdownMenuItem>
          <DropdownMenuItem>Копировать</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="text-red-500 focus:text-red-500 focus:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 size={14} />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
