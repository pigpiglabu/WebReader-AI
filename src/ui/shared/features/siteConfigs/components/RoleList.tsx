import type { RoleConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';

interface RoleListProps {
  roles: RoleConfig[];
  onEdit: (role: RoleConfig) => void;
}

export function RoleList({ roles, onEdit }: RoleListProps) {
  return (
    <div className="wr-panel">
      <h3>角色管理</h3>
      <div className="wr-list">
        {roles.map((role) => (
          <div key={role.roleId} className="wr-card">
            <strong>{role.icon} {role.roleName}</strong>
            <p>{role.prompts}</p>
            <Button tone="secondary" onClick={() => onEdit(role)}>编辑</Button>
          </div>
        ))}
        {roles.length === 0 && <p>暂无角色。</p>}
      </div>
    </div>
  );
}
