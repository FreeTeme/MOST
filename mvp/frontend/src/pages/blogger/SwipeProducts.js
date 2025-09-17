import React, { useState, useEffect } from "react";

export default function SwipeProducts() {
  const BASE_URL = "http://127.0.0.1:5000";
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProducts, setSwipedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/swipe/products`, {
        headers: { 'User-ID': localStorage.getItem('userId') }
      });
      if (!res.ok) throw new Error('Не удалось загрузить товары');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentProduct = products[currentIndex];

  const handleSwipe = async (direction, productId) => {
    setSwipedProducts([...swipedProducts, { ...currentProduct, direction }]);
    if (direction === 'right') {
      try {
        const res = await fetch(`${BASE_URL}/api/products/${productId}/apply`, {
          method: 'POST',
          headers: { 'User-ID': localStorage.getItem('userId') }
        });
        if (!res.ok) throw new Error('Не удалось отправить отклик');
      } catch (err) {
        setError(err.message);
      }
    }
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(-1);
    }
  };

  const resetSwipes = () => {
    setCurrentIndex(0);
    setSwipedProducts([]);
  };

  if (loading) return <div className="loader">Загрузка...</div>;
  if (error) return (
    <div className="error-modal">
      <div className="modal-content">
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => setError(null)}>Закрыть</button>
      </div>
    </div>
  );

  if (currentIndex === -1) {
    return (
      <div className="container">
        <h1>Свайп товаров</h1>
        <p>Вы просмотрели все товары</p>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Результаты</h3>
          <p>Лайков: {swipedProducts.filter(p => p.direction === 'right').length}</p>
          <p>Дизлайков: {swipedProducts.filter(p => p.direction === 'left').length}</p>
          <button className="btn btn-primary" onClick={resetSwipes} style={{ marginTop: '20px' }}>
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Свайп товаров</h1>
      <p>Свайпайте вправо для интересных предложений, влево - чтобы пропустить</p>

      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card" style={{ position: 'relative', height: '500px' }}>
          <div style={{ padding: '20px' }}>
            <h2>{currentProduct.name}</h2>
            <p><strong>Бренд:</strong> {currentProduct.brand || '-'}</p>
            <p><strong>Бюджет:</strong> {currentProduct.budget}</p>
            <p><strong>Категория:</strong> {currentProduct.category || '-'}</p>
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'space-around' }}>
            <button
              className="btn btn-outline"
              style={{ fontSize: '24px', width: '60px', height: '60px', borderRadius: '30px' }}
              onClick={() => handleSwipe('left', currentProduct.id)}
            >
              ✕
            </button>
            <button
              className="btn btn-primary"
              style={{ fontSize: '24px', width: '60px', height: '60px', borderRadius: '30px' }}
              onClick={() => handleSwipe('right', currentProduct.id)}
            >
              ♥
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p>Осталось товаров: {products.length - currentIndex - 1}</p>
        </div>
      </div>
    </div>
  );
}