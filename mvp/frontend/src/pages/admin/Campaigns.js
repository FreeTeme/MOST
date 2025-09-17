import React, { useState } from "react";

const mockCampaigns = [
  { id: 1, title: "Запуск нового продукта", advertiser: "ООО Ромашка", budget: 50000, status: "active", startDate: "2023-04-01", endDate: "2023-04-30" },
  { id: 2, title: "Продвижение бренда", advertiser: "ИП Сидоров", budget: 30000, status: "completed", startDate: "2023-03-15", endDate: "2023-04-15" },
  { id: 3, title: "Сезонная акция", advertiser: "ООО Лютик", budget: 20000, status: "pending", startDate: "2023-05-01", endDate: "2023-05-31" }
];

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [filter, setFilter] = useState("all");

  const filteredCampaigns = filter === "all" 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === filter);

  const changeCampaignStatus = (id, newStatus) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id ? {...campaign, status: newStatus} : campaign
    ));
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: "Активна",
      completed: "Завершена",
      pending: "На рассмотрении"
    };
    return labels[status] || status;
  };

  return (
    <div>
      <h1>Управление кампаниями</h1>
      <p>Модерация и управление рекламными кампаниями</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select 
          className="input"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="all">Все кампании</option>
          <option value="active">Активные</option>
          <option value="completed">Завершенные</option>
          <option value="pending">На рассмотрении</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Рекламодатель</th>
              <th>Бюджет</th>
              <th>Статус</th>
              <th>Даты</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map(campaign => (
              <tr key={campaign.id}>
                <td>{campaign.title}</td>
                <td>{campaign.advertiser}</td>
                <td>{campaign.budget.toLocaleString()} ₽</td>
                <td>
                  <span className={`status ${campaign.status}`}>
                    {getStatusLabel(campaign.status)}
                  </span>
                </td>
                <td>{campaign.startDate} - {campaign.endDate}</td>
                <td>
                  {campaign.status === "pending" && (
                    <>
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => changeCampaignStatus(campaign.id, "active")}
                      >
                        Одобрить
                      </button>
                      <button 
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '5px' }}
                        onClick={() => changeCampaignStatus(campaign.id, "rejected")}
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                  <button 
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '5px' }}
                  >
                    Просмотреть
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}