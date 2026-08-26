import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox } from '../types';
import QRCode from 'qrcode';
import { X, Printer, Download, Sparkles, QrCode, Camera, Heart, Check, Copy } from 'lucide-react';
import { playPaperCrinkleSound, playWaxSealCrackSound } from '../utils/audio';

interface PrintableQrCardModalProps {
  box: HamperBox;
  isOpen: boolean;
  onClose: () => void;
  onLaunchAR?: () => void;
}

export const PrintableQrCardModal: React.FC<PrintableQrCardModalProps> = ({
  box,
  isOpen,
  onClose,
  onLaunchAR,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [cardFormat, setCardFormat] = useState<'envelope_sticker' | 'keepsake_card' | 'mini_tag'>('keepsake_card');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${window.location.origin}/?box=${box.id}`;
  const arModeUrl = `${window.location.origin}/?box=${box.id}&ar=true`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(
        shareUrl,
        {
          width: 600,
          margin: 2,
          color: {
            dark: '#4A1D24', // Deep rich wine burgundy for haute print quality
            light: '#FFFDF9', // Warm ivory
          },
          errorCorrectionLevel: 'H',
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    playPaperCrinkleSound();
    window.print();
  };

  const handleDownloadImage = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `MemoryBox-QR-${box.recipientName.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1410]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#8B0000]/10 border border-[#8B0000]/20 flex items-center justify-center mb-2 text-[#8B0000]">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#8C6239]">
              Printable Physical Keepsake Card
            </span>
            <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-1">
              QR Code & Augmented Reality Card
            </h3>
            <p className="text-xs text-[#7A6856] max-w-md mx-auto mt-1">
              Stick this QR code on real chocolates, envelopes, or flowers. When {box.recipientName} scans it, your 3D MemoryBox floats into their camera screen!
            </p>
          </div>

          {/* Card Layout Format Selector */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => {
                playPaperCrinkleSound();
                setCardFormat('keepsake_card');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                cardFormat === 'keepsake_card'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-[#5A4634] hover:bg-stone-100'
              }`}
            >
              💌 Luxury Greeting Card
            </button>
            <button
              onClick={() => {
                playPaperCrinkleSound();
                setCardFormat('envelope_sticker');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                cardFormat === 'envelope_sticker'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-[#5A4634] hover:bg-stone-100'
              }`}
            >
              🏷️ Chocolate / Gift Sticker
            </button>
            <button
              onClick={() => {
                playPaperCrinkleSound();
                setCardFormat('mini_tag');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                cardFormat === 'mini_tag'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-white border border-stone-300 text-[#5A4634] hover:bg-stone-100'
              }`}
            >
              🔖 Hanging Tag
            </button>
          </div>

          {/* PRINTABLE CARD PREVIEW AREA */}
          <div
            ref={printRef}
            id="printable-qr-card-canvas"
            className={`mx-auto bg-[#FFFDF9] border-2 border-[#D4AF37] rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 ${
              cardFormat === 'keepsake_card'
                ? 'max-w-md text-center'
                : cardFormat === 'envelope_sticker'
                ? 'max-w-sm text-center py-5'
                : 'max-w-xs text-center py-4'
            }`}
            style={{
              backgroundImage: 'radial-gradient(#d4af3715 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            {/* Ornate Gold Border Inner Inset */}
            <div className="absolute inset-2.5 rounded-2xl border border-[#D4AF37]/50 pointer-events-none" />
            <div className="absolute inset-3.5 rounded-xl border border-[#D4AF37]/25 pointer-events-none" />

            {/* Corner Filigree Decors */}
            <div className="absolute top-4 left-4 text-[#D4AF37] opacity-60 text-xs">✤</div>
            <div className="absolute top-4 right-4 text-[#D4AF37] opacity-60 text-xs">✤</div>
            <div className="absolute bottom-4 left-4 text-[#D4AF37] opacity-60 text-xs">✤</div>
            <div className="absolute bottom-4 right-4 text-[#D4AF37] opacity-60 text-xs">✤</div>

            {/* Wax Seal Monogram Badge */}
            <div className="w-12 h-12 mx-auto rounded-full bg-[#8B0000] border-2 border-[#D4AF37] flex items-center justify-center text-[#F5E6C8] font-cinzel font-bold text-xs shadow-md mb-3">
              {box.waxSealInitials || 'MB'}
            </div>

            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#8C6239] block">
              Handcrafted Digital Keepsake
            </span>

            <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-[#2D241E] mt-0.5 mb-1">
              For {box.recipientName}
            </h4>
            <p className="font-script text-base text-[#7A5835] -mt-1 mb-3">
              With Love From {box.senderName}
            </p>

            {/* QR Code Frame */}
            <div className="relative inline-block p-3 rounded-2xl bg-white border-2 border-[#D4AF37]/60 shadow-md my-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code to unlock ${box.title}`}
                  className="w-44 h-44 sm:w-48 sm:h-48 mx-auto object-contain rounded-lg"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center bg-stone-100 rounded-lg">
                  <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin" />
                </div>
              )}

              {/* Center Heart Emblem inside QR */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#D4AF37] shadow-sm flex items-center justify-center pointer-events-none">
                <Heart className="w-4 h-4 text-[#8B0000] fill-current" />
              </div>
            </div>

            {/* Scanning Instructions */}
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/20 text-[#8B0000] text-[11px] font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>Scan with any Phone Camera to Open in 3D / AR</span>
              </div>

              {box.secretPassword && (
                <p className="text-[11px] text-[#5A4634] font-medium mt-2">
                  Secret Keyword:{' '}
                  <span className="font-mono font-bold bg-[#FAF3E0] px-2 py-0.5 rounded border border-[#E8D7A6] text-[#8B0000]">
                    {box.secretPassword}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA771C] text-[#2C1D0F] font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Keepsake Card</span>
            </button>

            <button
              onClick={handleDownloadImage}
              className="py-3 px-4 rounded-2xl bg-white border border-[#D4C3A3] text-[#5A4634] font-bold text-xs hover:bg-[#FAF3E0] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#B8860B]" />
              <span>Download QR Image</span>
            </button>

            {onLaunchAR ? (
              <button
                onClick={() => {
                  onClose();
                  onLaunchAR();
                }}
                className="py-3 px-4 rounded-2xl bg-[#8B0000] text-white font-bold text-xs shadow-md hover:bg-[#720000] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#F5E6C8]" />
                <span>Test AR Camera Filter</span>
              </button>
            ) : (
              <button
                onClick={handleCopyLink}
                className="py-3 px-4 rounded-2xl bg-white border border-[#D4C3A3] text-[#5A4634] font-bold text-xs hover:bg-[#FAF3E0] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
