// components/ProductGrid.jsx
import ProductCard from './ProductCard/ProductCard'
import PaginationControls from './PaginationControls/PaginationControls'

const ProductGrid = ({
  products,
  currentPage,
  totalPages,
  setPage,
  onEdit,
  onDelete,
  isAdmin = false
}) => (
  <>
    <div className='product-list'>
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className='product-card'>
            <ProductCard product={product} />
            {isAdmin && (
              <div className='card-buttons'>
                <button onClick={() => onEdit(product)}>Edit</button>
                <button onClick={() => onDelete(product)}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>

    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      goPrev={() => setPage(currentPage - 1)}
      goNext={() => setPage(currentPage + 1)}
    />
  </>
)

export default ProductGrid
