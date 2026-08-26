import React from 'react';
import { VortexHeartAnimation } from './VortexHeartAnimation';
import { BoxOccasion, EmotionalReasonCategory } from '../types';

export interface VortexHeartWishAnimationProps {
  reasonCategory?: EmotionalReasonCategory | BoxOccasion;
  customMessage?: string;
  recipientName?: string;
  senderName?: string;
  onComplete: () => void;
  durationMs?: number;
}

/**
 * VortexHeartWishAnimation:
 * Full-screen HTML5 Canvas particle vortex simulation featuring 480+ glowing neon rose (#ff2a6d)
 * particles swirling via vector attraction physics into a parametric beating heart contour,
 * complete with a dedicated luxury cursive handwritten emotional wish overlay.
 */
export const VortexHeartWishAnimation: React.FC<VortexHeartWishAnimationProps> = (props) => {
  return <VortexHeartAnimation {...props} />;
};

export default VortexHeartWishAnimation;
