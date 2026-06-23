import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore, LANGUAGES } from '../../stores/languageStore';

export const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [largeText, setLargeText] = useState(0); // 0, 1, 2, 3
  const [highContrast, setHighContrast] = useState(0); // 0, 1
  const [bigCursor, setBigCursor] = useState(0); // 0, 1
  const [readingMask, setReadingMask] = useState(0); // 0, 1
  const [dyslexiaFont, setDyslexiaFont] = useState(0); // 0, 1
  const [lineHeight, setLineHeight] = useState(0); // 0, 1, 2

  const { language, setLanguage, t } = useLanguageStore();
  const [profile, setProfile] = useState('');
  const [openDropdown, setOpenDropdown] = useState(''); // 'lang' or 'prof'

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const html = document.documentElement;
    // Text Size
    html.style.fontSize = largeText === 0 ? '' : largeText === 1 ? '110%' : largeText === 2 ? '120%' : '130%';
    
    // High Contrast
    if (highContrast > 0) html.classList.add('high-contrast');
    else html.classList.remove('high-contrast');

    // Big Cursor
    if (bigCursor > 0) html.classList.add('big-cursor');
    else html.classList.remove('big-cursor');

    // Dyslexia
    if (dyslexiaFont > 0) html.classList.add('dyslexia-font');
    else html.classList.remove('dyslexia-font');

    // Line Height
    if (lineHeight > 0) html.classList.add('large-line-height');
    else html.classList.remove('large-line-height');
    
  }, [largeText, highContrast, bigCursor, readingMask, dyslexiaFont, lineHeight]);

  // Reading Mask effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (readingMask > 0) {
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    if (readingMask > 0) window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingMask]);

  const handleReset = () => {
    setLargeText(0); 
    setHighContrast(0); 
    setBigCursor(0);
    setReadingMask(0); 
    setDyslexiaFont(0); 
    setLineHeight(0);
    setProfile('');
  };

  const handleProfileSelect = (prof: string) => {
    setOpenDropdown('');
    
    if (prof === 'Ninguno' || prof === '') {
      handleReset();
      return;
    }

    // Reset first
    handleReset();
    setProfile(prof);

    // Apply specific profiles
    if (prof === 'Visión Baja') {
      setLargeText(2);
      setHighContrast(1);
      setBigCursor(1);
    } else if (prof === 'Dislexia') {
      setDyslexiaFont(1);
      setLineHeight(1);
    } else if (prof === 'TDHA') {
      setReadingMask(1);
    } else if (prof === 'Daltonismo') {
      setHighContrast(1);
    }
  };

  const renderDots = (current: number, max: number) => {
    return (
      <div className="flex gap-1 justify-center mt-2">
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className={`h-1.5 w-4 rounded-sm ${i < current ? 'bg-gray-700' : 'bg-gray-200'}`} />
        ))}
      </div>
    );
  };

  return (
    <>
      {readingMask > 0 && <div className="reading-mask-overlay" />}
      
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 left-0 w-[340px] bg-[#0a0a0a]/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden font-sans text-gray-200 border border-white/10"
            >
              {/* Header */}
              <div className="bg-[#030303] text-primary px-4 py-4 flex justify-between items-center rounded-t-xl border-b border-white/5">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" /></svg>
                  <span className="font-semibold text-sm tracking-wide">{t('acc.title')}</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4">
                {/* Dropdowns */}
                <div className="space-y-2 mb-4 relative z-20">
                  {/* Language Dropdown */}
                  <div className={`relative ${openDropdown === 'lang' ? 'z-30' : 'z-10'}`}>
                    <div 
                      onClick={() => setOpenDropdown(openDropdown === 'lang' ? '' : 'lang')}
                      className="flex justify-between items-center bg-[#111] p-3 rounded-lg border border-white/5 shadow-sm cursor-pointer hover:bg-[#1a1a1a] transition-colors text-sm"
                    >
                      <span>{t('acc.language')}: <span className="text-primary">{currentLangObj.flag} {currentLangObj.name}</span></span>
                      <svg className={`w-4 h-4 text-primary transform transition-transform ${openDropdown === 'lang' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    {openDropdown === 'lang' && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-[#111] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                        {LANGUAGES.map(l => (
                          <div 
                            key={l.code} 
                            onClick={() => { setLanguage(l.code); setOpenDropdown(''); }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-primary/20 hover:text-primary cursor-pointer text-sm border-b border-white/5 last:border-0"
                          >
                            <span>{l.flag}</span>
                            <span>{l.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className={`relative ${openDropdown === 'prof' ? 'z-30' : 'z-10'}`}>
                    <div 
                      onClick={() => setOpenDropdown(openDropdown === 'prof' ? '' : 'prof')}
                      className="flex justify-between items-center bg-[#111] p-3 rounded-lg border border-white/5 shadow-sm cursor-pointer hover:bg-[#1a1a1a] transition-colors text-sm"
                    >
                      <span>
                        {t('acc.profile')}:{' '}
                        {profile ? (
                          <span className="text-primary">[{profile}], {t('acc.profile_active')}</span>
                        ) : (
                          <span className="text-gray-500">{t('acc.none')}</span>
                        )}
                      </span>
                      <svg className={`w-4 h-4 text-primary transform transition-transform ${openDropdown === 'prof' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    {openDropdown === 'prof' && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-[#111] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                        {['Ninguno', 'Visión Baja', 'Dislexia', 'TDHA', 'Daltonismo'].map(p => (
                          <div 
                            key={p} 
                            onClick={() => handleProfileSelect(p)}
                            className="px-4 py-2 hover:bg-primary/20 hover:text-primary cursor-pointer text-sm border-b border-white/5 last:border-0"
                          >
                            {p === 'Ninguno' ? t('acc.none') : p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                  <button 
                    onClick={() => {
                      setLargeText((p) => (p + 1) % 4);
                      setProfile('');
                    }} 
                    className={`bg-[#111] p-4 rounded-xl border transition-all ${largeText > 0 ? 'border-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`text-2xl font-serif font-bold text-center mb-1 ${largeText > 0 ? 'text-primary' : 'text-gray-300'}`}>T<span className="text-lg">T</span></div>
                    <div className="text-xs text-center font-medium text-gray-400">{t('acc.text_size')}</div>
                    {renderDots(largeText, 4)}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setHighContrast((p) => (p + 1) % 2);
                      setProfile('');
                    }} 
                    className={`bg-[#111] p-4 rounded-xl border transition-all ${highContrast > 0 ? 'border-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`w-6 h-6 mx-auto mb-2 rounded-full border-2 bg-gradient-to-r from-gray-900 to-gray-300 ${highContrast > 0 ? 'border-primary' : 'border-gray-500'}`}></div>
                    <div className="text-xs text-center font-medium text-gray-400">{t('acc.contrast')}</div>
                    {renderDots(highContrast, 1)}
                  </button>

                  <button 
                    onClick={() => {
                      setBigCursor((p) => (p + 1) % 2);
                      setProfile('');
                    }} 
                    className={`bg-[#111] p-4 rounded-xl border transition-all ${bigCursor > 0 ? 'border-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <svg className={`w-8 h-8 mx-auto mb-1 ${bigCursor > 0 ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                    <div className="text-xs text-center font-medium text-gray-400">{t('acc.cursor')}</div>
                    {renderDots(bigCursor, 1)}
                  </button>

                  <button 
                    onClick={() => {
                      setReadingMask((p) => (p + 1) % 2);
                      setProfile('');
                    }} 
                    className={`bg-[#111] p-4 rounded-xl border transition-all ${readingMask > 0 ? 'border-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <svg className={`w-8 h-8 mx-auto mb-1 ${readingMask > 0 ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    <div className="text-xs text-center font-medium text-gray-400">{t('acc.reading_mask')}</div>
                    {renderDots(readingMask, 1)}
                  </button>

                  <button 
                    onClick={() => {
                      setDyslexiaFont((p) => (p + 1) % 2);
                      setProfile('');
                    }} 
                    className={`bg-[#111] p-4 rounded-xl border transition-all ${dyslexiaFont > 0 ? 'border-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`text-xl font-bold text-center mb-1 font-mono tracking-widest ${dyslexiaFont > 0 ? 'text-primary' : 'text-gray-300'}`}>AZ</div>
                    <div className="text-xs text-center font-medium text-gray-400">{t('acc.dyslexia')}</div>
                    {renderDots(dyslexiaFont, 1)}
                  </button>

                  <button 
                    onClick={() => {
                      setLineHeight((p) => (p + 1) % 3);
                      setProfile('');
                    }} 
                    className={`bg-[#111] p-4 rounded-xl border transition-all ${lineHeight > 0 ? 'border-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <svg className={`w-8 h-8 mx-auto mb-1 ${lineHeight > 0 ? 'text-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16M8 9l4-4 4 4M16 15l-4 4-4-4" /></svg>
                    <div className="text-xs text-center font-medium text-gray-400">{t('acc.line_height')}</div>
                    {renderDots(lineHeight, 2)}
                  </button>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 pt-3 relative z-10">
                  <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors py-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    {t('acc.reset')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-black hover:bg-[#111] text-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 hover:scale-110 border border-primary/50"
          aria-label="Abrir menú de accesibilidad"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
          </svg>
        </button>
      </div>
    </>
  );
};

