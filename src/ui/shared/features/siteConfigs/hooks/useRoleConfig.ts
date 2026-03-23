import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { RoleConfig } from '../../../../../shared/types';
import { useStorageHelper } from '../../../hooks/useStorageHelper';

const defaultRole: RoleConfig = {
  roleId: '',
  roleName: '网页总结专家',
  icon: '🧠',
  prompts: '请基于给定网页内容输出重点摘要、风险提示与下一步建议。'
};

export const useRoleConfig = () => {
  const { getSync, setSync } = useStorageHelper();
  const [roles, setRoles] = useState<RoleConfig[]>([]);
  const [draft, setDraft] = useState<RoleConfig>(defaultRole);

  useEffect(() => {
    void getSync('roles').then((result) => setRoles(result ?? [defaultRole]));
  }, [getSync]);

  const saveRole = async () => {
    const nextRole = { ...draft, roleId: draft.roleId || uuidv4() };
    const nextRoles = roles.some((role) => role.roleId === nextRole.roleId)
      ? roles.map((role) => (role.roleId === nextRole.roleId ? nextRole : role))
      : [...roles, nextRole];

    setRoles(nextRoles);
    await setSync('roles', nextRoles);
    setDraft(defaultRole);
  };

  return { roles, draft, setDraft, saveRole };
};
