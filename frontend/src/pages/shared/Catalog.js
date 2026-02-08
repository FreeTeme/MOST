import React, { useState, useEffect, useCallback } from "react";
import { catalogConfigs } from "../../utils/roleConfigs";
import { debounce } from "lodash";

export default function Catalog({ entityType, currentUser }) {
  const config = catalogConfigs[entityType];
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Статусы для блогера
  const statuses = ["Все", "Ожидание", "В работе", "Выполненные"];

  // Дебаунс для поиска (обновление через 300ms после последнего ввода)
  const debouncedSearch = useCallback(
    debounce((searchValue, statusValue) => {
      const params = {};
      
      if (searchValue) {
        params.search = searchValue;
      }
      
      if (statusValue !== 'Все') {
        params.status = statusValue;
      }
      
      // Передаём user_id как параметр
      if (entityType === 'products' && currentUser) {
        params.user_id = currentUser.id;
      }
      
      console.log('Making API request with params:', params);
      
      setLoading(true);
      config.apiMethod(params)
        .then(res => {
          setItems(res.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('API Error:', error);
          console.error('Error details:', error.response?.data);
          setLoading(false);
        });
    }, 300),
    [entityType, currentUser, config]
  );

  // Эффект для поиска и фильтрации по статусу
  useEffect(() => {
    debouncedSearch(searchTerm, statusFilter);
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, statusFilter, debouncedSearch]);

  const handleApplication = async (productId) => {
    try {
      const applicationData = {
        product_id: productId,
        user_id: currentUser?.id
      };
      
      const response = await config.actions[1].onClick(applicationData);
      if (response) {
        alert('Заявка отправлена! Теперь кампания в разделе "Ожидание"');
        debouncedSearch(searchTerm, statusFilter);
      }
    } catch (error) {
      alert('Ошибка при отправке заявки: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h1>{config.title}</h1>
      <p>{config.subtitle}</p>

      {/* Статус-бар */}
      <div className="status-bar">
        {statuses.map(st => (
          <div 
            key={st} 
            className={`status-item ${statusFilter === st ? "active" : ""}`} 
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </div>
        ))}
      </div>

      {/* Умный поиск */}
      <div className="search-container">
        <input 
          type="text"
          className="search-input"
          placeholder="Начните вводить название..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <div className="search-loading">Поиск...</div>}
      </div>

      {/* Информация о результатах */}
      <div className="search-info">
        {items.length > 0 ? (
          <p>
            Найдено {items.length} кампаний 
            {statusFilter !== 'Все' && ` в статусе "${statusFilter}"`}
            {searchTerm && ` по запросу "${searchTerm}"`}
          </p>
        ) : searchTerm || statusFilter !== 'Все' ? (
          <p>
            {searchTerm && statusFilter !== 'Все' 
              ? `По запросу "${searchTerm}" в статусе "${statusFilter}" ничего не найдено`
              : searchTerm 
                ? `По запросу "${searchTerm}" ничего не найдено`
                : `В статусе "${statusFilter}" ничего не найдено`
            }
          </p>
        ) : (
          <p>Введите название для поиска или выберите статус</p>
        )}
      </div>

      {/* Сетка карточек */}
      <div className="card-grid">
        {items.map(item => (
          <div key={item.id} className="card product-card">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                borderRadius: "12px", 
                backgroundColor: "#e5e7eb", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "24px", 
                fontWeight: "bold", 
                marginRight: "16px" 
              }}>
                {item[config.cardFields[0]]?.charAt(0) || 'P'}
              </div>
              <div>
                <h3>{item[config.cardFields[0]]}</h3>
                <p>{item[config.cardFields[1]]}</p>
              </div>
            </div>

            {config.cardFields.slice(2).map(field => (
              <p key={field}>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
                {Array.isArray(item[field]) ? item[field].join(', ') : item[field]}
              </p>
            ))}

            {/* Совпадающие ниши (только в статусе "Все") */}
            {statusFilter === 'Все' && item.matching_niches && item.matching_niches.length > 0 && (
              <div className="matching-niches">
                <strong>Подходящие ниши:</strong> {item.matching_niches.join(', ')}
              </div>
            )}

            {/* Статус заявки (для статусов кроме "Все") */}
            {statusFilter !== 'Все' && item.application_status && (
              <div className={`application-status ${item.application_status}`}>
                Статус: { 
                  item.application_status === 'pending' ? 'Ожидание ответа' :
                  item.application_status === 'accepted' ? 'В работе' :
                  item.application_status === 'completed' ? 'Выполнено' : 'Отклонено'
                }
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              {config.actions.map((action, idx) => (
                <button 
                  key={idx} 
                  className={action.class} 
                  onClick={() => idx === 1 ? handleApplication(item.id) : action.onClick?.(item.id)}
                  disabled={statusFilter !== 'Все' && idx === 1}
                >
                  {statusFilter !== 'Все' && idx === 1 ? 'Заявка отправлена' : action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (searchTerm || statusFilter !== 'Все') && (
        <div className="card empty-card">
          <h3>Не найдено</h3>
          <p>Попробуйте изменить поисковый запрос или выбрать другой статус</p>
        </div>
      )}
    </div>
  );
}