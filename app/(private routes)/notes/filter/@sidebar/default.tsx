import Link from 'next/link';
import css from './SideBarNotes.module.css';
import { NoteTagType } from '@/types/note';

const SideBarNotes = () => {
  const tags: NoteTagType[] = [
    'Work',
    'Todo',
    'Personal',
    'Meeting',
    'Shopping',
    'Ideas',
    'Travel',
    'Finance',
    'Health',
    'Important',
  ];

  return (
    <ul className={css.menuList}>
      {/* список тегів */}
      <li className={css.menuItem}>
        <Link key="All" href={`/notes/filter/All`} className={css.menuLink}>
          All Notes
        </Link>
      </li>

      {tags.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SideBarNotes;
