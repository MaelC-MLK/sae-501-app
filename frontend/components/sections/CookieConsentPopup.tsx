import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function CookieConsentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsOpen(false);
  };

  return (
    <>
      {isOpen ? (
        <>
      <div className='fixed inset-0 bg-black/10 z-50'>

      </div>
        <div className={`fixed bottom-0 left-0 right-0 bg-primary-foreground text-primary-background pb-8 pt-6 z-100 flex items-center justify-center flex-col gap-6`}>
        <p className="text-center px-2">En poursuivant votre navigation sur ce site, vous acceptez l&apos;utilisation de cookies.</p>
        <Button onClick={handleAccept} size="lg">Accepter</Button>
        </div>
    </>
      ) : null
      }
    </>
  );
}