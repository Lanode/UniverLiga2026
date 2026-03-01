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
import ReviewChart from "./review-chart";

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="max-w-xs">
                  <Label className="text-sm font-medium mb-2 block">Отдел</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберете необходимый отдел" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dept1">Отдел 1</SelectItem>
                      <SelectItem value="dept2">Отдел 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="max-w-xs">
                  <Label className="text-sm font-medium mb-2 block">Сотрудники</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee} disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберете необходимого сотрудника" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp1">Сотрудник 1</SelectItem>
                      <SelectItem value="emp2">Сотрудник 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="max-w-xs">
                  <Label className="text-sm font-medium mb-2 block">Начало</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#525252] w-4 h-4 pointer-events-none"/>
                    <Input
                      type="text"
                      placeholder="ДД.ММ.ГГГГ"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="max-w-xs">
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
                <div className="max-w-xs">
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
                <ReviewChart data={[{label: '1', value: 10}]} header="Количество отзывов по выбранному периоду"></ReviewChart>

                <ReviewChart data={[{label: '1', value: 100}]} header="Статистика положительных и отрицательных отзывов"></ReviewChart>
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
