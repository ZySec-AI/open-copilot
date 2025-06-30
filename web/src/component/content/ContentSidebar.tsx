import React, { useEffect } from 'react';
import { MdDone } from 'react-icons/md';
import { useAppDispatch } from '@/hook';
import { Input } from '@/component/ui/input';

interface Category {
  id: string;
  name: string;
}

interface CategoriListProps {
  value: Category;
  selectedCategory?: string | null;
  handleFilter: (id: string, name: string) => void;
}

interface PlaybookSideBarProps {
  categoryData?: Category[];
  selectedCategory?: string | null;
  handleFilter: (id: string, name: string) => void;
  searchTerm?: string;
  setSearchTerm: (term: string) => void;
  fetchContent: () => void;
  handleClose?: any;
}

const CategoriList: React.FC<CategoriListProps> = ({ value, selectedCategory, handleFilter }) => {
  return (
    <div
      onClick={() => handleFilter(value.id, value.name)}
      className="flex items-center gap-2 bg-gray-100 p-1 border rounded-xl cursor-pointer pl-2"
    >
      <div className={`${selectedCategory === value.name ? 'text-[#0D60D8]' : ''} hover:text-[#0D60D8] font-semibold`}>
        {value.name}
      </div>
      {selectedCategory === value.name && <MdDone style={{ color: 'green' }} />}
    </div>
  );
};

const ContentSidebar: React.FC<PlaybookSideBarProps> = ({
  categoryData,
  selectedCategory,
  handleFilter,
  searchTerm,
  setSearchTerm,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleFilter('all', 'All');
  }, [dispatch]);

  const allCategory: Category = { id: 'all', name: 'All' };

  const handleFilterWithDispatch = (id: string, name: string) => {
    handleFilter(id, name);
    if (id === 'all') {
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold whitespace-nowrap flex justify-center m-4">Manage Libraries</h2>
      <div className="flex items-center justify-between px-[18vw] my-6">
        <Input
          placeholder="Filter Libraries..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <CategoriList value={allCategory} selectedCategory={selectedCategory} handleFilter={handleFilterWithDispatch} />
        {categoryData && categoryData.length > 0 ? (
          categoryData.map((value, index) => (
            <CategoriList
              value={value}
              key={index}
              selectedCategory={selectedCategory}
              handleFilter={handleFilterWithDispatch}
            />
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default ContentSidebar;
