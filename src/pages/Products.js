import { useEffect, useState } from "react";

function ProductList({ product, onDelete }) {
  return (
    <>
      <li className='product-list'>
        <div className='list-visual'>
          <span className='item-rating'>평점: {product.rating.rate}</span>
          <figure className='item-img'>
            <img src={product.image} alt={product.title} />
          </figure>
        </div>
        <h3 className='item item-title'>{product.title}</h3>
        <div className='item item-description'>{product.description}</div>
        <div className='item item-price'>가격: ₩{(product.price * 1200).toLocaleString()}</div>
        <div className='list-btn-wrap'>
          <button className='btn' onClick={onDelete}>삭제</button>
        </div>
      </li>
    </>
  );
}

function ProductContainer({ products }) {
  const [filterProducts, setFilterProducts] = useState(products);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortList, setSortList] = useState('default');

  const sortProducts = (searchFilter, sortList, products) => {
    let filterList = [...products];

    if (searchFilter) {
      const searchTerm = searchFilter.replace(/\s/g, '').toLowerCase();
      filterList = products.filter(product =>
        product.title.replace(/\s/g, '').toLowerCase().includes(searchTerm)
      );
    }

    if (sortList === 'price') {
      filterList.sort((a, b) => (a.price - b.price));
    } else if (sortList === 'rating') {
      filterList.sort((a, b) => (b.rating.rate - a.rating.rate));
    }

    setFilterProducts(filterList);
  }

  useEffect(() => {
    sortProducts(searchFilter, sortList, products);
  }, [searchFilter, sortList, products]);

  const handleDelete = (title, id) => {
    if (id && window.confirm(`정말 ${title}을 삭제하시겠습니까?`)) {
      alert('성공적으로 삭제하였습니다.');
      setFilterProducts(filterProducts.filter(item => item.id !== id));
    }
  }

  const getButtonStyle = (type) => {
    return sortList === type ? { backgroundColor: '#87a86f', color: '#fff' } : {};
  };

  return (
    <div className='container'>
      <div className='search-wrap'>
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="이름으로 검색"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          {searchFilter ? <button onClick={() => setSearchFilter('')}>X</button> : null}
        </form>

        <div className='btnWrap'>
          <button onClick={() => setSortList('default')} style={getButtonStyle('default')} className='btn'>기본 정렬</button>
          <button onClick={() => setSortList('price')} style={getButtonStyle('price')} className='btn'>가격 정렬</button>
          <button onClick={() => setSortList('rating')} style={getButtonStyle('rating')} className='btn'>평점 정렬</button>
        </div>
      </div>

      <ul>
        {filterProducts.map(product => (
          <ProductList key={product.id} product={product} onDelete={() => handleDelete(product.title, product.id)} />
        ))}
      </ul>
    </div>
  );
}

function Products() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('출력 X');
        }
        return response.json();
      })
      .then(data => {
        setProductData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="product-wrap">
      <h1 className='title'>상품 목록</h1>
      <ProductContainer products={productData} />
    </div>
  );
}

export default Products;
