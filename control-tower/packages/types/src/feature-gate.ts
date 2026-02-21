export const PLAN_FEATURES = {
  ESSENTIALS: ['AGENDA', 'FINANCEIRO', 'OPS'],
  PRO: ['AGENDA', 'FINANCEIRO', 'OPS', 'MARKETING', 'DRE', 'ALERTS_PRIORITY'],
  ENTERPRISE: ['ALL']
}

export function hasFeature(plan: string, feature: string) {
  if (plan === 'ENTERPRISE') return true
  return PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES]?.includes(feature) || false;
}
