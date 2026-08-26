import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HamperBox } from '../types';
import QRCode from 'qrcode';
import { X, Copy, Check, Share2, Sparkles, KeyRound, ExternalLink, QrCode, Printer, Camera } from 'lucide-react';
import { PrintableQrCardModal } from './PrintableQrCardModal';
import { ARCameraUnboxingModal } from './ARCameraUnboxingModal';

interface ShareBoxModalProps {
  box: HamperBox;
  isOpen: boolean;
  onClose: () => void;
  onOpenAsReceiver: () => void;
}

export const ShareBoxModal: React.FC<ShareBoxModalProps> = ({
  box,
  isOpen,
  onClose,
  onOpenAsReceiver,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);

  const shareUrl = `${window.location.origin}/?box=${box.id}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(
        shareUrl,
        {
          width: 320,
          margin: 1,
          color: {
            dark: '#4A1D24',
            light: '#FFFDF9',
          },
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
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1410]/85 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/50 my-auto paper-texture max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-[#7A6856] hover:text-[#2D241E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-13 h-13 mx-auto rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 flex items-center justify-center mb-2">
                <Share2 className="w-6 h-6 text-[#B8860B]" />
              </div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6239]">
                Keepsake Box Ready & Published
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-[#2D241E] mt-0.5">
                Share with {box.recipientName}
              </h3>
              <p className="text-xs text-[#7A6856] mt-1">
                Send via link or print the AR QR code to stick on physical gifts, letters, or chocolates!
              </p>
            </div>

            {/* QR Code Mini Card Preview */}
            <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-xs mb-4 flex items-center gap-4">
              <div className="w-24 h-24 bg-stone-50 rounded-xl border border-stone-200 p-1 flex-shrink-0 flex items-center justify-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Hamper QR" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <QrCode className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-bold">
                  <Camera className="w-3 h-3" />
                  <span>AR Camera Unboxing</span>
                </div>
                <h4 className="font-serif-title text-sm font-bold text-[#2D241E] mt-1">
                  Printable AR QR Tag
                </h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  Scanning this opens a 3D AR filter in their phone camera.
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="px-3 py-1 rounded-lg bg-[#8B0000] text-white text-[11px] font-bold hover:bg-[#720000] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Card</span>
                  </button>
                  <button
                    onClick={() => setIsARModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-semibold hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3 text-[#B8860B]" />
                    <span>AR Preview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Link Box */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A4634] mb-1">
                  Private Hamper Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#D4C3A3] text-xs font-mono text-[#2D241E] select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#2C1D0F] font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Secret Password Reminder Banner */}
              {box.secretPassword && (
                <div className="p-3.5 rounded-2xl bg-[#FFF8E7] border border-[#E8D7A6] shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#8C6239] mb-1">
                    <KeyRound className="w-4 h-4 text-[#B8860B]" />
                    <span>Secret Password Configured</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#4A3210] bg-white/80 px-3 py-1 rounded-lg border border-[#D4C3A3] inline-block my-0.5">
                    {box.secretPassword}
                  </div>
                  <p className="text-[11px] text-[#7A5826] mt-1">
                    Share this secret password with {box.recipientName} to let them unlock the keepsake chest.
                  </p>
                </div>
              )}

              {/* Test as Receiver Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAsReceiver();
                }}
                className="w-full py-3 rounded-2xl bg-white border border-[#D4C3A3] text-xs font-bold text-[#5A4634] hover:bg-[#FAF3E0] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-[#B8860B]" />
                <span>Test Receiver Unboxing Experience</span>
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* PRINTABLE QR CARD MODAL */}
      <PrintableQrCardModal
        box={box}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onLaunchAR={() => {
          setIsPrintModalOpen(false);
          setIsARModalOpen(true);
        }}
      />

      {/* AR CAMERA PREVIEW MODAL */}
      <ARCameraUnboxingModal
        box={box}
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        onEnterFullExperience={() => {
          setIsARModalOpen(false);
          onClose();
          onOpenAsReceiver();
        }}
      />
    </>
  );
};
