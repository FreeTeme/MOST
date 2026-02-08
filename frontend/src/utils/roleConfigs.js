import { 
  getCatalogBloggers, 
  applyToProduct, 
  getCatalogProducts, 
  addProduct, 
  updateProduct,
  getProducts, 
  deleteSocial, 
  addSocial,
  updateSocial,
  getSocials, 
  getReviews,
  getLimitedReviews,
  getAdminAnalytics
} from "../services/api";

// utils/roleConfigs.js
export const dashboardConfigs = {
  blogger: {
    title: 'Панель блогера',
    subtitle: '',
    sections: ['socials', 'reviews']
  },
  advertiser: {
    title: 'Панель рекламодателя',
    subtitle: 'Обзор вашей активности и статистика',
    stats: [
      {
        key: 'total_products',
        label: 'Кампании',
        fetch: async () => 3
      },
      {
        key: 'applications',
        label: 'Заявки',
        fetch: async () => 12
      }
    ],
    sections: ['products'] // Убедитесь, что эта секция есть
  },
  admin: {
    title: 'Админ Панель',
    subtitle: 'Обзор системы',
    stats: [
      { 
        key: 'total_users', 
        label: 'Всего пользователей', 
        fetch: async () => 150
      },
      { 
        key: 'avg_er', 
        label: 'Средний ER', 
        fetch: async () => 3.8,
        suffix: '%' 
      },
    ],
    sections: []
  }
};

export const entityManagerConfigs = {
  socials: {
    title: 'Мои социальные сети',
    subtitle: 'Управляйте вашими социальными сетями и отслеживайте статистику',
    apiMethods: { 
      get: getSocials, 
      add: addSocial, 
      update: updateSocial,
      delete: deleteSocial 
    },
    formFields: [
      { 
        name: 'platform', 
        label: 'Платформа', 
        type: 'select', 
        required: true,
        options: [
          { value: '', label: 'Выберите платформу' },
          { value: 'Instagram', label: 'Instagram' },
          { value: 'TikTok', label: 'TikTok' },
          { value: 'YouTube', label: 'YouTube' },
          { value: 'VK', label: 'VK' }
        ]
      },
      { name: 'followers', label: 'Подписчики', type: 'number', required: true },
      { 
        name: 'region', 
        label: 'Регион', 
        type: 'select', 
        required: true,
        options: [
          { value: '', label: 'Выберите регион' },
          { value: 'Весь мир', label: 'Весь мир' },
          { value: 'Беларусь', label: 'Беларусь' },
          { value: 'СНГ', label: 'СНГ' },
          { value: 'Европа', label: 'Европа' },
          { value: 'Азия', label: 'Азия' }
        ]
      },
      { name: 'price', label: 'Цена размещения (₽)', type: 'number', required: true },
      { name: 'link', label: 'Ссылка на профиль', type: 'url', required: true },
      { name: 'niches', label: 'Ниши (через запятую)', type: 'text', placeholder: 'красота, мода, lifestyle' },
    ],
    cardFields: ['platform', 'followers', 'region', 'price', 'link', 'niches'],
    platforms: ['Все', 'Instagram', 'TikTok', 'YouTube', 'VK']
  },
  products: {
    title: 'Мои кампании',
    subtitle: 'Управление рекламными кампаниями и заявками блогеров',
    apiMethods: { 
      get: getProducts, 
      add: addProduct, 
      update: updateProduct,
      delete: null 
    },
    formFields: [
      { name: 'name', label: 'Название кампании', type: 'text', required: true },
      { name: 'description', label: 'Описание', type: 'textarea', rows: 3, required: true },
      { name: 'budget', label: 'Бюджет (₽)', type: 'number', required: true },
      { 
        name: 'category', 
        label: 'Категория', 
        type: 'select', 
        required: true,
        options: [
          { value: '', label: 'Выберите категорию' },
          { value: 'Красота', label: 'Красота' },
          { value: 'Спорт', label: 'Спорт' },
          { value: 'Еда', label: 'Еда' },
          { value: 'Техника', label: 'Техника' },
          { value: 'Мода', label: 'Мода' },
          { value: 'Здоровье', label: 'Здоровье' }
        ]
      },
      { 
        name: 'target_niches', 
        label: 'Целевые ниши (через запятую)', 
        type: 'text', 
        placeholder: 'красота, мода, уход за кожей',
        required: true
      },
    ],
    cardFields: ['name', 'description', 'budget', 'category', 'applications_count']
  }
};

export const catalogConfigs = {
  products: {
    title: 'Каталог кампаний',
    subtitle: 'Найдите подходящие кампании по вашим нишам',
    apiMethod: getCatalogProducts,
    filters: { search: true },
    categories: [],
    cardFields: ['name', 'description', 'budget', 'category', 'niches'],
    actions: [
      { label: 'Подробнее', class: 'btn btn-blue' }, 
      { 
        label: 'Откликнуться', 
        class: 'btn btn-outline', 
        onClick: applyToProduct 
      }
    ]
  },
  bloggers: {
    title: 'Каталог блогеров',
    subtitle: 'Найдите подходящих блогеров для вашей кампании',
    apiMethod: getCatalogBloggers,
    filters: { search: true },
    categories: [],
    cardFields: ['name', 'followers', 'er', 'price', 'categories'],
    actions: [
      { label: 'Подробнее', class: 'btn btn-blue' }, 
      { label: 'Предложить сотрудничество', class: 'btn btn-outline' }
    ]
  }
};
