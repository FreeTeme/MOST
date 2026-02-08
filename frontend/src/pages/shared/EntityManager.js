// pages/shared/EntityManager.js
import React, { useState, useEffect } from "react";
import { entityManagerConfigs } from "../../utils/roleConfigs";

export default function EntityManager({ entityType, currentUser }) {
  const config = entityManagerConfigs[entityType];
  const [entities, setEntities] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("Все");

  // Инициализация формы
  const initFormData = () => {
    const initialData = config.formFields.reduce((acc, field) => ({ 
      ...acc, 
      [field.name]: field.type === 'select' ? '' : '' 
    }), {});
    setFormData(initialData);
  };

  // Загрузка данных
  useEffect(() => {
    loadEntities();
    initFormData();
  }, [entityType]);

  useEffect(() => {
    filterEntities();
  }, [entities, selectedPlatform]);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (entityType === 'socials' && currentUser) {
        params.user_id = currentUser.id;
      }
      
      const response = await config.apiMethods.get(params);
      setEntities(response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setEntities([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEntities = () => {
    let filtered = [...entities];

    // Фильтр по платформе
    if (selectedPlatform !== "Все") {
      filtered = filtered.filter(entity => 
        entity.platform?.toLowerCase().includes(selectedPlatform.toLowerCase())
      );
    }

    setFilteredEntities(filtered);
  };

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let dataToSubmit = { ...formData };
      
      if (entityType === 'socials') {
        if (currentUser && !editingEntity) {
          dataToSubmit.user_id = currentUser.id;
        }
        
        if (dataToSubmit.niches) {
          dataToSubmit.niches = dataToSubmit.niches
            .split(',')
            .map(niche => niche.trim())
            .filter(niche => niche.length > 0);
        } else {
          dataToSubmit.niches = [];
        }
        
        dataToSubmit.followers = parseInt(dataToSubmit.followers) || 0;
        dataToSubmit.price = parseInt(dataToSubmit.price) || 0;
      }

      if (editingEntity) {
        await config.apiMethods.update(editingEntity.id, dataToSubmit);
      } else {
        await config.apiMethods.add(dataToSubmit);
      }
      
      await loadEntities();
      resetForm();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка сохранения данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить?')) return;
    
    setLoading(true);
    try {
      await config.apiMethods.delete(id);
      await loadEntities();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entity) => {
    setEditingEntity(entity);
    
    let formDataToSet = { ...entity };
    
    if (entityType === 'socials' && entity.niches) {
      formDataToSet.niches = Array.isArray(entity.niches) 
        ? entity.niches.join(', ') 
        : entity.niches;
    }
    
    setFormData(formDataToSet);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingEntity(null);
    setIsFormOpen(false);
    initFormData();
  };

  // Функция для рендеринга поля ввода
  const renderFormField = (field) => {
    const commonProps = {
      className: "input",
      value: formData[field.name] || '',
      onChange: (e) => handleChange(e, field.name),
      disabled: loading,
      required: field.required
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={field.rows} />;
      
      case 'select':
        return (
          <select {...commonProps}>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={field.type}
            step={field.step}
            {...commonProps}
          />
        );
    }
  };

  return (
    <div>
      <h1>{config.title}</h1>
      <p>{config.subtitle}</p>

      <div style={{ marginTop: '32px' }}>
        {/* Панель управления */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          {/* Фильтр по платформе */}
          {entityType === 'socials' && config.platforms && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {config.platforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={selectedPlatform === platform ? "btn btn-primary" : "btn btn-outline"}
                  style={{ 
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  {platform}
                </button>
              ))}
            </div>
          )}

          <button 
            className="btn btn-primary" 
            onClick={() => setIsFormOpen(true)}
            disabled={loading}
          >
            Добавить
          </button>
        </div>

        {/* Форма добавления/редактирования */}
        {isFormOpen && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>{editingEntity ? 'Редактировать' : 'Добавить новый'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {config.formFields.map(field => (
                  <div key={field.name}>
                    <label className="label">
                      {field.label}
                      {field.required && <span style={{ color: 'red' }}> *</span>}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : (editingEntity ? 'Обновить' : 'Сохранить')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={resetForm}
                  disabled={loading}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Горизонтальная лента карточек */}
        {loading && !isFormOpen ? (
          <div>Загрузка...</div>
        ) : (
          <div>
            {filteredEntities.length === 0 ? (
              <div className="card">
                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                  {selectedPlatform !== "Все" 
                    ? `Нет социальных сетей для платформы ${selectedPlatform}` 
                    : 'Пока социальных сетей не добавлено'
                  }
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '20px',
                overflowX: 'auto',
                padding: '10px 0',
                scrollbarWidth: 'thin'
              }}>
                {filteredEntities.map(entity => (
                  <div 
                    key={entity.id}
                    className="card"
                    style={{
                      flex: '0 0 auto',
                      width: '300px',
                      minHeight: '200px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{entity.platform}</h3>
                        <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>{entity.region}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleEdit(entity)}
                          disabled={loading}
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                        >
                          Ред.
                        </button>
                        {config.apiMethods.delete && (
                          <button 
                            className="btn btn-outline" 
                            onClick={() => handleDelete(entity.id)}
                            disabled={loading}
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                          >
                            Уд.
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Подписчики</div>
                        <div style={{ fontWeight: 'bold' }}>{entity.followers}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Цена</div>
                        <div style={{ fontWeight: 'bold' }}>{entity.price} ₽</div>
                      </div>
                    </div>

                    {entity.engagement && (
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>ER: {entity.engagement}%</div>
                      </div>
                    )}

                    {entity.niches && (
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>Ниши:</div>
                        <div style={{ fontSize: '12px' }}>
                          {Array.isArray(entity.niches) ? entity.niches.join(', ') : entity.niches}
                        </div>
                      </div>
                    )}

                    {entity.link && (
                      <a 
                        href={entity.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#007bff' }}
                      >
                        Перейти к профилю
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}