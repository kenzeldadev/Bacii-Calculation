import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(() => {
    try {
      return window.localStorage.getItem('install-dismissed') === '1' || isStandalone();
    } catch (error) {
      console.error('Unable to read install prompt preference.', error);
      return isStandalone();
    }
  });

  useEffect(() => {
    if (isStandalone()) {
      setHidden(true);
      return undefined;
    }
    if (isIOS()) setIos(true);
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferred(event);
    };
    const onInstalled = () => setHidden(true);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (hidden || (!deferred && !ios)) return null;
  const dismiss = () => {
    try {
      window.localStorage.setItem('install-dismissed', '1');
    } catch (error) {
      console.error('Unable to save install prompt preference.', error);
    }
    setHidden(true);
  };
  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div className="install card">
      {ios ? (
        <p>Tap <Share size={14} className="inline" /> <b>Share</b> → <b>Add to Home Screen</b></p>
      ) : (
        <button className="install-btn" onClick={install}><Download size={16} /> Install app</button>
      )}
      <button className="install-x" onClick={dismiss} aria-label="Dismiss"><X size={16} /></button>
    </div>
  );
}
