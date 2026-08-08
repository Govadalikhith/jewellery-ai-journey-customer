import { query } from '../config/db.js';
import { logAuditEvent } from '../middleware/audit.js';

export const SettingsService = {
  async getAllSettings() {
    const res = await query(`SELECT * FROM configuration ORDER BY config_key ASC`);
    return res.rows.map(r => ({
      ...r,
      config_value: typeof r.config_value === 'string' ? JSON.parse(r.config_value) : r.config_value
    }));
  },

  async updateSetting(configKey, configValue, actorUser) {
    const prevRes = await query(`SELECT * FROM configuration WHERE config_key = $1`, [configKey]);
    const prev = prevRes.rows.length > 0 ? prevRes.rows[0] : null;

    await query(
      `INSERT INTO configuration (id, config_key, config_value, updated_by_id, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (config_key) DO UPDATE 
       SET config_value = EXCLUDED.config_value, updated_by_id = EXCLUDED.updated_by_id, updated_at = CURRENT_TIMESTAMP`,
      [`cfg_${configKey}`, configKey, JSON.stringify(configValue), actorUser?.id || null]
    );

    if (actorUser) {
      await logAuditEvent({
        actorId: actorUser.id,
        actorName: `${actorUser.first_name} ${actorUser.last_name}`,
        actorRole: actorUser.role,
        action: 'SYSTEM_SETTING_CHANGE',
        entityType: 'configuration',
        entityId: configKey,
        previousValue: prev?.config_value,
        newValue: configValue
      });
    }

    return { success: true, configKey, configValue };
  }
};
