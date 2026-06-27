import React from 'react';
import Card from '../ui/Card';
import { Globe, RefreshCw } from 'lucide-react';
import { useWorkspace, LANGUAGE_DISPLAY, type LanguageId } from '../../store/useWorkspace';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useWorkspace();

  return (
    <Card
      icon={<Globe size={15} strokeWidth={2} />}
      title="Language Selector"
      showViewAll={false}
      showRefresh={false}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col gap-3.5 pt-1">
        {/* Caption */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider">
            Multi-Language Support
          </span>
          <span className="text-[10.5px] text-[#8B8A99] italic flex items-center gap-1">
            <RefreshCw size={9} className="animate-spin" style={{ animationDuration: '4s' }} />
            Same logic, new syntax
          </span>
        </div>

        {/* Pills Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {Object.entries(LANGUAGE_DISPLAY).map(([id, { name, ext }]) => {
            const isActive = language === id;
            return (
              <button
                key={id}
                onClick={() => setLanguage(id as LanguageId)}
                className="flex flex-col items-start px-3.5 py-2.5 rounded-xl border transition-all duration-150 active:scale-95 text-left"
                style={{
                  background: isActive ? 'rgba(139,92,246,0.1)' : '#14131A',
                  borderColor: isActive ? '#A78BFA' : 'rgba(255,255,255,0.04)',
                }}
              >
                <span
                  className="text-[12px] font-bold transition-colors"
                  style={{ color: isActive ? '#F5F5F7' : '#8B8A99' }}
                >
                  {name}
                </span>
                <span className="text-[9px] font-mono text-[#6B6A78] mt-0.5">
                  {ext}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default LanguageSelector;
