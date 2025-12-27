const PaginationDots = ({ count, activeIndex, onDotClick }) => (
  <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 items-center w-8">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        type="button"
        aria-label={`Aller à l'écran ${i + 1}`}
        onClick={() => onDotClick && onDotClick(i)}
        className={
          'transition-all duration-300 rounded-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
          (i === activeIndex
            ? 'md:w-5 w-4 md:h-5 h-4 opacity-100 shadow-lg'
            : 'md:w-3 w-2 md:h-3 h-2 opacity-40 hover:md:w-4 hover:md:h-4')
        }
        style={{ cursor: 'pointer' }}
      />
    ))}
  </div>
);

export default PaginationDots;
