'use client';
import { useState } from 'react';
import css from './NotesPage.module.css';
import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes, NotesHttpResponse } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import { NoteTagType } from '@/types/note';
import Link from 'next/link';

interface NotesPageClientProps {
  initialData: NotesHttpResponse;
  tag?: NoteTagType;
}

function NotesPageClient({ initialData, tag }: NotesPageClientProps) {
  // стани
  const [currentPage, setCurrentPage] = useState(1);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', query, currentPage, tag],
    queryFn: () => fetchNotes(query, currentPage, tag),
    placeholderData: keepPreviousData,
    initialData: initialData,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleChangeQuery = useDebouncedCallback((query: string) => {
    setQuery(query);
    setCurrentPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox inputValue={query} onChange={handleChangeQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {isError && <div>Error. Try again.</div>}
      {isLoading && <div> Data is loading ...</div>}
      {isSuccess && data.notes.length === 0 && (
        <div>Data not found. Please try other query.</div>
      )}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
}

export default NotesPageClient;
