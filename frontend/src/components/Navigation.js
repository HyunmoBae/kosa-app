import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardListIcon, 
  DocumentTextIcon, 
  FolderIcon 
} from '@heroicons/react/outline';

function Navigation() {
  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-white text-xl font-bold">개인 작업공간</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <HomeIcon className="h-5 w-5 mr-1" />
              대시보드
            </Link>
            <Link
              to="/todos"
              className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ClipboardListIcon className="h-5 w-5 mr-1" />
              할 일
            </Link>
            <Link
              to="/boards"
              className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <DocumentTextIcon className="h-5 w-5 mr-1" />
              게시판
            </Link>
            <Link
              to="/files"
              className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FolderIcon className="h-5 w-5 mr-1" />
              파일
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 