import ClientIdPage from './ClientIdPage';

export function generateStaticParams() {
  return [
    { username: 'surya' },
    { username: 'elena' },
    { username: 'alex' },
    { username: 'marcus' },
  ];
}

export default function IdRedirectPage() {
  return <ClientIdPage />;
}
