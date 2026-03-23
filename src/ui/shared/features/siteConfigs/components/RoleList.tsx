import type { RoleConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';

interface RoleListProps {
  roles: RoleConfig[];
  selectedId?: string;
  onEdit: (role: RoleConfig) => void;
}

export function RoleList({ roles, selectedId, onEdit }: RoleListProps) {
  return (
    <div className="wr-panel">
      <h3>角色管理</h3>
      <div className="wr-list">
        {roles.map((role) => (
          <button key={role.roleId} type="button" className={`wr-card wr-card--interactive ${selectedId === role.roleId ? 'wr-card--active' : ''}`.trim()} onClick={() => onEdit(role)}>
            <strong>{role.icon} {role.roleName}</strong>
            <p>{role.prompts}</p>
            <Button tone="secondary" type="button" onClick={(event: { stopPropagation: () => void }) => {
              event.stopPropagation();
              onEdit(role);
            }}>编辑</Button>
          </button>
        ))}
        {roles.length === 0 && <p>暂无角色。</p>}
      </div>
    </div>
  );
}
