import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ControlTowerFilterState } from "@shared/types";

type FilterKey = keyof ControlTowerFilterState;

interface FilterContextValue {
  filters: ControlTowerFilterState;
  setFilters: (updater: (prev: ControlTowerFilterState) => ControlTowerFilterState) => void;
  setFilter: <K extends FilterKey>(key: K, value: ControlTowerFilterState[K]) => void;
  clearFilters: () => void;
  removeFilter: (key: FilterKey) => void;
}

const DEFAULT_FILTERS: ControlTowerFilterState = {
  period: "30d",
  alertSeverity: "all",
};

const FILTER_KEYS: Array<FilterKey> = [
  "period",
  "dateFrom",
  "dateTo",
  "channel",
  "professional",
  "procedure",
  "status",
  "pipeline",
  "unit",
  "alertSeverity",
];

const ControlTowerFilterContext = createContext<FilterContextValue | undefined>(undefined);

function normalizeMaybe(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "all") return undefined;
  return trimmed;
}

function parseSearch(search: string): ControlTowerFilterState {
  const params = new URLSearchParams(search);
  const period = params.get("period");
  const parsed: ControlTowerFilterState = {
    period: period === "7d" || period === "30d" || period === "90d" || period === "12m" || period === "custom" ? period : "30d",
    dateFrom: normalizeMaybe(params.get("dateFrom")),
    dateTo: normalizeMaybe(params.get("dateTo")),
    channel: normalizeMaybe(params.get("channel")),
    professional: normalizeMaybe(params.get("professional")),
    procedure: normalizeMaybe(params.get("procedure")),
    status: normalizeMaybe(params.get("status")),
    pipeline: normalizeMaybe(params.get("pipeline")),
    unit: normalizeMaybe(params.get("unit")),
    alertSeverity: (params.get("severity") as ControlTowerFilterState["alertSeverity"]) ?? "all",
  };
  if (parsed.alertSeverity !== "P1" && parsed.alertSeverity !== "P2" && parsed.alertSeverity !== "P3") {
    parsed.alertSeverity = "all";
  }
  return parsed;
}

function buildSearch(filters: ControlTowerFilterState): string {
  const params = new URLSearchParams();
  params.set("period", filters.period);
  if (filters.period === "custom" && filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.period === "custom" && filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.channel) params.set("channel", filters.channel);
  if (filters.professional) params.set("professional", filters.professional);
  if (filters.procedure) params.set("procedure", filters.procedure);
  if (filters.status) params.set("status", filters.status);
  if (filters.pipeline) params.set("pipeline", filters.pipeline);
  if (filters.unit) params.set("unit", filters.unit);
  if (filters.alertSeverity && filters.alertSeverity !== "all") params.set("severity", filters.alertSeverity);
  const query = params.toString();
  return query.length > 0 ? `?${query}` : "";
}

export function ControlTowerFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<ControlTowerFilterState>(() => {
    if (typeof window === "undefined") return DEFAULT_FILTERS;
    return {
      ...DEFAULT_FILTERS,
      ...parseSearch(window.location.search),
    };
  });

  const setFilters = useCallback((updater: (prev: ControlTowerFilterState) => ControlTowerFilterState) => {
    setFiltersState(prev => updater(prev));
  }, []);

  const setFilter = useCallback(<K extends FilterKey>(key: K, value: ControlTowerFilterState[K]) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const removeFilter = useCallback((key: FilterKey) => {
    setFiltersState(prev => {
      if (key === "period") {
        return { ...DEFAULT_FILTERS };
      }
      const next = { ...prev };
      (next as any)[key] = undefined;
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = buildSearch(filters);
    const nextUrl = `${window.location.pathname}${search}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [filters]);

  const value = useMemo<FilterContextValue>(
    () => ({
      filters,
      setFilters,
      setFilter,
      clearFilters,
      removeFilter,
    }),
    [filters, setFilter, setFilters, clearFilters, removeFilter],
  );

  return (
    <ControlTowerFilterContext.Provider value={value}>
      {children}
    </ControlTowerFilterContext.Provider>
  );
}

export function useControlTowerFilterContext() {
  const context = useContext(ControlTowerFilterContext);
  if (!context) throw new Error("useControlTowerFilterContext must be used within ControlTowerFilterProvider");
  return context;
}

export function getFilterKeys(): Array<FilterKey> {
  return FILTER_KEYS;
}
