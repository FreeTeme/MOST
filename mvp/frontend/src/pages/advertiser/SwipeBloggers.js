import React, { useState, useEffect } from "react";

export default function SwipeBloggers() {
  const [bloggers, setBloggers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedBloggers, setSwipedBloggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBloggers();
  }, []);

  const fetchBloggers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/swipe/bloggers', {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось загрузить блогеров');
      const data = await res.json();
      setBloggers(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentBlogger = bloggers[currentIndex];

  const handleSwipe = (direction) => {
    setSwipedBloggers([...swipedBloggers, { ...currentBlogger, direction }]);
    if (currentIndex < bloggers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(-1);
    }
  };

  const resetSwipes = () => {
    setCurrentIndex(0);
    setSwipedBloggers([]);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error}</p>;

  if (currentIndex === -1) {
    return (
      <div>
        <h1>Свайп блогеров</h1>
        <p>Вы просмотрели всех блогеров</p>
        
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Результаты</h3>
          <p>Лайков: {swipedBloggers.filter(b => b.direction === 'right').length}</p>
          <p>Дизлайков: {swipedBloggers.filter(b => b.direction === 'left').length}</p>
          <button className="btn btn-primary" onClick={resetSwipes} style={{ marginTop: '20px' }}>
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Свайп блогеров</h1>
      <p>Свайпайте вправо для интересных блогеров, влево - чтобы пропустить</p>

      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card" style={{ position: 'relative', height: '500px' }}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px' }}>
              {currentBlogger.name.charAt(0)}
            </div>
            <h2>{currentBlogger.name}</h2>
            <p><strong>Подписчиков:</strong> {currentBlogger.followers.toLocaleString()}</p>
            <p><strong>Регион:</strong> {currentBlogger.region}</p>
            <p><strong>Цена:</strong> {currentBlogger.price.toLocaleString()} ₽</p>
            <div>
              <strong>Категории:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
                {currentBlogger.categories.map((category, index) => (
                  <span key={index} style={{ 
                    backgroundColor: '#e5e7eb', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px' 
                  }}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '0', 
            right: '0', 
            display: 'flex', 
            justifyContent: 'space-around' 
          }}>
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '24px', width: '60px', height: '60px', borderRadius: '30px' }}
              onClick={() => handleSwipe('left')}
            >
              ✕
            </button>
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '24px', width: '60px', height: '60px', borderRadius: '30px' }}
              onClick={() => handleSwipe('right')}
            >
              ♥
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p>Осталось блогеров: {bloggers.length - currentIndex - 1}</p>
        </div>
      </div>
    </div>
  );
}