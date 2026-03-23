import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SiteConfig } from '../../../../../shared/types';
import { useStorageHelper } from '../../../hooks/useStorageHelper';

const defaultRule: SiteConfig = {
  siteId: '',
  matchType: 'domain',
  matchRule: '',
  defaultRoleId: '',
  defaultModelId: '',
  analysisMethod: 'readability',
  autoActions: []
};

export const useSiteRules = () => {
  const { getSync, setSync } = useStorageHelper();
  const [siteConfigs, setSiteConfigs] = useState<SiteConfig[]>([]);
  const [draft, setDraft] = useState<SiteConfig>(defaultRule);

  useEffect(() => {
    void getSync('siteConfigs').then((siteRules) => {
      setSiteConfigs(siteRules ?? []);
    });
  }, [getSync]);

  const editRule = (rule: SiteConfig) => setDraft(rule);

  const saveRule = async () => {
    const nextRule = { ...draft, siteId: draft.siteId || uuidv4() };
    const nextRules = siteConfigs.some((rule) => rule.siteId === nextRule.siteId)
      ? siteConfigs.map((rule) => (rule.siteId === nextRule.siteId ? nextRule : rule))
      : [...siteConfigs, nextRule];
    setSiteConfigs(nextRules);
    await setSync('siteConfigs', nextRules);
    setDraft(defaultRule);
  };

  return { siteConfigs, draft, setDraft, saveRule, editRule };
};
