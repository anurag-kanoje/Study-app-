"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../context/ThemeContext"
import { useToast } from "../../context/ToastContext"
import Button from "../../components/ui/Button"
import {
  Camera,
  Image as ImageIcon,
  FileText,
  Copy,
  Share2,
  Sparkles,
  X,
  Check,
  ChevronDown,
} from "lucide-react-native"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as Clipboard from "expo-clipboard"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInUp,
} from "react-native-reanimated"
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet"

const { width } = Dimensions.get("window")

const AINotesScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { showToast } = useToast()

  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [outputFormat, setOutputFormat] = useState("notes")
  const [outputText, setOutputText] = useState("")

  // Bottom sheet references
  const formatBottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = ["50%"]

  // Animation values
  const uploadAreaHeight = useSharedValue(200)

  const uploadAreaStyle = useAnimatedStyle(() => {
    return {
      height: uploadAreaHeight.value,
    }
  })

  const handleImageSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      })

      if (!result.canceled && result.assets.length > 0) {
        const uris = result.assets.map((asset) => asset.uri)
        setSelectedImages((prevImages) => [...prevImages, ...uris])

        // Animate upload area height
        uploadAreaHeight.value = withTiming(
          Math.max(200, 120 + Math.ceil((selectedImages.length + uris.length) / 3) * 100),
          { duration: 300 },
        )
      }
    } catch (error) {
      console.error("Error selecting images:", error)
      showToast("Failed to select images", "error")
    }
  }

  const handleCameraCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        showToast("Camera permission is required", "error")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      })

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri
        setSelectedImages((prevImages) => [...prevImages, uri])

        // Animate upload area height
        uploadAreaHeight.value = withTiming(Math.max(200, 120 + Math.ceil((selectedImages.length + 1) / 3) * 100), {
          duration: 300,
        })
      }
    } catch (error) {
      console.error("Error capturing image:", error)
      showToast("Failed to capture image", "error")
    }
  }

  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      })

      if (result.canceled === false && result.assets.length > 0) {
        // For simplicity, we'll just show a toast for PDF selection
        // In a real app, you would process the PDF
        showToast("PDF selected: " + result.assets[0].name, "success")
      }
    } catch (error) {
      console.error("Error selecting document:", error)
      showToast("Failed to select document", "error")
    }
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages]
      newImages.splice(index, 1)

      // Animate upload area height
      uploadAreaHeight.value = withTiming(Math.max(200, 120 + Math.ceil(newImages.length / 3) * 100), { duration: 300 })

      return newImages
    })
  }

  const handleProcessImages = async () => {
    if (selectedImages.length === 0) {
      showToast("Please select at least one image", "warning")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call for OCR and processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted text
      const mockExtractedText = `# Biology Notes: Photosynthesis

Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.

## Key Components:
- Chlorophyll
- Sunlight
- Water
- Carbon dioxide

## Process Steps:
1. Light absorption by chlorophyll
2. Water molecules split into hydrogen and oxygen
3. Carbon dioxide converted to glucose
4. Oxygen released as byproduct

## Equation:
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂`

      setExtractedText(mockExtractedText)

      // Generate formatted output based on selected format
      if (outputFormat === "notes") {
        setOutputText(mockExtractedText)
      } else if (outputFormat === "flashcards") {
        const flashcards = `Q: What is photosynthesis?
A: The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.

Q: What are the key components of photosynthesis?
A: Chlorophyll, sunlight, water, and carbon dioxide.

Q: What is the equation for photosynthesis?
A: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

Q: What are the main steps in photosynthesis?
A: 1) Light absorption by chlorophyll, 2) Water molecules split into hydrogen and oxygen, 3) Carbon dioxide converted to glucose, 4) Oxygen released as byproduct.`
      } else if (outputFormat === "summary") {
        setOutputText(
          "Photosynthesis is the process where plants convert sunlight, water, and carbon dioxide into glucose and oxygen. It requires chlorophyll to capture light energy and occurs in two stages: light-dependent reactions and the Calvin cycle. The overall equation is 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂.",
        )
      }

      showToast("Processing complete", "success")
    } catch (error) {
      console.error("Error processing images:", error)
      showToast("Failed to process images", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(outputText)
      showToast("Copied to clipboard", "success")
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      showToast("Failed to copy to clipboard", "error")
    }
  }

  const handleShare = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        showToast("Sharing is not available on this device", "error")
        return
      }

      // Create a temporary file
      const fileUri = FileSystem.documentDirectory + "ai_notes.txt"
      await FileSystem.writeAsStringAsync(fileUri, outputText)

      // Share the file
      await Sharing.shareAsync(fileUri)
    } catch (error) {
      console.error("Error sharing:", error)
      showToast("Failed to share", "error")
    }
  }

  const handleShowFormatOptions = () => {
    formatBottomSheetRef.current?.present()
  }

  const handleSelectFormat = (format: string) => {
    setOutputFormat(format)
    formatBottomSheetRef.current?.dismiss()

    // Regenerate output based on new format
    if (extractedText) {
      if (format === "notes") {
        setOutputText(extractedText)
      } else if (format === "flashcards") {
        const flashcards = `Q: What is photosynthesis?
A: The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.

Q: What are the key components of photosynthesis?
A: Chlorophyll, sunlight, water, and carbon dioxide.

Q: What is the equation for photosynthesis?
A: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

Q: What are the main steps in photosynthesis?
A: 1) Light absorption by chlorophyll, 2) Water molecules split into hydrogen and oxygen, 3) Carbon dioxide converted to glucose, 4) Oxygen released as byproduct.`
        setOutputText(flashcards)
      } else if (format === "summary") {
        setOutputText(
          "Photosynthesis is the process where plants convert sunlight, water, and carbon dioxide into glucose and oxygen. It requires chlorophyll to capture light energy and occurs in two stages: light-dependent reactions and the Calvin cycle. The overall equation is 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂.",
        )
      }
    }
  }

  const renderBackdrop = (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />

  return (
    <BottomSheetModalProvider>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        {!outputText ? (
          <>
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: colors.text }]}>AI Notes from Images</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Upload images of handwritten or printed notes to convert them into digital text
              </Text>
            </View>

            <Animated.View
              style={[
                styles.uploadArea,
                uploadAreaStyle,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.uploadHeader}>
                <Text style={[styles.uploadTitle, { color: colors.text }]}>Upload Files</Text>
                <Text style={[styles.uploadSubtitle, { color: colors.mutedForeground }]}>
                  Select images or PDFs containing text you want to extract
                </Text>
              </View>

              <View style={styles.uploadButtonsContainer}>
                <Button
                  leftIcon={<ImageIcon size={18} color={colors.primaryForeground} />}
                  onPress={handleImageSelection}
                  style={styles.uploadButton}
                >
                  Select Images
                </Button>

                <Button
                  leftIcon={<Camera size={18} color={colors.primaryForeground} />}
                  onPress={handleCameraCapture}
                  style={styles.uploadButton}
                >
                  Take Photo
                </Button>

                <Button
                  leftIcon={<FileText size={18} color={colors.primaryForeground} />}
                  onPress={handleDocumentSelection}
                  style={styles.uploadButton}
                >
                  Select PDF
                </Button>
              </View>

              {selectedImages.length > 0 && (
                <View style={styles.selectedImagesContainer}>
                  <Text style={[styles.selectedImagesTitle, { color: colors.text }]}>
                    Selected Images ({selectedImages.length})
                  </Text>

                  <View style={styles.imageGrid}>
                    {selectedImages.map((uri, index) => (
                      <Animated.View
                        key={index}
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(300)}
                        style={styles.imageContainer}
                      >
                        <Image source={{ uri }} style={styles.selectedImage} />
                        <TouchableOpacity
                          style={[styles.removeImageButton, { backgroundColor: colors.destructive }]}
                          onPress={() => handleRemoveImage(index)}
                        >
                          <X size={12} color={colors.destructiveForeground} />
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </View>
                </View>
              )}
            </Animated.View>

            <View style={styles.formatContainer}>
              <Text style={[styles.formatTitle, { color: colors.text }]}>Output Format</Text>

              <TouchableOpacity
                style={[styles.formatSelector, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={handleShowFormatOptions}
              >
                <View style={styles.formatOption}>
                  {outputFormat === "notes" && <FileText size={20} color={colors.primary} />}
                  {outputFormat === "flashcards" && <FileText size={20} color={colors.primary} />}
                  {outputFormat === "summary" && <FileText size={20} color={colors.primary} />}

                  <Text style={[styles.formatOptionText, { color: colors.text }]}>
                    {outputFormat === "notes" && "Structured Notes"}
                    {outputFormat === "flashcards" && "Flashcards"}
                    {outputFormat === "summary" && "Summary"}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.mutedForeground} />
              </TouchableOpacity>

              <Button
                onPress={handleProcessImages}
                isLoading={isProcessing}
                disabled={selectedImages.length === 0 || isProcessing}
                style={styles.processButton}
              >
                Process Images
              </Button>
            </View>
          </>
        ) : (
          <Animated.View entering={SlideInUp.duration(400)} style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultTitle, { color: colors.text }]}>Extracted Text</Text>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                  onPress={handleCopyToClipboard}
                >
                  <Copy size={18} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                  onPress={handleShare}
                >
                  <Share2 size={18} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                  onPress={handleShowFormatOptions}
                >
                  <FileText size={18} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.outputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ScrollView style={styles.outputScroll}>
                <Text style={[styles.outputText, { color: colors.text }]}>{outputText}</Text>
              </ScrollView>
            </View>

            <View style={styles.enhanceContainer}>
              <Button leftIcon={<Sparkles size={18} color={colors.primaryForeground} />} style={styles.enhanceButton}>
                Enhance with AI
              </Button>

              <Button
                variant="outline"
                onPress={() => {
                  setOutputText("")
                  setExtractedText("")
                }}
                style={styles.newUploadButton}
              >
                New Upload
              </Button>
            </View>
          </Animated.View>
        )}

        <BottomSheetModal
          ref={formatBottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: colors.background }}
          handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>Select Output Format</Text>

            <TouchableOpacity
              style={[
                styles.formatOptionItem,
                outputFormat === "notes" && {
                  backgroundColor: colors.primary + "15",
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleSelectFormat("notes")}
            >
              <View style={styles.formatOptionItemContent}>
                <View style={[styles.formatOptionIcon, { backgroundColor: colors.primary + "15" }]}>
                  <FileText size={24} color={colors.primary} />
                </View>
                <View style={styles.formatOptionTextContainer}>
                  <Text style={[styles.formatOptionItemTitle, { color: colors.text }]}>Structured Notes</Text>
                  <Text style={[styles.formatOptionItemDescription, { color: colors.mutedForeground }]}>
                    Convert to well-organized, formatted notes with headings and bullet points
                  </Text>
                </View>
              </View>
              {outputFormat === "notes" && <Check size={20} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.formatOptionItem,
                outputFormat === "flashcards" && {
                  backgroundColor: colors.primary + "15",
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleSelectFormat("flashcards")}
            >
              <View style={styles.formatOptionItemContent}>
                <View style={[styles.formatOptionIcon, { backgroundColor: colors.primary + "15" }]}>
                  <FileText size={24} color={colors.primary} />
                </View>
                <View style={styles.formatOptionTextContainer}>
                  <Text style={[styles.formatOptionItemTitle, { color: colors.text }]}>Flashcards</Text>
                  <Text style={[styles.formatOptionItemDescription, { color: colors.mutedForeground }]}>
                    Create question and answer pairs for effective studying
                  </Text>
                </View>
              </View>
              {outputFormat === "flashcards" && <Check size={20} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.formatOptionItem,
                outputFormat === "summary" && {
                  backgroundColor: colors.primary + "15",
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleSelectFormat("summary")}
            >
              <View style={styles.formatOptionItemContent}>
                <View style={[styles.formatOptionIcon, { backgroundColor: colors.primary + "15" }]}>
                  <FileText size={24} color={colors.primary} />
                </View>
                <View style={styles.formatOptionTextContainer}>
                  <Text style={[styles.formatOptionItemTitle, { color: colors.text }]}>Summary</Text>
                  <Text style={[styles.formatOptionItemDescription, { color: colors.mutedForeground }]}>
                    Generate a concise summary of the key points and concepts
                  </Text>
                </View>
              </View>
              {outputFormat === "summary" && <Check size={20} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
      </ScrollView>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  uploadArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  uploadHeader: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    minWidth: 120,
  },
  selectedImagesContainer: {
    marginTop: 8,
  },
  selectedImagesTitle: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  formatContainer: {
    marginBottom: 24,
  },
  formatTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 12,
  },
  formatSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  formatOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  formatOptionText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  processButton: {
    marginTop: 8,
  },
  resultContainer: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
  },
  resultActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  outputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 400,
    marginBottom: 24,
  },
  outputScroll: {
    padding: 16,
  },
  outputText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    lineHeight: 24,
  },
  enhanceContainer: {
    gap: 12,
  },
  enhanceButton: {
    marginBottom: 8,
  },
  newUploadButton: {},
  bottomSheetContent: {
    padding: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 16,
  },
  formatOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  formatOptionItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  formatOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  formatOptionTextContainer: {
    flex: 1,
  },
  formatOptionItemTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginBottom: 4,
  },
  formatOptionItemDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
})

export default AINotesScreen

