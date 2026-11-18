import ClientTapPage from './ClientTapPage';

export function generateStaticParams() {
  return [
    { cardId: 'demo' },
    { cardId: 'SB-SUR-2026' },
    { cardId: 'ST-NFC-9842' },
  ];
}

export default function NFCTapRedirectPage() {
  return <ClientTapPage />;
}
