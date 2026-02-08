import React, { useState, useEffect } from "react";
import { entityManagerConfigs } from "../../configs/roleConfigs";
import { useAuth } from "../../contexts/AuthContext";

const SocialsEntityManager = () => {
  const { user } = useAuth();
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [formData, setFormData] = useState({});

  const config = entityManagerConfigs.socials;

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const response = await config.apiMethods.get({ user_id: user.id });
      setEntities(response.data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке социальных сетей");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        user_id: user.id,
        followers: parseInt(formData.followers),
        price: parseInt(formData.price)
      };

      if (currentEntity) {
        await config.apiMethods.update(currentEntity.id, data);
      } else {
        await config.apiMethods.add(data);
      }

      setIsModalOpen(false);
      setCurrentEntity(null);
      setFormData({});
      fetchEntities();
    } catch (err) {
      setError("Ошибка при сохранении");
      console.error(err);
    }
  };

  const handleEdit = (entity) => {
    setCurrentEntity(entity);
    setFormData({
      platform: entity.platform,
      followers: entity.followers,
      region: entity.region,
      price: entity.price,
      link: entity.link,
      niches: Array.isArray(entity.niches) ? entity.niches.join(', ') : entity.niches
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту социальную сеть?")) {
      try {
        await config.apiMethods.delete(id);
        fetchEntities();
      } catch (err) {
        setError("Ошибка при удалении");
        console.error(err);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>{config.title}</h1>
          <p style={{ color: '#666' }}>{config.subtitle}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setCurrentEntity(null);
            setFormData({});
            setIsModalOpen(true);
          }}
        >
          Добавить социальную сеть
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div className="card-grid">
        {entities.map(entity => (
          <div key={entity.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{entity.platform}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{entity.region}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => handleEdit(entity)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => handleDelete(entity.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <p><strong>Подписчики:</strong> {entity.followers?.toLocaleString() || '0'}</p>
              <p><strong>Цена:</strong> {entity.price?.toLocaleString() || '0'} ₽</p>
              <p><strong>Ссылка:</strong> 
                <a href={entity.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px' }}>
                  Перейти
                </a>
              </p>
              <p><strong>Ниши:</strong> {Array.isArray(entity.niches) ? entity.niches.join(', ') : entity.niches}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для добавления/редактирования */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>{currentEntity ? 'Редактировать' : 'Добавить'} социальную сеть</h2>
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {config.formFields.map(field => (
                  <div key={field.name} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
                    <label className="label">
                      {field.label}
                      {field.required && <span style={{ color: 'red' }}> *</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        className="input"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                      >
                        {field.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="input"
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        rows={field.rows || 3}
                        required={field.required}
                        placeholder={field.placeholder || ''}
                      />
                    ) : (
                      <input
                        className="input"
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        placeholder={field.placeholder || ''}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  {currentEntity ? 'Сохранить изменения' : 'Добавить'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialsEntityManager;