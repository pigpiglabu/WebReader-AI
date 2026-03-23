import type { ChangeEvent } from 'react';
import type { RoleConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';
import { Input, TextArea } from '../../../components/atoms/Input';

interface RoleFormProps {
  draft: RoleConfig;
  onChange: (value: RoleConfig) => void;
  onSave: () => void;
}

export function RoleForm({ draft, onChange, onSave }: RoleFormProps) {
  const update = (key: keyof RoleConfig) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...draft, [key]: event.target.value });
  };

  return (
    <div className="wr-panel wr-grid">
      <h3>角色编辑</h3>
      <Input placeholder="角色名称" value={draft.roleName} onChange={update('roleName')} />
      <Input placeholder="Icon / Emoji" value={draft.icon} onChange={update('icon')} />
      <TextArea placeholder="System Prompt" value={draft.prompts} onChange={update('prompts')} />
      <Button onClick={onSave}>保存角色</Button>
    </div>
  );
}
