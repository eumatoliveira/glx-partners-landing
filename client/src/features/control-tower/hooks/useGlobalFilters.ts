import { useMemo } from "react";
import type { ControlTowerFilterState } from "@shared/types";
import { getFilterKeys, useControlTowerFilterContext } from "../state/ControlTowerFilterContext";

export interface FilterChip {
  key: keyof ControlTowerFilterState;
  value: string;
}

export function useGlobalFilters() {
  const context = useControlTowerFilterContext();

  const chips = useMemo<FilterChip[]>(() => {
    const list: FilterChip[] = [];
    const keys = getFilterKeys();

    keys.forEach(key => {
      const value = context.filters[key];
      if (!value) return;
      if (key === "period" && value === "30d") return;
      if (key === "alertSeverity" && value === "all") return;
      list.push({ key, value: String(value) });
    });

    return list;
  }, [context.filters]);

  return {
    ...context,
    chips,
  };
}
