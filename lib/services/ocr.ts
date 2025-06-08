import { createWorker } from 'tesseract.js';
import { config } from '../config';

export class OCRService {
  private static worker: Tesseract.Worker | null = null;

  private static async getWorker() {
    if (!this.worker) {
      this.worker = await createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
    }
    return this.worker;
  }

  static async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      const worker = await this.getWorker();
      const { data: { text } } = await worker.recognize(imageBuffer);
      return text;
    } catch (error) {
      console.error('Error in OCR processing:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  static async extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
    try {
      const worker = await this.getWorker();
      const { data: { text } } = await worker.recognize(pdfBuffer);
      return text;
    } catch (error) {
      console.error('Error in PDF text extraction:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  static async detectHandwriting(imageBuffer: Buffer): Promise<string> {
    try {
      const worker = await this.getWorker();
      // Configure worker for handwriting recognition
      await worker.setParameters({
        tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?@#$%^&*()_+-=[]{}|;:"\'<>/ ',
      });
      const { data: { text } } = await worker.recognize(imageBuffer);
      return text;
    } catch (error) {
      console.error('Error in handwriting detection:', error);
      throw new Error('Failed to detect handwriting');
    }
  }

  static async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
} 