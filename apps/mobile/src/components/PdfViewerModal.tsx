import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { DentalizationColors } from '../theme/colors';

interface PdfViewerModalProps {
  visible: boolean;
  onClose: () => void;
  onPdfRead: () => void;
  pdfSource: any;
  title: string;
}

const { width, height } = Dimensions.get('window');

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  visible,
  onClose,
  onPdfRead,
  pdfSource,
  title,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const handlePageChanged = useCallback((page: number, numberOfPages: number) => {
    setCurrentPage(page);
    setTotalPages(numberOfPages);
    
    // Check if user has reached the last page (or close to it for single page documents)
    if (page >= numberOfPages || (numberOfPages === 1 && page === 1)) {
      if (!hasReachedEnd) {
        setHasReachedEnd(true);
        // Small delay to ensure they've had time to read
        setTimeout(() => {
          onPdfRead();
        }, 1000);
      }
    }
  }, [hasReachedEnd, onPdfRead]);

  const handleLoadComplete = useCallback((numberOfPages: number, filePath: string) => {
    setTotalPages(numberOfPages);
    console.log(`PDF loaded with ${numberOfPages} pages`);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('PDF Error:', error);
    Alert.alert(
      'PDF Error',
      'Unable to load the document. Please try again.',
      [{ text: 'OK', onPress: onClose }]
    );
  }, [onClose]);

  const handleConfirmRead = () => {
    Alert.alert(
      'Confirm Reading',
      'Have you finished reading the entire document?',
      [
        { text: 'Not Yet', style: 'cancel' },
        { 
          text: 'Yes, I\'ve Read It', 
          onPress: () => {
            onPdfRead();
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.pageIndicator}>
            <Text style={styles.pageText}>
              {totalPages > 0 ? `${currentPage}/${totalPages}` : ''}
            </Text>
          </View>
        </View>

        {/* PDF Viewer */}
        <View style={styles.pdfContainer}>
          <Pdf
            source={pdfSource}
            onLoadComplete={handleLoadComplete}
            onPageChanged={handlePageChanged}
            onError={handleError}
            style={styles.pdf}
            enablePaging={true}
            horizontal={false}
            spacing={10}
            enableDoubleTapZoom={true}
            minScale={1.0}
            maxScale={3.0}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {hasReachedEnd ? (
            <View style={styles.readConfirmation}>
              <Text style={styles.readConfirmationText}>
                You have reached the end of the document
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmRead}
              >
                <Text style={styles.confirmButtonText}>
                  I've Read the Document
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.readingInstruction}>
              <Text style={styles.instructionText}>
                Please scroll to the end of the document to continue
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(currentPage / Math.max(totalPages, 1)) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round((currentPage / Math.max(totalPages, 1)) * 100)}%
                </Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: DentalizationColors.darkGrey,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  pageIndicator: {
    width: 60,
    alignItems: 'flex-end',
  },
  pageText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: DentalizationColors.lightBackground,
  },
  pdf: {
    flex: 1,
    width: width,
    height: height - 200, // Account for header and footer
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  readingInstruction: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: DentalizationColors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    minWidth: 35,
  },
  readConfirmation: {
    alignItems: 'center',
  },
  readConfirmationText: {
    fontSize: 14,
    color: DentalizationColors.success,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmButton: {
    backgroundColor: DentalizationColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
