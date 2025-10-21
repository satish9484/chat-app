import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    systemName: 'Chat App',
    maxUsers: 1000,
    maxMessagesPerChat: 10000,
    allowImageUploads: true,
    allowFileUploads: false,
    maintenanceMode: false,
    autoDeleteOldMessages: false,
    messageRetentionDays: 30,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real application, you would save these to Firebase or your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (
      window.confirm('Are you sure you want to reset all settings to default?')
    ) {
      setSettings({
        systemName: 'Chat App',
        maxUsers: 1000,
        maxMessagesPerChat: 10000,
        allowImageUploads: true,
        allowFileUploads: false,
        maintenanceMode: false,
        autoDeleteOldMessages: false,
        messageRetentionDays: 30,
        emailNotifications: true,
        pushNotifications: true,
      });
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>System Settings</h2>
        <div className="settings-actions">
          <button onClick={handleResetSettings} className="btn-secondary">
            Reset to Default
          </button>
          <button
            onClick={handleSaveSettings}
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>System Name</label>
              <input
                type="text"
                value={settings.systemName}
                onChange={e =>
                  handleSettingChange('systemName', e.target.value)
                }
              />
            </div>

            <div className="setting-item">
              <label>Maximum Users</label>
              <input
                type="number"
                value={settings.maxUsers}
                onChange={e =>
                  handleSettingChange('maxUsers', parseInt(e.target.value))
                }
                min="1"
                max="10000"
              />
            </div>

            <div className="setting-item">
              <label>Max Messages per Chat</label>
              <input
                type="number"
                value={settings.maxMessagesPerChat}
                onChange={e =>
                  handleSettingChange(
                    'maxMessagesPerChat',
                    parseInt(e.target.value)
                  )
                }
                min="100"
                max="100000"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Feature Settings</h3>
          <div className="settings-grid">
            <div className="setting-item toggle">
              <label>Allow Image Uploads</label>
              <input
                type="checkbox"
                checked={settings.allowImageUploads}
                onChange={e =>
                  handleSettingChange('allowImageUploads', e.target.checked)
                }
              />
            </div>

            <div className="setting-item toggle">
              <label>Allow File Uploads</label>
              <input
                type="checkbox"
                checked={settings.allowFileUploads}
                onChange={e =>
                  handleSettingChange('allowFileUploads', e.target.checked)
                }
              />
            </div>

            <div className="setting-item toggle">
              <label>Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e =>
                  handleSettingChange('emailNotifications', e.target.checked)
                }
              />
            </div>

            <div className="setting-item toggle">
              <label>Push Notifications</label>
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={e =>
                  handleSettingChange('pushNotifications', e.target.checked)
                }
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>System Settings</h3>
          <div className="settings-grid">
            <div className="setting-item toggle">
              <label>Maintenance Mode</label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={e =>
                  handleSettingChange('maintenanceMode', e.target.checked)
                }
              />
              <small>When enabled, only admins can access the system</small>
            </div>

            <div className="setting-item toggle">
              <label>Auto Delete Old Messages</label>
              <input
                type="checkbox"
                checked={settings.autoDeleteOldMessages}
                onChange={e =>
                  handleSettingChange('autoDeleteOldMessages', e.target.checked)
                }
              />
            </div>

            <div className="setting-item">
              <label>Message Retention (Days)</label>
              <input
                type="number"
                value={settings.messageRetentionDays}
                onChange={e =>
                  handleSettingChange(
                    'messageRetentionDays',
                    parseInt(e.target.value)
                  )
                }
                min="1"
                max="365"
                disabled={!settings.autoDeleteOldMessages}
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Security Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Session Timeout (Minutes)</label>
              <input type="number" defaultValue="60" min="5" max="480" />
            </div>

            <div className="setting-item">
              <label>Max Login Attempts</label>
              <input type="number" defaultValue="5" min="3" max="10" />
            </div>

            <div className="setting-item toggle">
              <label>Require Email Verification</label>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="setting-item toggle">
              <label>Enable Two-Factor Authentication</label>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <div className="warning-box">
          <h4>⚠️ Important Notes</h4>
          <ul>
            <li>Changes to system settings may affect all users</li>
            <li>
              Maintenance mode will prevent non-admin users from accessing the
              system
            </li>
            <li>Auto-deleting messages cannot be undone</li>
            <li>Some settings require a system restart to take effect</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
