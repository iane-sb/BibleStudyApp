/**
 * PhotoCropModal — Real interactive image cropping for profile avatar
 *
 * Flow:
 *  1. Receives a source image URI from expo-image-picker
 *  2. Displays the image inside a fixed 240×240 square viewport
 *  3. User can pan (drag) and pinch-to-zoom via gesture responders
 *  4. On "Save Photo", uses expo-image-manipulator to:
 *     a. Resize the original image to a known size
 *     b. Calculate the crop rect from the gesture state
 *     c. Crop to a 1:1 square, compress to JPEG, save to FileSystem
 *  5. Returns the local file URI to the parent
 *
 * Compatible with Expo Go on Android and Expo Web (web uses CSS transforms
 * with PanResponder).
 */

import { File, Paths } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

const COLORS = {
  background: '#10131D',
  card: '#191E2B',
  cardLight: '#202637',
  gold: '#D8B56D',
  goldDark: '#A88B50',
  textPrimary: '#F5F0E6',
  textSecondary: '#9296A3',
  border: '#2A3040',
};

const SCREEN = Dimensions.get('window');
const CROP_SIZE = Math.min(SCREEN.width - 48, 300); // square crop frame size in dp
const MIN_SCALE = 0.5;
const MAX_SCALE = 4.0;

interface PhotoCropModalProps {
  visible: boolean;
  sourceUri: string;
  /** Natural image dimensions reported by expo-image-picker */
  imageWidth: number;
  imageHeight: number;
  onCancel: () => void;
  /** Called with the saved local file URI of the cropped avatar */
  onSave: (localUri: string) => Promise<void>;
}

export function PhotoCropModal({
  visible,
  sourceUri,
  imageWidth,
  imageHeight,
  onCancel,
  onSave,
}: PhotoCropModalProps) {
  // ─── Gesture State ─────────────────────────────────────────────────────────
  const translateX = useRef(0);
  const translateY = useRef(0);
  const scale = useRef(1);

  // State for triggering re-renders when gesture changes
  const [transform, setTransform] = useState({ x: 0, y: 0, s: 1 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track last gesture for delta calculations
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistRef = useRef<number | null>(null);

  // Reset when new image arrives
  useEffect(() => {
    if (visible) {
      translateX.current = 0;
      translateY.current = 0;
      // Fit the image so it fills the crop square initially
      const aspectRatio = imageWidth / imageHeight;
      if (aspectRatio > 1) {
        // landscape: fit by height → scale so width fills crop
        scale.current = 1;
      } else {
        // portrait or square: fit by width
        scale.current = 1;
      }
      setTransform({ x: 0, y: 0, s: scale.current });
      setError(null);
      setProcessing(false);
    }
  }, [visible, imageWidth, imageHeight]);

  // Initial display scale so image covers the crop frame
  const initDisplayScale = useMemo(() => {
    if (!imageWidth || !imageHeight) return 1;
    const ar = imageWidth / imageHeight;
    if (ar > 1) {
      // landscape → need to scale down to fit height
      return CROP_SIZE / (CROP_SIZE / ar);
    }
    // portrait → scale up to fill width
    return CROP_SIZE / (ar * CROP_SIZE < CROP_SIZE ? ar * CROP_SIZE : CROP_SIZE);
  }, [imageWidth, imageHeight]);

  // ─── Pan Responder ─────────────────────────────────────────────────────────
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderMove: (evt) => {
          const touches = evt.nativeEvent.touches;
          if (touches.length === 1) {
            // Single finger — pan
            const touch = touches[0];
            if (lastTouchRef.current) {
              const dx = touch.pageX - lastTouchRef.current.x;
              const dy = touch.pageY - lastTouchRef.current.y;
              translateX.current += dx;
              translateY.current += dy;
              setTransform({ x: translateX.current, y: translateY.current, s: scale.current });
            }
            lastTouchRef.current = { x: touch.pageX, y: touch.pageY };
            lastPinchDistRef.current = null;
          } else if (touches.length === 2) {
            // Two-finger pinch — zoom
            const t0 = touches[0];
            const t1 = touches[1];
            const dist = Math.hypot(
              t1.pageX - t0.pageX,
              t1.pageY - t0.pageY
            );
            if (lastPinchDistRef.current !== null) {
              const delta = dist / lastPinchDistRef.current;
              const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.current * delta));
              scale.current = nextScale;
              setTransform({ x: translateX.current, y: translateY.current, s: scale.current });
            }
            lastPinchDistRef.current = dist;
            lastTouchRef.current = null;
          }
        },

        onPanResponderRelease: () => {
          lastTouchRef.current = null;
          lastPinchDistRef.current = null;
        },
      }),
    []
  );

  const resetCrop = useCallback(() => {
    translateX.current = 0;
    translateY.current = 0;
    scale.current = 1;
    setTransform({ x: 0, y: 0, s: 1 });
  }, []);

  // ─── Zoom Buttons (for accessibility / web) ────────────────────────────────
  const zoomIn = useCallback(() => {
    scale.current = Math.min(MAX_SCALE, scale.current * 1.25);
    setTransform((t) => ({ ...t, s: scale.current }));
  }, []);
  const zoomOut = useCallback(() => {
    scale.current = Math.max(MIN_SCALE, scale.current / 1.25);
    setTransform((t) => ({ ...t, s: scale.current }));
  }, []);

  // ─── Save & Process ────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setProcessing(true);
    setError(null);
    try {
      /**
       * Crop calculation:
       *
       * The image is displayed inside a CROP_SIZE × CROP_SIZE frame with
       * object-fit "contain". We compute where in the ORIGINAL image the
       * crop frame maps to:
       *
       * 1. Calculate the "contain" display scale (how image fits into CROP_SIZE)
       * 2. Apply user's pan/scale on top of that
       * 3. Determine which portion of the original image is inside the frame
       */

      // Step 1: Determine the "contain" scale for the original image
      const containScale = Math.min(
        CROP_SIZE / imageWidth,
        CROP_SIZE / imageHeight
      );

      // Displayed image pixel dimensions
      const displayedW = imageWidth * containScale;
      const displayedH = imageHeight * containScale;

      // Offset of image top-left inside crop frame (centering)
      const imgOffsetX = (CROP_SIZE - displayedW) / 2;
      const imgOffsetY = (CROP_SIZE - displayedH) / 2;

      // User applied extra scale + pan. The image center in crop-frame coords:
      const userScale = transform.s;

      // Top-left of the displayed (scaled + panned) image in crop-frame coordinates
      const scaledW = displayedW * userScale;
      const scaledH = displayedH * userScale;
      const imgLeft = (CROP_SIZE - scaledW) / 2 + imgOffsetX * 0 + transform.x;
      const imgTop = (CROP_SIZE - scaledH) / 2 + imgOffsetY * 0 + transform.y;

      // The crop frame occupies [0, CROP_SIZE] × [0, CROP_SIZE] in display coords
      // Find intersection in original-image pixel coords
      const cropFrameLeft = 0;
      const cropFrameTop = 0;

      // Map crop frame corners back to original image pixels
      const originLeft = (cropFrameLeft - imgLeft) / (containScale * userScale);
      const originTop = (cropFrameTop - imgTop) / (containScale * userScale);
      const originSize = CROP_SIZE / (containScale * userScale);

      // Clamp to image bounds
      const clampedLeft = Math.max(0, Math.round(originLeft));
      const clampedTop = Math.max(0, Math.round(originTop));
      const clampedRight = Math.min(imageWidth, Math.round(originLeft + originSize));
      const clampedBottom = Math.min(imageHeight, Math.round(originTop + originSize));

      const cropW = Math.max(1, clampedRight - clampedLeft);
      const cropH = Math.max(1, clampedBottom - clampedTop);

      // Use the smaller dimension for a square crop
      const squareSide = Math.min(cropW, cropH);

      // Step 2: Manipulate
      const result = await ImageManipulator.manipulateAsync(
        sourceUri,
        [
          {
            crop: {
              originX: clampedLeft,
              originY: clampedTop,
              width: squareSide,
              height: squareSide,
            },
          },
          { resize: { width: 400, height: 400 } },
        ],
        {
          compress: 0.85,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Step 3: Copy to permanent app document directory (or use result.uri directly)
      let finalUri = result.uri;
      try {
        if (Paths?.document) {
          const fileName = `avatar_${Date.now()}.jpg`;
          const destFile = new File(Paths.document, fileName);
          const srcFile = new File(result.uri);
          await srcFile.copy(destFile);
          finalUri = destFile.uri;
        }
      } catch (copyErr) {
        console.warn('Could not copy to permanent directory, using result.uri', copyErr);
        finalUri = result.uri;
      }

      await onSave(finalUri);
    } catch (err: any) {
      console.error('PhotoCropModal save error:', err);
      setError(err?.message || 'Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [sourceUri, imageWidth, imageHeight, transform, onSave]);

  // ─── Computed image display style ──────────────────────────────────────────
  const imageStyle = useMemo(() => {
    const containScale = Math.min(CROP_SIZE / imageWidth, CROP_SIZE / imageHeight);
    const displayedW = imageWidth * containScale * transform.s;
    const displayedH = imageHeight * containScale * transform.s;
    return {
      width: displayedW,
      height: displayedH,
      transform: [{ translateX: transform.x }, { translateY: transform.y }],
    };
  }, [imageWidth, imageHeight, transform]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>✦ PROFILE PHOTO</Text>
              <Text style={styles.title}>Crop Your Avatar</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Drag to reposition · Pinch or use ± buttons to zoom
          </Text>

          {/* Crop Frame */}
          <View style={styles.cropWrapper}>
            <View
              style={[styles.cropFrame, { width: CROP_SIZE, height: CROP_SIZE }]}
              {...panResponder.panHandlers}
            >
              <Image
                source={{ uri: sourceUri }}
                style={[styles.sourceImage, imageStyle]}
                contentFit="fill"
              />
              {/* Corner guides */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>

          {/* Zoom Controls */}
          <View style={styles.zoomRow}>
            <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut} activeOpacity={0.7}>
              <Ionicons name="remove" size={20} color={COLORS.gold} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={resetCrop} activeOpacity={0.7}>
              <Ionicons name="refresh-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn} activeOpacity={0.7}>
              <Ionicons name="add" size={20} color={COLORS.gold} />
            </TouchableOpacity>
          </View>

          {/* Scale indicator */}
          <Text style={styles.scaleHint}>{Math.round(transform.s * 100)}% zoom</Text>

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              disabled={processing}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={processing}
              activeOpacity={0.8}
            >
              {processing ? (
                <ActivityIndicator size="small" color="#10131D" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#10131D" />
                  <Text style={styles.saveText}>Save Photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const CORNER_SIZE = 20;
const CORNER_WIDTH = 3;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.92)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 28,
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  cropWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropFrame: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#000',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceImage: {
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: COLORS.gold,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
  zoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  resetText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  scaleHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.cardLight,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10131D',
  },
});
