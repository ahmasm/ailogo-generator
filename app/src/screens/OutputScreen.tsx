import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh, radius, s, icon, height } from '../utils/scale';
import { useOutputScreenState } from '../store/useJobStore';
import { CloseIcon, CopyIcon } from '../components/icons';
import { Skeleton } from '../components';

export function OutputScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation();

  // Optimized selector - only subscribes to display data
  const { imageUrl, prompt, style } = useOutputScreenState();

  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyPrompt = async () => {
    if (prompt) {
      await Clipboard.setStringAsync(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format style label
  const getStyleLabel = () => {
    switch (style) {
      case 'monogram':
        return 'Monogram';
      case 'abstract':
        return 'Abstract';
      case 'mascot':
        return 'Mascot';
      default:
        return null;
    }
  };

  const styleLabel = getStyleLabel();

  return (
    <View style={styles.container}>
      {/* Background Gradient - Same as InputScreen */}
      <Image
        source={require('../../assets/back-gradient.png')}
        style={[
          styles.backgroundGradient,
          {
            width: screenWidth,
            height: screenHeight,
          },
        ]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* TopBar - Figma: height 60, padding 12 vertical */}
        <View style={styles.topBar}>
          <Text style={styles.title} accessibilityRole="header">Your Design</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Close"
            accessibilityHint="Returns to the input screen"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <CloseIcon />
          </Pressable>
        </View>

        {/* Body - Figma: gap 24, scrollable */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Section - Figma: 342x342, borderRadius 16 */}
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <Skeleton width="100%" height="100%" borderRadius={0} />
                </View>
              )}
              {imageError ? (
                <View style={styles.errorContainer} accessible accessibilityLabel="Failed to load image">
                  <Text style={styles.errorText}>Failed to load image</Text>
                </View>
              ) : imageUrl ? (
                <ExpoImage
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={300}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                  accessible
                  accessibilityLabel={`Generated logo for prompt: ${prompt?.substring(0, 50)}${prompt && prompt.length > 50 ? '...' : ''}`}
                />
              ) : (
                <View style={styles.placeholderContainer} accessible accessibilityLabel="No image available">
                  <Text style={styles.placeholderText}>No image available</Text>
                </View>
              )}
            </View>
          </View>

          {/* Prompt Card - Figma: gradient bg, borderRadius 12, padding 12, gap 12 */}
          <View style={styles.promptCardWrapper}>
            <LinearGradient
              colors={['rgba(148, 61, 255, 0.05)', 'rgba(41, 56, 220, 0.05)']}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
              locations={[0.2459, 1]}
              style={styles.promptCardGradient}
            />
            <View style={styles.promptCard}>
              {/* Header Row */}
              <View style={styles.promptHeader}>
                <Text style={styles.promptLabel}>Prompt</Text>
                <Pressable
                  onPress={handleCopyPrompt}
                  style={styles.copyButton}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={copied ? 'Copied to clipboard' : 'Copy prompt'}
                  accessibilityHint="Copies the prompt text to clipboard"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <CopyIcon />
                  <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
                </Pressable>
              </View>

              {/* Prompt Text - Figma: fontSize 16, lineHeight 21 */}
              <Text style={styles.promptText}>
                {prompt || 'No prompt provided'}
              </Text>

              {/* Style Tag - Figma: padding 4 8, borderRadius 50, bg rgba(250,250,250,0.1) */}
              {styleLabel && (
                <View style={styles.styleTag}>
                  <Text style={styles.styleTagText}>{styleLabel}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Home Indicator area */}
        <SafeAreaView edges={['bottom']} style={styles.bottomSafe} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  safeArea: {
    flex: 1,
  },
  // TopBar - Figma: height 60, padding 12 0
  topBar: {
    height: height(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sp(12),
    paddingHorizontal: sp(24),
  },
  title: {
    // Figma: fontSize 22, lineHeight 28, ExtraBold
    fontSize: fs(22),
    lineHeight: lh(28),
    fontFamily: fontFamily.extraBold,
    color: '#FAFAFA',
  },
  closeButton: {
    width: icon(20),
    height: icon(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: sp(24),
    gap: sp(24),
    paddingBottom: sp(24),
  },
  // Image Section - Figma: 342x342
  imageSection: {
    gap: sp(12),
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E1E1E1',
    borderRadius: radius(16),
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fs(14),
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: fs(14),
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  // Prompt Card - Figma: bg gradient + #27272A, borderRadius 12, padding 12, gap 12
  promptCardWrapper: {
    borderRadius: radius(12),
    overflow: 'hidden',
  },
  promptCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  promptCard: {
    backgroundColor: '#27272A',
    padding: sp(12),
    gap: sp(12),
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptLabel: {
    // Figma: fontSize 15, lineHeight 20, Bold
    fontSize: fs(15),
    lineHeight: lh(20),
    fontFamily: fontFamily.bold,
    color: '#FAFAFA',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(6),
  },
  copyIconContainer: {
    width: icon(16),
    height: icon(16),
    position: 'relative',
  },
  copyBack: {
    position: 'absolute',
    left: '8.33%',
    right: '33.33%',
    top: '33.33%',
    bottom: '8.33%',
    borderWidth: 1,
    borderColor: '#A1A1AA',
    borderRadius: 2,
  },
  copyFront: {
    position: 'absolute',
    left: '33.33%',
    right: '8.33%',
    top: '8.33%',
    bottom: '33.33%',
    borderWidth: 1,
    borderColor: '#A1A1AA',
    borderRadius: 2,
    backgroundColor: '#27272A',
  },
  copyText: {
    // Figma: fontSize 11, lineHeight 13, Regular, color #A1A1AA
    fontSize: fs(11),
    lineHeight: lh(13),
    fontFamily: fontFamily.regular,
    color: '#A1A1AA',
  },
  promptText: {
    // Figma: fontSize 16, lineHeight 21, Regular
    fontSize: fs(16),
    lineHeight: lh(21),
    fontFamily: fontFamily.regular,
    color: '#FAFAFA',
  },
  styleTag: {
    // Figma: padding 4 8, borderRadius 50, bg rgba(250,250,250,0.1)
    alignSelf: 'flex-start',
    paddingVertical: sp(4),
    paddingHorizontal: sp(8),
    backgroundColor: 'rgba(250, 250, 250, 0.1)',
    borderRadius: radius(50),
  },
  styleTagText: {
    // Figma: fontSize 12, lineHeight 16, Regular
    fontSize: fs(12),
    lineHeight: lh(16),
    fontFamily: fontFamily.regular,
    color: '#FAFAFA',
  },
  bottomSafe: {
    // For home indicator spacing
  },
});
