import ClientProfilePage from './ClientProfilePage';

export function generateStaticParams() {
  return [
    { username: 'surya' },
    { username: 'elena' },
    { username: 'alex' },
    { username: 'marcus' },
  ];
}

export default function PublicProfilePage() {
  return <ClientProfilePage />;
}
