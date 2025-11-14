// pages/shared/EntityManager.js
import React, { useState, useEffect } from "react";
import { entityManagerConfigs } from "../../utils/roleConfigs";

export default function EntityManager({ entityType }) {
  const config = entityManagerConfigs[entityType];
  const [entities, setEntities] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(config.formFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));

  useEffect(() => {
    config.apiMethods.get().then(res => setEntities(res.data)).catch(console.error);
  }, [entityType]);

  const handleChange = (e, name) => setFormData({ ...formData, [name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await config.apiMethods.add(formData).catch(console.error);
    if (res) {
      setEntities([...entities, res.data]);
      setFormData(config.formFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    await config.apiMethods.delete?.(id).catch(console.error);
    setEntities(entities.filter(e => e.id !== id));
  };

  return (
    <div>
      <h1>{config.title}</h1>
      <p>{config.subtitle}</p>

      {/* Stats cards если нужно, как в Socials */}

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Мои {entityType}</h2>
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            Добавить
          </button>
        </div>

        {isAdding && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>Добавить новый</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {config.formFields.map(field => (
                  <div key={field.name}>
                    <label className="label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea className="input" rows={field.rows} value={formData[field.name]} onChange={(e) => handleChange(e, field.name)} />
                    ) : (
                      <input
                        type={field.type}
                        step={field.step}
                        className="input"
                        value={formData[field.name]}
                        onChange={(e) => handleChange(e, field.name)}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary">Сохранить</button>
                <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Отмена</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-grid">
          {entities.map(entity => (
            <div key={entity.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{entity[config.cardFields[0]]}</h3> {/* Первый field как title */}
                {config.apiMethods.delete && (
                  <button className="btn btn-outline" onClick={() => handleDelete(entity.id)}>Удалить</button>
                )}
              </div>
              {config.cardFields.slice(1).map(field => (
                <p key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}: {entity[field]}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}