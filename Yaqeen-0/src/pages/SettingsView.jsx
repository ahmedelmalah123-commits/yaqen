/**
 * src/pages/SettingsView.jsx
 * Settings page — reciter selector, font size, theme, etc.
 */

import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { RECITERS } from '../lib/constants'
import { cn } from '../utils/cn'

function SettingsSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="px-5 mb-3 text-[12px] font-semibold text-text-tertiary uppercase tracking-wider">
        {title}
      </h3>
      <div className="border-t border-b border-white/4">{children}</div>
    </div>
  )
}

function SettingsRow({
  label,
  value,
  onClick,
  isActive = false,
  rightEl,
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center justify-between
        px-5 py-4 border-b border-white/4 last:border-0
        hover:bg-white/4 transition-colors duration-150 text-left
      "
    >
      <span className="text-[13px] text-text-primary">{label}</span>
      <div className="flex items-center gap-2">
        {rightEl ? (
          rightEl
        ) : (
          <>
            <span className={cn(
              'text-[12px]',
              isActive ? 'text-gold-400' : 'text-text-tertiary'
            )}>
              {value}
            </span>
            <ChevronRight
              size={16}
              className="text-text-tertiary"
              strokeWidth={1.5}
            />
          </>
        )}
      </div>
    </button>
  )
}

export function SettingsView({
  settings,
  currentReciterId,
  onReciterChange,
  onFontSizeChange,
  onThemeToggle,
  onToggleTranslation,
  onToggleTranslit,
}) {
  const [showReciterPicker, setShowReciterPicker] = useState(false)

  const FONT_SIZES = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra Large', value: 'xl' },
  ]

  const currentReciter = RECITERS.find(r => r.id === currentReciterId)

  return (
    <div className="pt-2 pb-8">
      {/* ─── Display Settings ─── */}
      <SettingsSection title="Display">
        <SettingsRow
          label="Theme"
          value={settings.theme === 'dark' ? 'Dark' : 'Light'}
          onClick={onThemeToggle}
        />
      </SettingsSection>

      {/* ─── Reciter Settings ─── */}
      <SettingsSection title="Audio">
        <div className="border-b border-white/4">
          <div className="px-5 py-4">
            <p className="text-[12px] text-text-tertiary mb-3">Reciter</p>
            <div className="space-y-2">
              {RECITERS.map(reciter => (
                <button
                  key={reciter.id}
                  onClick={() => {
                    onReciterChange(reciter.id)
                    setShowReciterPicker(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 rounded-card text-left',
                    'transition-colors duration-150',
                    currentReciterId === reciter.id
                      ? 'bg-gold-400/15 border border-gold-400/30 text-gold-300'
                      : 'bg-white/4 border border-white/8 text-text-secondary hover:bg-white/8'
                  )}
                >
                  <p className="text-[12px] font-medium">{reciter.name}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">
                    {reciter.nameArabic}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ─── Reading Settings ─── */}
      <SettingsSection title="Reading">
        <div className="px-5 py-4 border-b border-white/4">
          <p className="text-[12px] text-text-tertiary mb-3">Font Size</p>
          <div className="flex gap-2">
            {FONT_SIZES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => onFontSizeChange(value)}
                className={cn(
                  'flex-1 px-2 py-2 rounded-card text-[11px] font-medium',
                  'transition-colors duration-150',
                  settings.readingSettings.fontSize === value
                    ? 'bg-gold-400 text-bg-primary'
                    : 'bg-white/8 text-text-secondary hover:bg-white/12'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <SettingsRow
          label="Show Translation"
          onClick={onToggleTranslation}
          rightEl={
            <div className={cn(
              'w-10 h-6 rounded-full transition-colors duration-200',
              settings.readingSettings.showTranslation
                ? 'bg-gold-400'
                : 'bg-white/15'
            )}>
              <div className={cn(
                'w-5 h-5 rounded-full bg-white m-0.5 transition-transform duration-200',
                settings.readingSettings.showTranslation && 'translate-x-4'
              )} />
            </div>
          }
        />

        <SettingsRow
          label="Show Transliteration"
          onClick={onToggleTranslit}
          rightEl={
            <div className={cn(
              'w-10 h-6 rounded-full transition-colors duration-200',
              settings.readingSettings.showTransliteration
                ? 'bg-gold-400'
                : 'bg-white/15'
            )}>
              <div className={cn(
                'w-5 h-5 rounded-full bg-white m-0.5 transition-transform duration-200',
                settings.readingSettings.showTransliteration && 'translate-x-4'
              )} />
            </div>
          }
        />
      </SettingsSection>

      {/* ─── About ─── */}
      <SettingsSection title="About">
        <div className="px-5 py-4">
          <p className="text-[12px] text-text-tertiary">Yaqeen v2.0</p>
          <p className="text-[11px] text-text-tertiary mt-2">
            A beautiful Quran app with Glassmorphism UI
          </p>
        </div>
      </SettingsSection>
    </div>
  )
}
