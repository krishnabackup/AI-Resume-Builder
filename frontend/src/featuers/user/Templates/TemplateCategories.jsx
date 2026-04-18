const TemplateCategories = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="template-categories">
      {categories.map(cat => (
        <button 
          key={cat.id} 
          className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default TemplateCategories;