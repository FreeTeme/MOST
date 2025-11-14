// utils/roleConfigs.js
import { 
  getCatalogBloggers, 
  applyToProduct, 
  getCatalogProducts, 
  addProduct, 
  getProducts, 
  deleteSocial, 
  addSocial,
  getSocials, 
  getReviews,
  getLimitedReviews,  // Используем новый метод
  getAdminAnalytics,
  getProfileStats
} from "../services/api";

export const dashboardConfigs = {
  blogger: {
    title: 'Панель блогера',
    subtitle: 'Обзор вашей активности и статистика',
    stats: [
      { 
        key: 'followers', 
        label: 'Подписчики', 
        fetch: async () => 1000 // Временное mock значение
      },
      { 
        key: 'er', 
        label: 'Средний ER', 
        fetch: async () => 4.5, // Временное mock значение
        suffix: '%' 
      },
      { 
        key: 'views', 
        label: 'Показы карточки', 
        fetch: async () => 500 // Временное mock значение
      },
      { 
        key: 'averageRating', 
        label: 'Средняя оценка', 
        fetch: async () => 4.2, // Временное mock значение
        suffix: ' ⭐' 
      },
    ],
    sections: ['socials', 'reviews']
  },
  advertiser: {
    title: 'Панель рекламодателя',
    subtitle: 'Обзор вашей активности и статистика',
    stats: [
      {
        key: 'total_products',
        label: 'Кампании',
        fetch: async () => 3 // Временное mock значение
      },
      {
        key: 'applications',
        label: 'Заявки',
        fetch: async () => 12 // Временное mock значение
      }
    ],
    sections: ['products']
  },
  admin: {
    title: 'Админ Панель',
    subtitle: 'Обзор системы',
    stats: [
      { 
        key: 'total_users', 
        label: 'Всего пользователей', 
        fetch: async () => 150 // Временное mock значение
      },
      { 
        key: 'avg_er', 
        label: 'Средний ER', 
        fetch: async () => 3.8, // Временное mock значение
        suffix: '%' 
      },
    ],
    sections: []
  }
};

export const entityManagerConfigs = {
  socials: { // Для blogger
    title: 'Социальные сети',
    subtitle: 'Управление вашими социальными сетями и аналитика',
    apiMethods: { get: getSocials, add: addSocial, delete: deleteSocial },
    formFields: [
      { name: 'platform', label: 'Платформа', type: 'text' },
      { name: 'followers', label: 'Подписчики', type: 'number' },
      { name: 'engagement', label: 'ER (%)', type: 'number', step: '0.1' },
      { name: 'price', label: 'Цена (₽)', type: 'number' },
      { name: 'category', label: 'Категория', type: 'text' },
      { name: 'link', label: 'Ссылка', type: 'url' },
    ],
    cardFields: ['platform', 'followers', 'engagement', 'price', 'category', 'link'] // Для рендеринга в карточке
  },
  products: { // Для advertiser
    title: 'Кампании',
    subtitle: 'Управление рекламными кампаниями и заявками',
    apiMethods: { get: getProducts, add: addProduct },
    formFields: [
      { name: 'name', label: 'Название кампании', type: 'text' },
      { name: 'description', label: 'Описание', type: 'textarea', rows: 3 },
      { name: 'budget', label: 'Бюджет (₽)', type: 'number' },
    ],
    cardFields: ['name', 'status', 'responses', 'views']
  }
};

export const catalogConfigs = {
  products: { // Для blogger
    title: 'Каталог товаров',
    subtitle: 'Выберите товары для вашей кампании',
    apiMethod: getCatalogProducts,
    filters: { status: true, category: true }, // Включаем фильтры
    categories: ["all", "Красота", "Спорт", "Еда", "Техника"],
    cardFields: ['name', 'brand', 'budget', 'category', 'deadline', 'status'],
    actions: [{ label: 'Подробнее', class: 'btn btn-blue' }, { label: 'Откликнуться', class: 'btn btn-outline', onClick: (id) => applyToProduct({ product_id: id }) }]
  },
  bloggers: { // Для advertiser
    title: 'Каталог блогеров',
    subtitle: 'Найдите подходящих блогеров для вашей кампании',
    apiMethod: getCatalogBloggers,
    filters: { status: true, category: true, search: true, minFollowers: true, maxPrice: true },
    categories: ["all", "Красота", "Уход", "Техника", "Гаджеты", "Еда", "Рецепты", "Спорт", "Фитнес"],
    cardFields: ['name', 'followers', 'er', 'price', 'categories'],
    actions: [{ label: 'Подробнее', class: 'btn btn-blue' }, { label: 'Предложить сотрудничество', class: 'btn btn-outline' }]
  }
};