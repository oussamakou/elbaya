import {notFound} from 'next/navigation';

// Any path that no page matches within a locale renders the localized 404.
export default function CatchAllNotFound() {
  notFound();
}
