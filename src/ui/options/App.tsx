import { useMemo, useState } from 'react';
import { MESSAGE_TYPES } from '../../shared/constants';
import type { BackupPayload, ModelConfig } from '../../shared/types';
import { isBackupPayload } from '../../shared/utils/validators';
import { Button } from '../shared/components/atoms/Button';
import { ModelForm, ModelList, useModelConfig } from '../shared/features/modelConfig';
import { RoleForm, RoleList, SiteRuleForm, SiteRuleList, useRoleConfig, useSiteRules } from '../shared/features/siteConfigs';
import '../shared/styles/global.css';

const TABS = ['dashboard', 'models', 'roles', 'siteRules', 'advanced', 'console'] as const;
type TabKey = typeof TABS[number];

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const { models, draft, setDraft, saveModel, editModel, testModel, testState } = useModelConfig();
  const { roles, draft: roleDraft, setDraft: setRoleDraft, saveRole } = useRoleConfig();
  const { siteConfigs, draft: siteDraft, setDraft: setSiteDraft, saveRule, editRule } = useSiteRules();

  const modelOptions = useMemo<ModelConfig[]>(() => models, [models]);

  const exportBackup = async () => {
    const response = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.EXPORT_BACKUP });
    const payload = response.payload as BackupPayload;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `webreader_backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setConsoleLogs((current) => [`[Export] ${payload.exportedAt}`, ...current]);
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    const content = JSON.parse(await file.text()) as unknown;
    if (!isBackupPayload(content)) {
      setConsoleLogs((current) => ['[Import] invalid backup payload', ...current]);
      return;
    }
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.IMPORT_BACKUP, payload: content });
    setConsoleLogs((current) => [`[Import] ${file.name}`, ...current]);
    window.location.reload();
  };

  return (
    <div className="wr-layout">
      <aside className="wr-nav">
        <h2>WebReader AI</h2>
        {TABS.map((tab) => (
          <Button key={tab} tone={activeTab === tab ? 'primary' : 'secondary'} onClick={() => setActiveTab(tab)}>{tab}</Button>
        ))}
      </aside>
      <main className="wr-content">
        {activeTab === 'dashboard' && (
          <div className="wr-grid">
            <section className="wr-panel">
              <h1>总览</h1>
              <p>当前已配置 {models.length} 个模型，{siteConfigs.length} 条站点规则。</p>
              <p>支持 Readability、长图预留位、备份恢复与基础控制台。</p>
            </section>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="wr-grid wr-grid--two">
            <ModelForm draft={draft} providers={['OpenAI', 'Qwen', 'Anthropic', 'Ollama', 'Custom']} onChange={setDraft} onSave={saveModel} onTest={testModel} testState={testState} />
            <ModelList models={models} selectedId={draft.modelId} onEdit={editModel} />
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="wr-grid wr-grid--two">
            <RoleForm draft={roleDraft} onChange={setRoleDraft} onSave={saveRole} />
            <RoleList roles={roles} selectedId={roleDraft.roleId} onEdit={setRoleDraft} />
          </div>
        )}

        {activeTab === 'siteRules' && (
          <div className="wr-grid wr-grid--two">
            <SiteRuleForm draft={siteDraft} roles={roles} models={modelOptions} onChange={setSiteDraft} onSave={saveRule} />
            <SiteRuleList siteConfigs={siteConfigs} selectedId={siteDraft.siteId} onEdit={editRule} />
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="wr-grid">
            <section className="wr-panel">
              <h1>高级设置</h1>
              <p>按照文档要求提供 JSON 备份与恢复，并在导入前执行结构校验。</p>
              <div className="wr-grid wr-grid--two">
                <Button onClick={exportBackup}>导出备份数据</Button>
                <label className="wr-button wr-button--secondary" style={{ textAlign: 'center' }}>
                  导入备份数据
                  <input type="file" accept="application/json" hidden onChange={(event: { target: { files?: FileList | null } }) => void importBackup(event.target.files?.[0])} />
                </label>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="wr-grid">
            <section className="wr-panel" style={{ background: '#020617', color: '#22c55e' }}>
              <h1>Console</h1>
              <p style={{ color: '#f97316' }}>用于记录导入导出与后续网络诊断事件。</p>
              <div className="wr-list">
                {consoleLogs.map((line, index) => <code key={`${line}-${index}`}>{line}</code>)}
                {consoleLogs.length === 0 && <code>[Info] 暂无日志</code>}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
