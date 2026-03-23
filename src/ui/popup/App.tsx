import { useEffect, useState } from 'react';
import { MESSAGE_TYPES } from '../../shared/constants';
import { Button } from '../shared/components/atoms/Button';
import '../shared/styles/global.css';

interface PopupState {
  siteRuleLabel: string;
  enabled: boolean;
  modelId: string;
  roleId: string;
  models: Array<{ modelId: string; modelName: string }>;
  roles: Array<{ roleId: string; roleName: string }>;
  theme: 'light' | 'dark' | 'sepia';
}

export function App() {
  const [state, setState] = useState<PopupState>({
    siteRuleLabel: '未匹配站点规则',
    enabled: true,
    modelId: '',
    roleId: '',
    models: [],
    roles: [],
    theme: 'light'
  });

  useEffect(() => {
    void Promise.all([
      chrome.storage.sync.get(['siteConfigs', 'models', 'roles', 'uiPreferences'])
    ]).then(([result]) => {
      setState({
        siteRuleLabel: result.siteConfigs?.[0]?.matchRule ? `Rule: ${result.siteConfigs[0].matchRule}` : '未匹配站点规则',
        enabled: result.uiPreferences?.sidebarEnabled ?? true,
        modelId: result.uiPreferences?.currentModelId ?? result.models?.[0]?.modelId ?? '',
        roleId: result.uiPreferences?.currentRoleId ?? result.roles?.[0]?.roleId ?? '',
        models: (result.models ?? []).map((model: { modelId: string; modelName: string }) => ({ modelId: model.modelId, modelName: model.modelName })),
        roles: (result.roles ?? []).map((role: { roleId: string; roleName: string }) => ({ roleId: role.roleId, roleName: role.roleName })),
        theme: result.uiPreferences?.theme ?? 'light'
      });
    });
  }, []);

  return (
    <main className="wr-shell" style={{ width: 320 }}>
      <section className="wr-panel">
        <h2>WebReader AI 运行中</h2>
        <p>{state.siteRuleLabel}</p>
      </section>
      <section className="wr-panel wr-grid">
        <label>
          <input type="checkbox" checked={state.enabled} onChange={async (event: { target: { checked: boolean } }) => {
            const uiPreferences = { theme: state.theme, sidebarEnabled: event.target.checked, currentModelId: state.modelId, currentRoleId: state.roleId };
            await chrome.storage.sync.set({ uiPreferences });
            setState((current) => ({ ...current, enabled: event.target.checked }));
          }} /> 在此站点启用插件
        </label>
        <label>
          当前模型：
          <select className="wr-input" value={state.modelId} onChange={async (event: { target: { value: string } }) => {
            const modelId = event.target.value;
            await chrome.storage.sync.set({ uiPreferences: { theme: state.theme, sidebarEnabled: state.enabled, currentModelId: modelId, currentRoleId: state.roleId } });
            setState((current) => ({ ...current, modelId }));
          }}>
            <option value="">未配置</option>
            {state.models.map((model) => <option key={model.modelId} value={model.modelId}>{model.modelName}</option>)}
          </select>
        </label>
        <label>
          当前角色：
          <select className="wr-input" value={state.roleId} onChange={async (event: { target: { value: string } }) => {
            const roleId = event.target.value;
            await chrome.storage.sync.set({ uiPreferences: { theme: state.theme, sidebarEnabled: state.enabled, currentModelId: state.modelId, currentRoleId: roleId } });
            setState((current) => ({ ...current, roleId }));
          }}>
            <option value="">未配置</option>
            {state.roles.map((role) => <option key={role.roleId} value={role.roleId}>{role.roleName}</option>)}
          </select>
        </label>
      </section>
      <section className="wr-grid wr-grid--two">
        <Button onClick={async () => {
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_SIDE_PANEL, tabId: activeTab?.id });
        }}>打开侧边栏阅读</Button>
        <Button tone="secondary" onClick={() => chrome.runtime.openOptionsPage()}>进入详细设置</Button>
      </section>
    </main>
  );
}
